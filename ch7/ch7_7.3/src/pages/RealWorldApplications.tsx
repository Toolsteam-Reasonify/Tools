import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface RealWorldApplication {
  id: string;
  title: string;
  description: string;
  equation: string;
  solution: string;
  context: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'shopping' | 'cooking' | 'construction' | 'sports' | 'finance' | 'science';
  icon: string;
  color: string;
  type: 'profit_calculation' | 'loss_calculation' | 'profit_percentage' | 'loss_percentage';
  translations?: {
    [key: string]: {
      title: string;
      description: string;
      context: string;
    };
  };
}

const realWorldApplications: RealWorldApplication[] = [
  // Profit Calculation Examples
  {
    id: 'profit_retail',
    title: 'Retail Business',
    description: 'Calculate profit from buying and selling products',
    equation: 'CP = ₹100, SP = ₹120, Profit = ₹20',
    solution: '₹20 profit',
    context: 'A shopkeeper buys a product for ₹100 and sells it for ₹120, making a profit of ₹20.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🏪',
    color: 'bg-green-500',
    type: 'profit_calculation',
    translations: {
      hi: { 
        title: 'खुदरा व्यापार', 
        description: 'उत्पाद खरीदने और बेचने से लाभ की गणना', 
        context: 'एक दुकानदार ₹100 में उत्पाद खरीदता है और ₹120 में बेचता है, ₹20 का लाभ कमाता है।' 
      },
      gu: { 
        title: 'ખુલ્લા વેપાર', 
        description: 'ઉત્પાદન ખરીદી અને વેચાણથી નફો ગણો', 
        context: 'એક દુકાનદાર ₹100 માં ઉત્પાદન ખરીદે છે અને ₹120 માં વેચે છે, ₹20 નો નફો કમાય છે।' 
      }
    }
  },
  {
    id: 'profit_online',
    title: 'Online Marketplace',
    description: 'Calculate profit from online sales',
    equation: 'CP = ₹250, SP = ₹300, Profit = ₹50',
    solution: '₹50 profit',
    context: 'An online seller purchases items for ₹250 and sells them for ₹300, earning ₹50 profit.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '💻',
    color: 'bg-blue-500',
    type: 'profit_calculation',
    translations: {
      hi: { 
        title: 'ऑनलाइन मार्केटप्लेस', 
        description: 'ऑनलाइन बिक्री से लाभ की गणना', 
        context: 'एक ऑनलाइन विक्रेता ₹250 में सामान खरीदता है और ₹300 में बेचता है, ₹50 का लाभ कमाता है।' 
      },
      gu: { 
        title: 'ઓનલાઇન માર્કેટપ્લેસ', 
        description: 'ઓનલાઇન વેચાણથી નફો ગણો', 
        context: 'એક ઓનલાઇન વિક્રેતા ₹250 માં સામાન ખરીદે છે અને ₹300 માં વેચે છે, ₹50 નો નફો કમાય છે।' 
      }
    }
  },
  {
    id: 'profit_restaurant',
    title: 'Restaurant Business',
    description: 'Calculate profit from food sales',
    equation: 'CP = ₹80, SP = ₹120, Profit = ₹40',
    solution: '₹40 profit',
    context: 'A restaurant prepares a dish costing ₹80 and sells it for ₹120, making ₹40 profit per serving.',
    difficulty: 'beginner',
    category: 'cooking',
    icon: '🍽️',
    color: 'bg-orange-500',
    type: 'profit_calculation',
    translations: {
      hi: { 
        title: 'रेस्टोरेंट व्यापार', 
        description: 'भोजन बिक्री से लाभ की गणना', 
        context: 'एक रेस्टोरेंट ₹80 की लागत से व्यंजन तैयार करता है और ₹120 में बेचता है, प्रति सर्विंग ₹40 का लाभ कमाता है।' 
      },
      gu: { 
        title: 'રેસ્ટોરન્ટ વ્યાપાર', 
        description: 'ખોરાક વેચાણથી નફો ગણો', 
        context: 'એક રેસ્ટોરન્ટ ₹80 ની લાગતથી વ્યંજન તૈયાર કરે છે અને ₹120 માં વેચે છે, પ્રતિ સર્વિંગ ₹40 નો નફો કમાય છે।' 
      }
    }
  },

  // Loss Calculation Examples
  {
    id: 'loss_clearance',
    title: 'Clearance Sales',
    description: 'Calculate loss from clearance sales',
    equation: 'CP = ₹150, SP = ₹120, Loss = ₹30',
    solution: '₹30 loss',
    context: 'A store sells clearance items for ₹120 that originally cost ₹150, incurring ₹30 loss per item.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🏷️',
    color: 'bg-red-500',
    type: 'loss_calculation',
    translations: {
      hi: { 
        title: 'क्लीयरेंस सेल', 
        description: 'क्लीयरेंस सेल से हानि की गणना', 
        context: 'एक स्टोर ₹150 के मूल सामान को ₹120 में बेचता है, प्रति आइटम ₹30 की हानि उठाता है।' 
      },
      gu: { 
        title: 'ક્લિયરન્સ સેલ', 
        description: 'ક્લિયરન્સ સેલથી નુકસાન ગણો', 
        context: 'એક સ્ટોર ₹150 ના મૂળ સામાનને ₹120 માં વેચે છે, પ્રતિ આઇટમ ₹30 નું નુકસાન ઉઠાવે છે।' 
      }
    }
  },
  {
    id: 'loss_perishable',
    title: 'Perishable Goods',
    description: 'Calculate loss from expired products',
    equation: 'CP = ₹200, SP = ₹150, Loss = ₹50',
    solution: '₹50 loss',
    context: 'A grocery store sells near-expiry products for ₹150 that cost ₹200, accepting ₹50 loss to avoid waste.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🥬',
    color: 'bg-yellow-500',
    type: 'loss_calculation',
    translations: {
      hi: { 
        title: 'नाशवान सामान', 
        description: 'एक्सपायर्ड उत्पादों से हानि की गणना', 
        context: 'एक किराना स्टोर ₹200 के उत्पादों को ₹150 में बेचता है, कचरे से बचने के लिए ₹50 की हानि स्वीकार करता है।' 
      },
      gu: { 
        title: 'નાશવંત સામાન', 
        description: 'એક્સપાયર ઉત્પાદનોમાંથી નુકસાન ગણો', 
        context: 'એક કિરાણા સ્ટોર ₹200 ના ઉત્પાદનોને ₹150 માં વેચે છે, કચરાથી બચવા માટે ₹50 નું નુકસાન સ્વીકારે છે।' 
      }
    }
  },
  {
    id: 'loss_construction',
    title: 'Construction Materials',
    description: 'Calculate loss from damaged materials',
    equation: 'CP = ₹500, SP = ₹400, Loss = ₹100',
    solution: '₹100 loss',
    context: 'A construction company sells damaged materials for ₹400 that originally cost ₹500, accepting ₹100 loss.',
    difficulty: 'beginner',
    category: 'construction',
    icon: '🏗️',
    color: 'bg-gray-500',
    type: 'loss_calculation',
    translations: {
      hi: { 
        title: 'निर्माण सामग्री', 
        description: 'क्षतिग्रस्त सामग्री से हानि की गणना', 
        context: 'एक निर्माण कंपनी ₹500 की मूल सामग्री को ₹400 में बेचती है, ₹100 की हानि स्वीकार करती है।' 
      },
      gu: { 
        title: 'બાંધકામ સામગ્રી', 
        description: 'નુકસાનગ્રસ્ત સામગ્રીથી નુકસાન ગણો', 
        context: 'એક બાંધકામ કંપની ₹500 ની મૂળ સામગ્રીને ₹400 માં વેચે છે, ₹100 નું નુકસાન સ્વીકારે છે।' 
      }
    }
  },

  // Profit Percentage Examples
  {
    id: 'profit_percent_electronics',
    title: 'Electronics Store',
    description: 'Calculate profit percentage for electronics',
    equation: 'CP = ₹200, Profit = ₹40, Profit % = 20%',
    solution: '20% profit',
    context: 'An electronics store makes ₹40 profit on ₹200 cost, achieving 20% profit margin.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '📱',
    color: 'bg-purple-500',
    type: 'profit_percentage',
    translations: {
      hi: { 
        title: 'इलेक्ट्रॉनिक्स स्टोर', 
        description: 'इलेक्ट्रॉनिक्स के लिए लाभ प्रतिशत की गणना', 
        context: 'एक इलेक्ट्रॉनिक्स स्टोर ₹200 की लागत पर ₹40 का लाभ कमाता है, 20% लाभ मार्जिन प्राप्त करता है।' 
      },
      gu: { 
        title: 'ઇલેક્ટ્રોનિક્સ સ્ટોર', 
        description: 'ઇલેક્ટ્રોનિક્સ માટે નફો ટકાવારી ગણો', 
        context: 'એક ઇલેક્ટ્રોનિક્સ સ્ટોર ₹200 ની લાગત પર ₹40 નો નફો કમાય છે, 20% નફો માર્જિન પ્રાપ્ત કરે છે।' 
      }
    }
  },
  {
    id: 'profit_percent_clothing',
    title: 'Fashion Retail',
    description: 'Calculate profit percentage for clothing',
    equation: 'CP = ₹500, Profit = ₹75, Profit % = 15%',
    solution: '15% profit',
    context: 'A fashion retailer makes ₹75 profit on ₹500 cost, achieving 15% profit margin on clothing items.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '👕',
    color: 'bg-pink-500',
    type: 'profit_percentage',
    translations: {
      hi: { 
        title: 'फैशन रिटेल', 
        description: 'कपड़ों के लिए लाभ प्रतिशत की गणना', 
        context: 'एक फैशन रिटेलर ₹500 की लागत पर ₹75 का लाभ कमाता है, कपड़ों पर 15% लाभ मार्जिन प्राप्त करता है।' 
      },
      gu: { 
        title: 'ફેશન રિટેલ', 
        description: 'કપડાં માટે નફો ટકાવારી ગણો', 
        context: 'એક ફેશન રિટેલર ₹500 ની લાગત પર ₹75 નો નફો કમાય છે, કપડાં પર 15% નફો માર્જિન પ્રાપ્ત કરે છે।' 
      }
    }
  },
  {
    id: 'profit_percent_automotive',
    title: 'Automotive Parts',
    description: 'Calculate profit percentage for car parts',
    equation: 'CP = ₹1000, Profit = ₹150, Profit % = 15%',
    solution: '15% profit',
    context: 'An automotive parts dealer makes ₹150 profit on ₹1000 cost, maintaining 15% profit margin.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🚗',
    color: 'bg-indigo-500',
    type: 'profit_percentage',
    translations: {
      hi: { 
        title: 'ऑटोमोटिव पार्ट्स', 
        description: 'कार पार्ट्स के लिए लाभ प्रतिशत की गणना', 
        context: 'एक ऑटोमोटिव पार्ट्स डीलर ₹1000 की लागत पर ₹150 का लाभ कमाता है, 15% लाभ मार्जिन बनाए रखता है।' 
      },
      gu: { 
        title: 'ઓટોમોટિવ પાર્ટ્સ', 
        description: 'કાર પાર્ટ્સ માટે નફો ટકાવારી ગણો', 
        context: 'એક ઓટોમોટિવ પાર્ટ્સ ડીલર ₹1000 ની લાગત પર ₹150 નો નફો કમાય છે, 15% નફો માર્જિન જાળવે છે।' 
      }
    }
  },

  // Loss Percentage Examples
  {
    id: 'loss_percent_food',
    title: 'Food Industry',
    description: 'Calculate loss percentage for food waste',
    equation: 'CP = ₹300, Loss = ₹45, Loss % = 15%',
    solution: '15% loss',
    context: 'A food business incurs ₹45 loss on ₹300 cost due to waste, resulting in 15% loss percentage.',
    difficulty: 'beginner',
    category: 'cooking',
    icon: '🍎',
    color: 'bg-red-600',
    type: 'loss_percentage',
    translations: {
      hi: { 
        title: 'खाद्य उद्योग', 
        description: 'खाद्य अपशिष्ट के लिए हानि प्रतिशत की गणना', 
        context: 'एक खाद्य व्यवसाय अपशिष्ट के कारण ₹300 की लागत पर ₹45 की हानि उठाता है, जिससे 15% हानि प्रतिशत होता है।' 
      },
      gu: { 
        title: 'ખોરાક ઉદ્યોગ', 
        description: 'ખોરાક કચરા માટે નુકસાન ટકાવારી ગણો', 
        context: 'એક ખોરાક વ્યવસાય કચરાના કારણે ₹300 ની લાગત પર ₹45 નું નુકસાન ઉઠાવે છે, જેના પરિણામે 15% નુકસાન ટકાવારી થાય છે।' 
      }
    }
  },
  {
    id: 'loss_percent_manufacturing',
    title: 'Manufacturing Defects',
    description: 'Calculate loss percentage from manufacturing defects',
    equation: 'CP = ₹600, Loss = ₹90, Loss % = 15%',
    solution: '15% loss',
    context: 'A manufacturer incurs ₹90 loss on ₹600 cost due to defects, resulting in 15% loss percentage.',
    difficulty: 'beginner',
    category: 'science',
    icon: '🏭',
    color: 'bg-orange-600',
    type: 'loss_percentage',
    translations: {
      hi: { 
        title: 'निर्माण दोष', 
        description: 'निर्माण दोषों से हानि प्रतिशत की गणना', 
        context: 'एक निर्माता दोषों के कारण ₹600 की लागत पर ₹90 की हानि उठाता है, जिससे 15% हानि प्रतिशत होता है।' 
      },
      gu: { 
        title: 'ઉત્પાદન ખામીઓ', 
        description: 'ઉત્પાદન ખામીઓથી નુકસાન ટકાવારી ગણો', 
        context: 'એક ઉત્પાદક ખામીઓના કારણે ₹600 ની લાગત પર ₹90 નું નુકસાન ઉઠાવે છે, જેના પરિણામે 15% નુકસાન ટકાવારી થાય છે।' 
      }
    }
  },
  {
    id: 'loss_percent_transport',
    title: 'Transportation',
    description: 'Calculate loss percentage from fuel costs',
    equation: 'CP = ₹400, Loss = ₹60, Loss % = 15%',
    solution: '15% loss',
    context: 'A transport company incurs ₹60 loss on ₹400 cost due to fuel price increases, resulting in 15% loss percentage.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🚛',
    color: 'bg-gray-600',
    type: 'loss_percentage',
    translations: {
      hi: { 
        title: 'परिवहन', 
        description: 'ईंधन लागत से हानि प्रतिशत की गणना', 
        context: 'एक परिवहन कंपनी ईंधन कीमतों में वृद्धि के कारण ₹400 की लागत पर ₹60 की हानि उठाती है, जिससे 15% हानि प्रतिशत होता है।' 
      },
      gu: { 
        title: 'પરિવહન', 
        description: 'બળતણ ખર્ચથી નુકસાન ટકાવારી ગણો', 
        context: 'એક પરિવહન કંપની બળતણ કિંમતોમાં વધારાના કારણે ₹400 ની લાગત પર ₹60 નું નુકસાન ઉઠાવે છે, જેના પરિણામે 15% નુકસાન ટકાવારી થાય છે।' 
      }
    }
  }
];

const RealWorldApplications: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedApp, setSelectedApp] = useState<RealWorldApplication | null>(null);

  const getTranslatedText = (item: any, field: string, lang: string) => {
    if (item.translations && item.translations[lang] && item.translations[lang][field]) {
      return item.translations[lang][field];
    }
    return item[field];
  };

  // Group applications by type
  const groupedApplications = realWorldApplications.reduce((acc, app) => {
    if (!acc[app.type]) {
      acc[app.type] = [];
    }
    acc[app.type].push(app);
    return acc;
  }, {} as Record<string, RealWorldApplication[]>);

  // Type titles
  const typeTitles = {
    profit_calculation: {
      en: 'Profit Calculation',
      hi: 'लाभ गणना',
      gu: 'નફો ગણતરી'
    },
    loss_calculation: {
      en: 'Loss Calculation',
      hi: 'हानि गणना',
      gu: 'નુકસાન ગણતરી'
    },
    profit_percentage: {
      en: 'Profit Percentage',
      hi: 'लाभ प्रतिशत',
      gu: 'નફો ટકાવારી'
    },
    loss_percentage: {
      en: 'Loss Percentage',
      hi: 'हानि प्रतिशत',
      gu: 'નુકસાન ટકાવારી'
    }
  };

  const renderApplicationCard = (app: RealWorldApplication) => {
    const appData = {
      ...app,
      title: getTranslatedText(app, 'title', language),
      description: getTranslatedText(app, 'description', language),
      context: getTranslatedText(app, 'context', language)
    };

    return (
      <div 
        key={app.id}
        onClick={() => setSelectedApp(app)}
        className="application-card bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-teal-300 transition-all cursor-pointer hover:scale-105"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-7xl">{app.icon}</div>
          <div className="text-xl font-bold text-gray-800">{appData.title}</div>
        </div>
        
        <div className="text-gray-600 mb-4">{appData.description}</div>
        
        <div className="equation-display mb-4">
          <div className="text-2xl font-bold text-gray-800 text-center">
            {app.equation}
          </div>
        </div>

        <div className="text-sm text-gray-500 text-center">
          {appData.context.substring(0, 100)}...
        </div>
      </div>
    );
  };

  const renderApplicationDetail = (app: RealWorldApplication) => {
    const appData = {
      ...app,
      title: getTranslatedText(app, 'title', language),
      description: getTranslatedText(app, 'description', language),
      context: getTranslatedText(app, 'context', language)
    };

    return (
      <div className="application-detail bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="text-9xl">{app.icon}</div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{appData.title}</div>
              <div className="text-gray-600">{appData.description}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedApp(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Problem */}
          <div className="problem-section">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('context')}:</h3>
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="text-lg text-blue-800">{appData.context}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('equation')}:</h3>
              <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl text-center">
                <div className="text-4xl font-bold text-gray-800">{app.equation}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Solution */}
          <div className="solution-section">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('solution')}:</h3>
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <div className="text-2xl font-bold text-green-800">
                    {app.solution}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="real-world-applications min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-4" style={{fontFamily: 'Poppins, sans-serif'}}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="header flex justify-center items-center mb-8">
          <div className="text-4xl font-bold text-gray-800">🌍 {t('realWorldApps')}</div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {selectedApp ? (
            renderApplicationDetail(selectedApp)
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedApplications).map(([type, apps]) => (
                <div key={type} className="type-section">
                  {/* Type Title */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {typeTitles[type as keyof typeof typeTitles][language]}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
                  </div>
                  
                  {/* Applications Grid for this type */}
                  <div className="applications-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map(renderApplicationCard)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RealWorldApplications;