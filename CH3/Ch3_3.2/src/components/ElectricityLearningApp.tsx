import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type LessonType = 'cell' | 'battery' | 'lamps' | 'circuit' | 'switch';

interface Lesson {
  id: LessonType;
  titleKey: string;
  iconKey: string;
  definitionKey: string;
  keyPointsKey: string;
  keyPointKeys: string[];
}

const ElectricityLearnMode: React.FC = () => {
  const { t } = useLanguage();
  const [activeLesson, setActiveLesson] = useState<LessonType>('cell');

  const lessons: Record<LessonType, Lesson> = {
    cell: {
      id: 'cell',
      titleKey: 'electricity.cell.title',
      iconKey: 'electricity.cell.icon',
      definitionKey: 'electricity.cell.definition',
      keyPointsKey: 'electricity.cell.keyPoints',
      keyPointKeys: [
        'electricity.cell.point1',
        'electricity.cell.point2',
        'electricity.cell.point3',
        'electricity.cell.point4',
        'electricity.cell.point5',
        'electricity.cell.point6'
      ]
    },
    battery: {
      id: 'battery',
      titleKey: 'electricity.battery.title',
      iconKey: 'electricity.battery.icon',
      definitionKey: 'electricity.battery.definition',
      keyPointsKey: 'electricity.battery.keyPoints',
      keyPointKeys: [
        'electricity.battery.point1',
        'electricity.battery.point2',
        'electricity.battery.point3',
        'electricity.battery.point4',
        'electricity.battery.point5',
        'electricity.battery.point6'
      ]
    },
    lamps: {
      id: 'lamps',
      titleKey: 'electricity.lamps.title',
      iconKey: 'electricity.lamps.icon',
      definitionKey: 'electricity.lamps.definition',
      keyPointsKey: 'electricity.lamps.keyPoints',
      keyPointKeys: [
        'electricity.lamps.point1',
        'electricity.lamps.point2',
        'electricity.lamps.point3',
        'electricity.lamps.point4',
        'electricity.lamps.point5',
        'electricity.lamps.point6'
      ]
    },
    circuit: {
      id: 'circuit',
      titleKey: 'electricity.circuit.title',
      iconKey: 'electricity.circuit.icon',
      definitionKey: 'electricity.circuit.definition',
      keyPointsKey: 'electricity.circuit.keyPoints',
      keyPointKeys: [
        'electricity.circuit.point1',
        'electricity.circuit.point2',
        'electricity.circuit.point3',
        'electricity.circuit.point4',
        'electricity.circuit.point5',
        'electricity.circuit.point6'
      ]
    },
    switch: {
      id: 'switch',
      titleKey: 'electricity.switch.title',
      iconKey: 'electricity.switch.icon',
      definitionKey: 'electricity.switch.definition',
      keyPointsKey: 'electricity.switch.keyPoints',
      keyPointKeys: [
        'electricity.switch.point1',
        'electricity.switch.point2',
        'electricity.switch.point3',
        'electricity.switch.point4',
        'electricity.switch.point5',
        'electricity.switch.point6'
      ]
    }
  };

  const currentLesson = lessons[activeLesson];

  // Cell SVG
  const CellDiagram = () => (
    <svg width="300" height="240" viewBox="0 0 300 240">
      <defs>
        <linearGradient id="cellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#e74c3c', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#c0392b', stopOpacity: 1 }} />
        </linearGradient>
        <marker id="arrowred" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#e74c3c" />
        </marker>
        <marker id="arrowgray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#34495e" />
        </marker>
      </defs>

      {/* Cell body */}
      <rect x="110" y="70" width="80" height="100" fill="url(#cellGrad)" stroke="#000" strokeWidth="3" rx="8" />

      {/* Positive terminal (metal cap) */}
      <rect x="130" y="50" width="40" height="20" fill="#95a5a6" stroke="#000" strokeWidth="2" rx="3" />
      <text x="150" y="40" fontSize="24" fontWeight="bold" fill="#e74c3c" textAnchor="middle">+</text>

      {/* Negative terminal (flat disc) */}
      <rect x="135" y="170" width="30" height="8" fill="#34495e" stroke="#000" strokeWidth="2" />
      <text x="150" y="200" fontSize="24" fontWeight="bold" fill="#34495e" textAnchor="middle">−</text>

      {/* Voltage Label */}
      <text x="150" y="125" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">1.5V</text>

      {/* Left Label: Metal Cap */}
      <text x="100" y="65" fontSize="14" fill="#e74c3c" textAnchor="end" fontWeight="500">{t('electricity.metalCap')}</text>
      <line x1="105" y1="60" x2="128" y2="60" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#arrowred)" />

      {/* Right Label: Flat Disc */}
      <text x="210" y="180" fontSize="14" fill="#34495e" textAnchor="start" fontWeight="500">{t('electricity.flatDisc')}</text>
      <line x1="205" y1="175" x2="165" y2="175" stroke="#34495e" strokeWidth="2" markerEnd="url(#arrowgray)" />
    </svg>
  );

  // Battery SVG
  const BatteryDiagram = () => (
    <svg width="300" height="200" viewBox="0 0 300 200">
      {/* First cell */}
      <g transform="translate(40, 70)">
        <rect x="0" y="0" width="50" height="80" fill="#e74c3c" stroke="#000" strokeWidth="2" rx="5" />
        <text x="25" y="45" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">{t('electricity.battery.cell', { number: '1' })}</text>
        <text x="25" y="-10" fontSize="16" fontWeight="bold" fill="#e74c3c">+</text>
        <text x="25" y="100" fontSize="16" fontWeight="bold" fill="#34495e">−</text>
      </g>
      {/* Connection wire */}
      <line x1="90" y1="150" x2="110" y2="150" stroke="#ff9800" strokeWidth="4" />
      {/* Second cell */}
      <g transform="translate(110, 70)">
        <rect x="0" y="0" width="50" height="80" fill="#e74c3c" stroke="#000" strokeWidth="2" rx="5" />
        <text x="25" y="45" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">{t('electricity.battery.cell', { number: '2' })}</text>
        <text x="25" y="-10" fontSize="16" fontWeight="bold" fill="#e74c3c">+</text>
        <text x="25" y="100" fontSize="16" fontWeight="bold" fill="#34495e">−</text>
      </g>
      {/* Connection wire */}
      <line x1="160" y1="150" x2="180" y2="150" stroke="#ff9800" strokeWidth="4" />
      {/* Third cell */}
      <g transform="translate(180, 70)">
        <rect x="0" y="0" width="50" height="80" fill="#e74c3c" stroke="#000" strokeWidth="2" rx="5" />
        <text x="25" y="45" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">{t('electricity.battery.cell', { number: '3' })}</text>
        <text x="25" y="-10" fontSize="16" fontWeight="bold" fill="#e74c3c">+</text>
        <text x="25" y="100" fontSize="16" fontWeight="bold" fill="#34495e">−</text>
      </g>
      {/* Label */}
      <text x="150" y="30" fontSize="16" fontWeight="bold" fill="#2c3e50" textAnchor="middle">{t('electricity.battery.multipleCells')}</text>
      <text x="150" y="185" fontSize="14" fill="#27ae60" textAnchor="middle">{t('electricity.battery.totalVoltage')}</text>
    </svg>
  );

  // Lamp SVG
  const LampDiagram = () => (
    <svg width="250" height="250" viewBox="0 0 250 250">
      {/* Bulb glass */}
      <circle cx="125" cy="100" r="60" fill="rgba(255, 235, 59, 0.3)" stroke="#000" strokeWidth="3" />
      {/* Filament */}
      <path d="M 110,80 Q 125,70 140,80 Q 125,90 110,80" fill="none" stroke="#ff6f00" strokeWidth="3" />
      <path d="M 110,100 Q 125,90 140,100 Q 125,110 110,100" fill="none" stroke="#ff6f00" strokeWidth="3" />
      <path d="M 110,120 Q 125,110 140,120 Q 125,130 110,120" fill="none" stroke="#ff6f00" strokeWidth="3" />
      {/* Base */}
      <rect x="110" y="160" width="30" height="40" fill="#95a5a6" stroke="#000" strokeWidth="2" />
      <circle cx="125" cy="200" r="8" fill="#7f8c8d" stroke="#000" strokeWidth="2" />
      {/* Light rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 125 + Math.cos(rad) * 70;
        const y1 = 100 + Math.sin(rad) * 70;
        const x2 = 125 + Math.cos(rad) * 85;
        const y2 = 100 + Math.sin(rad) * 85;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#ffeb3b"
            strokeWidth="3"
          />
        );
      })}
      {/* Labels */}
      <text x="125" y="230" fontSize="12" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('electricity.lamp.filamentHeats')}</text>
      <text x="125" y="245" fontSize="12" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('electricity.lamp.andGlows')}</text>
      <text x="20" y="100" fontSize="11" fill="#ff6f00">{t('electricity.lamp.tungsten')}</text>
      <text x="20" y="115" fontSize="11" fill="#ff6f00">{t('electricity.lamp.filament')}</text>
      <line x1="50" y1="105" x2="95" y2="105" stroke="#ff6f00" strokeWidth="2" markerEnd="url(#arrow)" />
    </svg>
  );

  // Circuit SVG - FIXED VERSION
  const CircuitDiagram = () => (
    <svg width="450" height="320" viewBox="0 0 450 320">
      {/* Battery - Left side */}
      <g transform="translate(80, 130)">
        {/* Battery symbol - circuit diagram style */}
        <line x1="0" y1="20" x2="0" y2="40" stroke="#000" strokeWidth="5" />
        <line x1="30" y1="15" x2="30" y2="45" stroke="#000" strokeWidth="5" />
        <line x1="50" y1="20" x2="50" y2="40" stroke="#000" strokeWidth="5" />
        <line x1="80" y1="15" x2="80" y2="45" stroke="#000" strokeWidth="5" />
        <text x="40" y="-5" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#2c3e50">{t('electricity.battery.label')}</text>
        <text x="-15" y="35" fontSize="18" fontWeight="bold" fill="#e74c3c">−</text>
        <text x="95" y="35" fontSize="18" fontWeight="bold" fill="#e74c3c">+</text>
      </g>

      {/* Wire from battery positive (right) going UP */}
      <line x1="160" y1="160" x2="160" y2="80" stroke="#ff9800" strokeWidth="5" />
      <circle cx="160" cy="160" r="5" fill="#000" />
      <circle cx="160" cy="80" r="5" fill="#000" />

      {/* Wire going RIGHT to bulb */}
      <line x1="160" y1="80" x2="280" y2="80" stroke="#ff9800" strokeWidth="5" />
      <circle cx="280" cy="80" r="5" fill="#000" />

      {/* Bulb - Top right */}
      <g transform="translate(280, 80)">
        <circle cx="0" cy="0" r="35" stroke="#000" strokeWidth="4" fill="#ffeb3b" opacity="0.5" />
        <line x1="-18" y1="-18" x2="18" y2="18" stroke="#000" strokeWidth="3" />
        <line x1="-18" y1="18" x2="18" y2="-18" stroke="#000" strokeWidth="3" />
        <text x="0" y="55" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#2c3e50">{t('electricity.circuit.bulb')}</text>
      </g>
      <circle cx="280" cy="115" r="5" fill="#000" />

      {/* Wire from bulb going DOWN */}
      <line x1="280" y1="115" x2="280" y2="240" stroke="#ff9800" strokeWidth="5" />
      <circle cx="280" cy="240" r="5" fill="#000" />

      {/* Wire going LEFT back to battery */}
      <line x1="280" y1="240" x2="80" y2="240" stroke="#ff9800" strokeWidth="5" />
      <circle cx="80" cy="240" r="5" fill="#000" />

      {/* Wire going UP to battery negative terminal */}
      <line x1="80" y1="240" x2="80" y2="160" stroke="#ff9800" strokeWidth="5" />
      <circle cx="80" cy="160" r="5" fill="#000" />

      {/* Current flow direction indicators */}
      <g>
        {/* Arrow pointing right at top */}
        <polygon points="220,80 215,75 215,85" fill="#e74c3c" />
        <text x="200" y="70" fontSize="13" fill="#e74c3c" fontWeight="bold">{t('electricity.circuit.currentFlow')}</text>

        {/* Arrow pointing down on right side */}
        <polygon points="280,180 275,175 285,175" fill="#e74c3c" />

        {/* Arrow pointing left at bottom */}
        <polygon points="180,240 185,235 185,245" fill="#e74c3c" />

        {/* Arrow pointing up on left side */}
        <polygon points="80,200 75,205 85,205" fill="#e74c3c" />
      </g>

      {/* Complete circuit label */}
      <rect x="20" y="280" width="410" height="30" fill="#d5f4e6" stroke="#27ae60" strokeWidth="2" rx="5" />
      <text x="225" y="300" fontSize="13" textAnchor="middle" fill="#27ae60" fontWeight="bold">{t('electricity.circuit.completeCircuit')}</text>
    </svg>
  );

  // Switch SVG
  const SwitchDiagram = () => (
    <svg width="400" height="350" viewBox="0 0 400 350">
      {/* Switch ON Circuit */}
      <g>
        <text x="100" y="30" fontSize="16" fontWeight="bold" fill="#27ae60">{t('electricity.switch.on')}</text>
        {/* Battery */}
        <g transform="translate(30, 60)">
          <line x1="0" y1="10" x2="0" y2="30" stroke="#000" strokeWidth="3" />
          <line x1="15" y1="7" x2="15" y2="33" stroke="#000" strokeWidth="3" />
        </g>
        {/* Wire */}
        <line x1="45" y1="75" x2="80" y2="75" stroke="#ff9800" strokeWidth="3" />
        {/* Switch closed */}
        <circle cx="80" cy="75" r="4" fill="#000" />
        <line x1="80" y1="75" x2="140" y2="75" stroke="#000" strokeWidth="3" />
        <circle cx="140" cy="75" r="4" fill="#000" />
        {/* Wire */}
        <line x1="140" y1="75" x2="180" y2="75" stroke="#ff9800" strokeWidth="3" />
        {/* Bulb */}
        <circle cx="180" cy="75" r="15" stroke="#000" strokeWidth="2" fill="#ffeb3b" opacity="0.6" />
        <line x1="172" y1="67" x2="188" y2="83" stroke="#000" strokeWidth="2" />
        <line x1="172" y1="83" x2="188" y2="67" stroke="#000" strokeWidth="2" />
        <text x="210" y="80" fontSize="12" fill="#27ae60" fontWeight="bold">{t('electricity.switch.bulbOn')}</text>
      </g>

      {/* Switch OFF Circuit */}
      <g transform="translate(0, 150)">
        <text x="100" y="30" fontSize="16" fontWeight="bold" fill="#e74c3c">{t('electricity.switch.off')}</text>
        {/* Battery */}
        <g transform="translate(30, 60)">
          <line x1="0" y1="10" x2="0" y2="30" stroke="#000" strokeWidth="3" />
          <line x1="15" y1="7" x2="15" y2="33" stroke="#000" strokeWidth="3" />
        </g>
        {/* Wire */}
        <line x1="45" y1="75" x2="80" y2="75" stroke="#ff9800" strokeWidth="3" />
        {/* Switch open */}
        <circle cx="80" cy="75" r="4" fill="#000" />
        <line x1="80" y1="75" x2="130" y2="55" stroke="#000" strokeWidth="3" />
        <circle cx="140" cy="75" r="4" fill="#000" />
        {/* Gap indicator */}
        <text x="105" y="50" fontSize="12" fill="#e74c3c" fontWeight="bold">{t('electricity.switch.gap')}</text>
        {/* Wire */}
        <line x1="140" y1="75" x2="180" y2="75" stroke="#ff9800" strokeWidth="3" />
        {/* Bulb */}
        <circle cx="180" cy="75" r="15" stroke="#000" strokeWidth="2" fill="none" />
        <line x1="172" y1="67" x2="188" y2="83" stroke="#000" strokeWidth="2" />
        <line x1="172" y1="83" x2="188" y2="67" stroke="#000" strokeWidth="2" />
        <text x="210" y="80" fontSize="12" fill="#e74c3c" fontWeight="bold">{t('electricity.switch.bulbOff')}</text>
      </g>

      {/* Explanation */}
      <rect x="10" y="310" width="380" height="35" fill="#e8f4f8" stroke="#3498db" strokeWidth="2" rx="5" />
      <text x="200" y="327" fontSize="11" textAnchor="middle" fill="#2c3e50">{t('electricity.switch.whenOn')}</text>
      <text x="200" y="340" fontSize="11" textAnchor="middle" fill="#2c3e50">{t('electricity.switch.whenOff')}</text>
    </svg>
  );

  const renderDiagram = () => {
    switch (activeLesson) {
      case 'cell':
        return <CellDiagram />;
      case 'battery':
        return <BatteryDiagram />;
      case 'lamps':
        return <LampDiagram />;
      case 'circuit':
        return <CircuitDiagram />;
      case 'switch':
        return <SwitchDiagram />;
      default:
        return <CellDiagram />;
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#e8eaf6'
    }}>
      {/* Lesson Navigation */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '1.1em',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            {t('electricity.lessons')}:
          </span>
          {Object.values(lessons).map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              style={{
                padding: '12px 24px',
                backgroundColor: activeLesson === lesson.id ? '#3498db' : '#ecf0f1',
                color: activeLesson === lesson.id ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1em',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeLesson === lesson.id ? '0 4px 8px rgba(52, 152, 219, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (activeLesson !== lesson.id) {
                  e.currentTarget.style.backgroundColor = '#d5dbdb';
                }
              }}
              onMouseOut={(e) => {
                if (activeLesson !== lesson.id) {
                  e.currentTarget.style.backgroundColor = '#ecf0f1';
                }
              }}
            >
              <span style={{ fontSize: '1.2em' }}>{t(lesson.iconKey)}</span>
              <span>{t(`electricity.lesson.${lesson.id}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        {/* Title */}
        <h1 style={{
          margin: '0 0 30px 0',
          color: '#2c3e50',
          fontSize: '2.5em',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span style={{ fontSize: '1.2em' }}>{t(currentLesson.iconKey)}</span>
          {t(currentLesson.titleKey)}
        </h1>

        {/* Diagram Section */}
        <div style={{
          backgroundColor: '#fef9e7',
          padding: '30px',
          borderRadius: '12px',
          border: '3px solid #f9e79f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          {renderDiagram()}
        </div>

        {/* Definition Section */}
        <div style={{
          backgroundColor: '#e8f8f5',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '3px solid #a3e4d7'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            color: '#138d75',
            fontSize: '1.4em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📖 {t('electricity.definition')}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '1.1em',
            lineHeight: '1.8',
            color: '#2c3e50'
          }}>
            {t(currentLesson.definitionKey)}
          </p>
        </div>

        {/* Key Points Section */}
        <div style={{
          backgroundColor: '#ebf5fb',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '3px solid #aed6f1'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            color: '#2874a6',
            fontSize: '1.4em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            💡 {t(currentLesson.keyPointsKey)}
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: '25px',
            listStyle: 'none'
          }}>
            {currentLesson.keyPointKeys.map((pointKey, index) => (
              <li key={index} style={{
                marginBottom: '12px',
                fontSize: '1.05em',
                lineHeight: '1.6',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{
                  color: '#3498db',
                  fontWeight: 'bold',
                  fontSize: '1.2em',
                  minWidth: '20px'
                }}>
                  •
                </span>
                <span>{t(pointKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ElectricityLearnMode;