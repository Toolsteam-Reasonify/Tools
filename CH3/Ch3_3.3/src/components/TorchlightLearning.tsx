import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ElectricalComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

const TorchlightLearning: React.FC = () => {
  const { t } = useLanguage();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const components: ElectricalComponent[] = useMemo(
    () => [
      {
        id: 'cell',
        name: t('learn.symbols.cell.name'),
        category: t('learnSymbols.categories.power'),
        description: t('learn.symbols.cell.description'),
        icon: '🔋',
      },
      {
        id: 'battery',
        name: t('learn.symbols.battery.name'),
        category: t('learnSymbols.categories.power'),
        description: t('learn.symbols.battery.description'),
        icon: '🔋',
      },
      {
        id: 'lamp',
        name: t('learn.symbols.lamp.name'),
        category: t('learnSymbols.categories.output'),
        description: t('learn.symbols.lamp.description'),
        icon: '💡',
      },
      {
        id: 'led',
        name: t('learn.symbols.led.name'),
        category: t('learnSymbols.categories.output'),
        description: t('learn.symbols.led.description'),
        icon: '💡',
      },
      {
        id: 'switch-on',
        name: t('learn.symbols.switchOn.name'),
        category: t('learnSymbols.categories.control'),
        description: t('learn.symbols.switchOn.description'),
        icon: '🔘',
      },
      {
        id: 'switch-off',
        name: t('learn.symbols.switchOff.name'),
        category: t('learnSymbols.categories.control'),
        description: t('learn.symbols.switchOff.description'),
        icon: '🔘',
      },
      {
        id: 'wire',
        name: t('learn.symbols.wire.name'),
        category: t('learnSymbols.categories.conductor'),
        description: t('learn.symbols.wire.description'),
        icon: '⚡',
      },
    ],
    [t],
  );

  const positiveLabel = t('learn.examples.labels.positive');
  const negativeLabel = t('learn.examples.labels.negative');

  const ElectricCellSVG = () => (
    <svg width="120" height="60" viewBox="0 0 120 60" aria-label={t('learn.symbols.cell.name')}>
      <line x1="10" y1="30" x2="40" y2="30" stroke="#ff9800" strokeWidth="3" />
      <line x1="40" y1="20" x2="40" y2="40" stroke="#000" strokeWidth="4" />
      <line x1="80" y1="15" x2="80" y2="45" stroke="#000" strokeWidth="4" />
      <line x1="80" y1="30" x2="110" y2="30" stroke="#ff9800" strokeWidth="3" />
      <text x="35" y="15" fontSize="12" fontWeight="bold" fill="#e74c3c">
        {negativeLabel}
      </text>
      <text x="75" y="15" fontSize="12" fontWeight="bold" fill="#e74c3c">
        {positiveLabel}
      </text>
    </svg>
  );

  const BatterySVG = () => (
    <svg width="140" height="60" viewBox="0 0 140 60" aria-label={t('learn.symbols.battery.name')}>
      <line x1="10" y1="30" x2="30" y2="30" stroke="#ff9800" strokeWidth="3" />
      <line x1="30" y1="20" x2="30" y2="40" stroke="#000" strokeWidth="4" />
      <line x1="50" y1="15" x2="50" y2="45" stroke="#000" strokeWidth="4" />
      <line x1="70" y1="20" x2="70" y2="40" stroke="#000" strokeWidth="4" />
      <line x1="90" y1="15" x2="90" y2="45" stroke="#000" strokeWidth="4" />
      <line x1="110" y1="20" x2="110" y2="40" stroke="#000" strokeWidth="4" />
      <line x1="110" y1="30" x2="130" y2="30" stroke="#ff9800" strokeWidth="3" />
      <text x="25" y="15" fontSize="12" fontWeight="bold" fill="#e74c3c">
        {negativeLabel}
      </text>
      <text x="105" y="15" fontSize="12" fontWeight="bold" fill="#e74c3c">
        {positiveLabel}
      </text>
    </svg>
  );

  const ElectricLampSVG = () => (
    <svg width="120" height="80" viewBox="0 0 120 80" aria-label={t('learn.symbols.lamp.name')}>
      <line x1="10" y1="40" x2="35" y2="40" stroke="#ff9800" strokeWidth="3" />
      <circle cx="60" cy="40" r="20" stroke="#000" strokeWidth="3" fill="none" />
      <line x1="50" y1="30" x2="70" y2="50" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="50" x2="70" y2="30" stroke="#000" strokeWidth="2" />
      <line x1="85" y1="40" x2="110" y2="40" stroke="#ff9800" strokeWidth="3" />
    </svg>
  );

  const LEDSVG = () => (
    <svg width="140" height="80" viewBox="0 0 140 80" aria-label={t('learn.symbols.led.name')}>
      <line x1="10" y1="40" x2="40" y2="40" stroke="#ff9800" strokeWidth="3" />
      <polygon points="40,25 40,55 70,40" stroke="#000" strokeWidth="3" fill="none" />
      <line x1="70" y1="25" x2="70" y2="55" stroke="#000" strokeWidth="3" />
      <line x1="70" y1="40" x2="100" y2="40" stroke="#ff9800" strokeWidth="3" />
      <line x1="50" y1="20" x2="60" y2="10" stroke="#ffeb3b" strokeWidth="2" />
      <polygon points="60,10 55,12 58,15" fill="#ffeb3b" />
      <line x1="60" y1="20" x2="70" y2="10" stroke="#ffeb3b" strokeWidth="2" />
      <polygon points="70,10 65,12 68,15" fill="#ffeb3b" />
    </svg>
  );

  const SwitchOnSVG = () => (
    <svg width="120" height="60" viewBox="0 0 120 60" aria-label={t('learn.symbols.switchOn.name')}>
      <line x1="10" y1="30" x2="40" y2="30" stroke="#ff9800" strokeWidth="3" />
      <circle cx="40" cy="30" r="4" fill="#000" />
      <line x1="40" y1="30" x2="80" y2="30" stroke="#000" strokeWidth="3" />
      <circle cx="80" cy="30" r="4" fill="#000" />
      <line x1="80" y1="30" x2="110" y2="30" stroke="#ff9800" strokeWidth="3" />
      <text x="50" y="20" fontSize="10" fill="#27ae60" fontWeight="bold">
        {t('component.on')}
      </text>
    </svg>
  );

  const SwitchOffSVG = () => (
    <svg width="120" height="60" viewBox="0 0 120 60" aria-label={t('learn.symbols.switchOff.name')}>
      <line x1="10" y1="30" x2="40" y2="30" stroke="#ff9800" strokeWidth="3" />
      <circle cx="40" cy="30" r="4" fill="#000" />
      <line x1="40" y1="30" x2="75" y2="15" stroke="#000" strokeWidth="3" />
      <circle cx="80" cy="30" r="4" fill="#000" />
      <line x1="80" y1="30" x2="110" y2="30" stroke="#ff9800" strokeWidth="3" />
      <line x1="75" y1="15" x2="85" y2="10" stroke="#e74c3c" strokeWidth="1" strokeDasharray="2,2" />
      <text x="50" y="12" fontSize="10" fill="#e74c3c" fontWeight="bold">
        {t('component.off')}
      </text>
    </svg>
  );

  const WireSVG = () => (
    <svg width="120" height="40" viewBox="0 0 120 40" aria-label={t('learn.symbols.wire.name')}>
      <line x1="10" y1="20" x2="110" y2="20" stroke="#ff9800" strokeWidth="4" />
      <circle cx="10" cy="20" r="3" fill="#000" />
      <circle cx="110" cy="20" r="3" fill="#000" />
    </svg>
  );

  const renderSymbol = (id: string) => {
    switch (id) {
      case 'cell':
        return <ElectricCellSVG />;
      case 'battery':
        return <BatterySVG />;
      case 'lamp':
        return <ElectricLampSVG />;
      case 'led':
        return <LEDSVG />;
      case 'switch-on':
        return <SwitchOnSVG />;
      case 'switch-off':
        return <SwitchOffSVG />;
      case 'wire':
        return <WireSVG />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
      }}
      aria-label={t('learnSymbols.aria.page')}
    >
      <div
        style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: '2.5em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
          }}
        >
          <span>⚡</span>
          <span>{t('learnSymbols.header.title')}</span>
        </h1>
        <p style={{ margin: 0, fontSize: '1.1em', opacity: 0.9 }}>{t('learnSymbols.header.subtitle')}</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
        aria-label={t('learnSymbols.aria.symbolsGrid')}
      >
        {components.map((component) => (
          <div
            key={component.id}
            onClick={() => setSelectedComponent(component.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedComponent(component.id)}
            style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '10px',
              boxShadow:
                selectedComponent === component.id
                  ? '0 4px 12px rgba(52, 152, 219, 0.4)'
                  : '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border:
                selectedComponent === component.id
                  ? '3px solid #3498db'
                  : '3px solid transparent',
              transform: selectedComponent === component.id ? 'translateY(-5px)' : 'translateY(0)',
            }}
            aria-pressed={selectedComponent === component.id}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '2px solid #ecf0f1',
              }}
            >
              <div
                style={{
                  fontSize: '2em',
                  marginRight: '15px',
                  backgroundColor: '#ecf0f1',
                  padding: '10px',
                  borderRadius: '8px',
                }}
                aria-hidden
              >
                {component.icon}
              </div>
              <div>
                <h3
                  style={{
                    margin: '0 0 5px 0',
                    color: '#2c3e50',
                    fontSize: '1.4em',
                  }}
                >
                  {component.name}
                </h3>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: 'bold',
                  }}
                >
                  {component.category}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                marginBottom: '15px',
                minHeight: '100px',
                border: '2px dashed #ddd',
              }}
              aria-label={t('learnSymbols.aria.symbolPreview', { component: component.name })}
            >
              {renderSymbol(component.id)}
            </div>

            <p
              style={{
                margin: 0,
                color: '#555',
                fontSize: '0.95em',
                lineHeight: '1.6',
                fontStyle: 'italic',
              }}
            >
              {component.description}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: '#2c3e50',
            borderBottom: '3px solid #3498db',
            paddingBottom: '15px',
            marginBottom: '25px',
          }}
        >
          {t('learnSymbols.example.title')}
        </h2>

        <svg
          width="100%"
          height="350"
          viewBox="0 0 800 350"
          style={{
            border: '2px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
          }}
          aria-label={t('learnSymbols.example.title')}
        >
          <g transform="translate(150, 150)">
            <line x1="0" y1="20" x2="0" y2="40" stroke="#000" strokeWidth="4" />
            <line x1="20" y1="15" x2="20" y2="45" stroke="#000" strokeWidth="4" />
            <line x1="40" y1="20" x2="40" y2="40" stroke="#000" strokeWidth="4" />
            <line x1="60" y1="15" x2="60" y2="45" stroke="#000" strokeWidth="4" />
            <text x="30" y="-5" fontSize="14" fontWeight="bold" textAnchor="middle">
              {t('learnSymbols.example.batteryLabel')}
            </text>
            <text x="-15" y="35" fontSize="16" fontWeight="bold" fill="#e74c3c">
              {negativeLabel}
            </text>
            <text x="75" y="35" fontSize="16" fontWeight="bold" fill="#e74c3c">
              {positiveLabel}
            </text>
          </g>

          <line x1="210" y1="180" x2="210" y2="100" stroke="#ff9800" strokeWidth="5" />
          <line x1="210" y1="100" x2="350" y2="100" stroke="#ff9800" strokeWidth="5" />

          <g transform="translate(350, 100)">
            <circle cx="0" cy="0" r="6" fill="#000" />
            <line x1="0" y1="0" x2="80" y2="0" stroke="#000" strokeWidth="5" />
            <circle cx="80" cy="0" r="6" fill="#000" />
            <text x="40" y="-15" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#27ae60">
              {t('learn.symbols.switchOn.name')}
            </text>
          </g>

          <line x1="430" y1="100" x2="550" y2="100" stroke="#ff9800" strokeWidth="5" />

          <g transform="translate(550, 100)">
            <circle cx="0" cy="0" r="35" stroke="#000" strokeWidth="4" fill="#ffeb3b" opacity="0.4" />
            <line x1="-18" y1="-18" x2="18" y2="18" stroke="#000" strokeWidth="3" />
            <line x1="-18" y1="18" x2="18" y2="-18" stroke="#000" strokeWidth="3" />
            <text x="0" y="60" fontSize="14" fontWeight="bold" textAnchor="middle">
              {t('learn.symbols.lamp.name')}
            </text>
          </g>

          <line x1="550" y1="135" x2="550" y2="250" stroke="#ff9800" strokeWidth="5" />
          <line x1="550" y1="250" x2="150" y2="250" stroke="#ff9800" strokeWidth="5" />
          <line x1="150" y1="250" x2="150" y2="180" stroke="#ff9800" strokeWidth="5" />

          <circle cx="210" cy="180" r="5" fill="#000" />
          <circle cx="210" cy="100" r="5" fill="#000" />
          <circle cx="350" cy="100" r="5" fill="#000" />
          <circle cx="430" cy="100" r="5" fill="#000" />
          <circle cx="550" cy="100" r="5" fill="#000" />
          <circle cx="550" cy="135" r="5" fill="#000" />
          <circle cx="550" cy="250" r="5" fill="#000" />
          <circle cx="150" cy="250" r="5" fill="#000" />
          <circle cx="150" cy="180" r="5" fill="#000" />

          <text x="270" y="85" fontSize="14" fill="#e74c3c" fontWeight="bold">
            {t('learnSymbols.example.currentFlow')}
          </text>

          <polygon points="490,100 485,95 485,105" fill="#e74c3c" />
          <polygon points="550,200 545,195 555,195" fill="#e74c3c" />
          <polygon points="300,250 305,245 305,255" fill="#e74c3c" />
          <polygon points="150,220 145,225 155,225" fill="#e74c3c" />
        </svg>

        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e8f4f8',
            borderLeft: '4px solid #3498db',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.95em', lineHeight: '1.6' }}>
            <strong>{t('learnSymbols.example.circuitHeading')}</strong>{' '}
            {t('learnSymbols.example.circuitExplanation')}
          </p>
        </div>
      </div>

    </div>
  );
};

export default TorchlightLearning;
