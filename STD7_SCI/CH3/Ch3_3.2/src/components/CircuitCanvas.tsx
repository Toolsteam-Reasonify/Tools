import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CircuitComponent } from '@/interfaces/circuitTypes';
import ElectricCell from './circuit/ElectricCell';
import Battery from './circuit/Battery';
import Lamp from './circuit/Lamp';
import LED from './circuit/LED';
import Switch from './circuit/Switch';
import Wire from './circuit/Wire';

interface CircuitCanvasProps {
  components: CircuitComponent[];
  circuitComplete: boolean;
  currentFlowing: boolean;
  onComponentClick?: (componentId: string) => void;
  interactive?: boolean;
}

const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  components,
  circuitComplete,
  currentFlowing,
  onComponentClick,
  interactive = false,
}) => {
  const { t } = useLanguage();
  const renderComponent = (component: CircuitComponent) => {
    const commonProps = {
      key: component.id,
      x: component.position.x,
      y: component.position.y,
      onClick: () => onComponentClick?.(component.id),
      interactive,
    };

    switch (component.type) {
      case 'cell':
        return <ElectricCell {...commonProps} />;
      case 'battery':
        return <Battery {...commonProps} />;
      case 'lamp':
        return (
          <Lamp
            {...commonProps}
            glowing={currentFlowing && circuitComplete}
          />
        );
      case 'led':
        return (
          <LED
            {...commonProps}
            glowing={currentFlowing && circuitComplete}
            polarity={component.polarity}
          />
        );
      case 'switch':
        return (
          <Switch
            {...commonProps}
            state={component.state}
            closed={component.state === 'closed'}
          />
        );
      case 'wire':
        return <Wire {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
      {components.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 px-4 pointer-events-none">
          <div className="text-4xl mb-3">🔌</div>
          <p className="font-semibold text-gray-700">{t('practice.noComponents.title')}</p>
          <p className="text-sm text-gray-500 mt-1">{t('practice.noComponents.desc')}</p>
        </div>
      )}
      <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
        {/* Render wires first (background) */}
        {components
          .filter((c) => c.type === 'wire')
          .map((component) => renderComponent(component))}

        {/* Render other components */}
        {components
          .filter((c) => c.type !== 'wire')
          .map((component) => renderComponent(component))}
      </svg>

      {/* Circuit status indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            circuitComplete && currentFlowing
              ? 'bg-green-500'
              : circuitComplete
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
        >
          {circuitComplete && currentFlowing
            ? `⚡ ${t('common.status.flowing')}`
            : circuitComplete
            ? `🔌 ${t('common.status.complete')}`
            : `❌ ${t('common.status.incomplete')}`}
        </div>
      </div>
    </div>
  );
};

export default CircuitCanvas;

