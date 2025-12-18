import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Application {
  id: string;
  icon: string;
  title: string;
  description: string;
  examples: string[];
  color: string;
}

const RealWorldApplications: React.FC = () => {
  const { t } = useLanguage();

  const applications: Application[] = [
    {
      id: 'cooking',
      icon: '🍳',
      title: t('realworld.cooking'),
      description: t('realworld.desc.cooking'),
      examples: [
        t('realworld.example.cooking.stove'),
        t('realworld.example.cooking.microwave'),
        t('realworld.example.cooking.kettle'),
        t('realworld.example.cooking.toaster'),
      ],
      color: 'from-orange-400 to-red-500',
    },
    {
      id: 'lighting',
      icon: '💡',
      title: t('realworld.lighting'),
      description: t('realworld.desc.lighting'),
      examples: [
        t('realworld.example.lighting.bulbs'),
        t('realworld.example.lighting.street'),
        t('realworld.example.lighting.flashlight'),
        t('realworld.example.lighting.lamp'),
      ],
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'transportation',
      icon: '🚗',
      title: t('realworld.transportation'),
      description: t('realworld.desc.transportation'),
      examples: [
        t('realworld.example.transportation.cars'),
        t('realworld.example.transportation.trains'),
        t('realworld.example.transportation.trams'),
        t('realworld.example.transportation.ebikes'),
      ],
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 'heating',
      icon: '❄️',
      title: t('realworld.heating'),
      description: t('realworld.desc.heating'),
      examples: [
        t('realworld.example.heating.ac'),
        t('realworld.example.heating.heater'),
        t('realworld.example.heating.blanket'),
        t('realworld.example.heating.fan'),
      ],
      color: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'entertainment',
      icon: '📺',
      title: t('realworld.entertainment'),
      description: t('realworld.desc.entertainment'),
      examples: [
        t('realworld.example.entertainment.tv'),
        t('realworld.example.entertainment.computer'),
        t('realworld.example.entertainment.console'),
        t('realworld.example.entertainment.speakers'),
      ],
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'communication',
      icon: '📱',
      title: t('realworld.communication'),
      description: t('realworld.desc.communication'),
      examples: [
        t('realworld.example.communication.phones'),
        t('realworld.example.communication.router'),
        t('realworld.example.communication.radio'),
        t('realworld.example.communication.satellite'),
      ],
      color: 'from-teal-400 to-green-500',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {applications.map((app, index) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon Header */}
              <div className={`bg-gradient-to-r ${app.color} p-6 text-center`}>
                <div className="text-6xl mb-2">{app.icon}</div>
                <h2 className="text-2xl font-bold text-white">{app.title}</h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{app.description}</p>
                
                {/* Examples */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('common.examples')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {app.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealWorldApplications;

