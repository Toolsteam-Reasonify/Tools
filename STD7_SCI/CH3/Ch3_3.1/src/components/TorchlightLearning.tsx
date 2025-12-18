import React, { useState } from 'react';
import { Zap, Battery, Lightbulb, Power, Eye, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Step =
  | 'observe'
  | 'parts';

const TorchlightLearning: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('observe');
  const [torchOn, setTorchOn] = useState(false);
  const baseDelay = 0.08;

  const Animated: React.FC<{ index: number; className?: string; children: React.ReactNode }> = ({ index, className = '', children }) => (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${index * baseDelay}s`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );

  const renderObserve = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <Animated index={0} className="flex items-center gap-3 text-3xl font-bold text-orange-600 mb-6">
        <Eye className="w-10 h-10" />
        <span>{t('torch.observe.title')}</span>
      </Animated>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Interactive Torch */}
        <Animated index={1} className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-xl">
          <Animated index={0}>
            <h3 className="text-xl font-semibold text-center mb-6">{t('torch.observe.clickTorch')}</h3>
          </Animated>

          <div className="relative flex flex-col items-center">
            {torchOn && (
              <div
                className="absolute -top-20 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[80px] border-b-yellow-400 opacity-50 animate-pulse"
                style={{ filter: 'blur(8px)' }}
              />
            )}

            <Animated index={1}>
              <div
                onClick={() => setTorchOn(!torchOn)}
                className="relative cursor-pointer transform hover:scale-105 transition-transform"
              >
                {/* Torch Head */}
                <div
                  className={`w-32 h-24 rounded-t-full ${
                    torchOn ? 'bg-gradient-to-b from-yellow-300 to-yellow-400' : 'bg-gradient-to-b from-gray-400 to-gray-500'
                  } relative shadow-xl`}
                >
                  <div
                    className={`absolute inset-4 rounded-full ${torchOn ? 'bg-yellow-200 animate-pulse' : 'bg-gray-300'} border-4 border-gray-600 shadow-inner`}
                  >
                    {torchOn && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-yellow-100 animate-ping opacity-75" />
                        <div className="absolute inset-2 rounded-full bg-white opacity-50" />
                      </>
                    )}
                  </div>
                </div>
                {/* Torch Body */}
                <div className="w-28 h-40 mx-auto bg-gradient-to-b from-red-600 to-red-700 rounded-b-2xl shadow-xl relative">
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div className={`w-12 h-6 rounded-full ${torchOn ? 'bg-green-400' : 'bg-gray-500'} shadow-inner relative transition-all`}>
                      <div
                        className={`absolute top-1 ${torchOn ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full shadow-md transition-all`}
                      />
                    </div>
                    <p className="text-xs text-white text-center mt-1 font-semibold">{torchOn ? t('component.on') : t('component.off')}</p>
                  </div>
                </div>
              </div>
            </Animated>
            <Animated index={2}>
              <p className="mt-8 text-center text-gray-700 font-semibold bg-blue-50 p-3 rounded-lg">
                {torchOn ? t('torch.observe.lampGlowing') : t('torch.observe.lampNotGlowing')}
              </p>
            </Animated>
          </div>
        </Animated>

        {/* Definition */}
        <div>
          <Animated index={2} className="bg-blue-50 p-8 md:p-10 rounded-2xl mb-6">
            <Animated index={0}>
              <h3 className="font-bold text-blue-800 mb-3">{t('torch.observe.whatNotice')}</h3>
            </Animated>
            <Animated index={1} className="bg-white p-6 md:p-8 rounded-xl shadow-sm flex items-start gap-4 max-w-3xl">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <p className="text-base text-gray-700 leading-relaxed">{t('torch.observe.definition')}</p>
            </Animated>
          </Animated>
        </div>
      </div>

      <Animated index={3} className="flex justify-end mt-8">
        <button
          onClick={() => setStep('parts')}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          {t('torch.observe.nextParts')}
          <ChevronRight className="inline w-5 h-5 ml-2" />
        </button>
      </Animated>
    </div>
  );

  const renderParts = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <Animated index={0}>
        <h2 className="text-3xl font-bold text-orange-600 mb-6">{t('torch.parts.title')}</h2>
      </Animated>

      <Animated index={1} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8 rounded-xl mb-8 overflow-x-auto">
        <svg width="100%" height="400" viewBox="0 0 600 400" className="min-w-[560px]">
          {/* Lamp */}
          <g transform="translate(100, 50)">
            <ellipse cx="40" cy="30" rx="35" ry="30" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="40" cy="30" r="15" fill="#FCD34D" className="animate-pulse" />
            <text x="40" y="80" textAnchor="middle" className="text-sm font-semibold">
              {t('torch.parts.lamp')}
            </text>
          </g>

          {/* Switch */}
          <g transform="translate(250, 50)">
            <rect x="10" y="15" width="60" height="30" rx="5" fill="#E5E7EB" stroke="#6B7280" strokeWidth="2" />
            <rect x="20" y="20" width="20" height="20" rx="3" fill="#10B981" />
            <text x="40" y="80" textAnchor="middle" className="text-sm font-semibold">
              {t('torch.parts.switch')}
            </text>
          </g>

          {/* Cells */}
          <g transform="translate(400, 40)">
            <rect x="5" y="0" width="30" height="50" rx="5" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <rect x="15" y="-5" width="10" height="8" fill="#374151" />
            <rect x="45" y="0" width="30" height="50" rx="5" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <rect x="55" y="-5" width="10" height="8" fill="#374151" />
            <text x="40" y="80" textAnchor="middle" className="text-sm font-semibold">
              {t('torch.parts.cells')}
            </text>
          </g>

          {/* Wires */}
          <line
            x1="140"
            y1="80"
            x2="260"
            y2="80"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="5,5"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>

          <line
            x1="310"
            y1="80"
            x2="410"
            y2="70"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="5,5"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>

          <g transform="translate(270, 200)">
            <line x1="0" y1="0" x2="80" y2="0" stroke="#3B82F6" strokeWidth="4" />
            <text x="40" y="25" textAnchor="middle" className="text-sm font-semibold">
              {t('torch.parts.wires')}
            </text>
          </g>
        </svg>
      </Animated>

      {/* Component Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Lightbulb, title: t('torch.parts.lampCard'), desc: t('torch.parts.lampDesc'), color: 'yellow' },
          { icon: Power, title: t('torch.parts.switchCard'), desc: t('torch.parts.switchDesc'), color: 'green' },
          { icon: Battery, title: t('torch.parts.cellCard'), desc: t('torch.parts.cellDesc'), color: 'red' },
          { icon: Zap, title: t('torch.parts.wiresCard'), desc: t('torch.parts.wiresDesc'), color: 'blue' },
        ].map((item, i) => (
          <Animated
            key={item.title}
            index={i + 2}
            className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 p-4 rounded-xl border-2 border-${item.color}-300 transition`}
          >
            <div className="text-center">
              <item.icon className={`w-12 h-12 mx-auto text-${item.color}-600 mb-2`} />
              <h4 className="font-bold text-gray-800">{item.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
            </div>
          </Animated>
        ))}
      </div>

      <Animated index={6} className="flex justify-start">
        <button
          onClick={() => setStep('observe')}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          <ChevronLeft className="inline w-5 h-5 mr-2" />
          {t('torch.parts.back')}
        </button>
      </Animated>
    </div>
  );

  const steps: Record<Step, JSX.Element> = {
    observe: renderObserve(),
    parts: renderParts(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">{steps[step]}</div>
    </div>
  );
};

export default TorchlightLearning;

