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
  translations?: {
    [key: string]: {
      title: string;
      description: string;
      context: string;
    };
  };
}

const realWorldApplications: RealWorldApplication[] = [
  {
    id: 'shopping_budget',
    title: 'Shopping Budget',
    description: 'Calculate total cost for multiple items',
    equation: '3x = 75',
    solution: '25',
    context: 'You want to buy 3 identical books. The total cost is ₹75. How much does each book cost?',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🛒',
    color: 'bg-blue-500',
    translations: {
      hi: { 
        title: 'खरीदारी बजट', 
        description: 'कई वस्तुओं के लिए कुल लागत की गणना', 
        context: 'आप 3 समान किताबें खरीदना चाहते हैं। कुल लागत ₹75 है। प्रत्येक किताब की कीमत कितनी है?' 
      },
      gu: { 
        title: 'ખરીદી બજેટ', 
        description: 'ઘણા વસ્તુઓ માટે કુલ ખર્ચની ગણતરી', 
        context: 'તમે 3 સમાન પુસ્તકો ખરીદવા માંગો છો। કુલ ખર્ચ ₹75 છે। દરેક પુસ્તકની કિંમત કેટલી છે?' 
      }
    }
  },
  {
    id: 'cooking_recipe',
    title: 'Recipe Scaling',
    description: 'Scale recipe ingredients proportionally',
    equation: '4x = 8',
    solution: '2',
    context: 'A recipe serves 4 people. You need to serve 8 people. How many times should you multiply the ingredients?',
    difficulty: 'intermediate',
    category: 'cooking',
    icon: '👨‍🍳',
    color: 'bg-orange-500',
    translations: {
      hi: { 
        title: 'रेसिपी स्केलिंग', 
        description: 'रेसिपी के घटकों को अनुपात में स्केल करें', 
        context: 'एक रेसिपी 4 लोगों को परोसती है। आपको 8 लोगों को परोसना है। आपको सामग्री को कितनी बार गुणा करना चाहिए?' 
      },
      gu: { 
        title: 'રેસિપી સ્કેલિંગ', 
        description: 'રેસિપીના ઘટકોને પ્રમાણમાં સ્કેલ કરો', 
        context: 'એક રેસિપી 4 લોકોને સેવા આપે છે। તમારે 8 લોકોને સેવા આપવાની છે। તમારે સામગ્રીને કેટલી વાર ગુણાકાર કરવો જોઈએ?' 
      }
    }
  },
  {
    id: 'construction_materials',
    title: 'Material Calculation',
    description: 'Calculate materials needed for construction',
    equation: '5x = 20',
    solution: '4',
    context: 'You need 20 bricks total. You can carry 5 bricks at a time. How many trips do you need to make?',
    difficulty: 'advanced',
    category: 'construction',
    icon: '🏗️',
    color: 'bg-gray-500',
    translations: {
      hi: { 
        title: 'सामग्री गणना', 
        description: 'निर्माण के लिए आवश्यक सामग्री की गणना', 
        context: 'आपको कुल 20 ईंटों की आवश्यकता है। आप एक बार में 5 ईंटें ले जा सकते हैं। आपको कितनी यात्राएं करनी होंगी?' 
      },
      gu: { 
        title: 'સામગ્રી ગણતરી', 
        description: 'બાંધકામ માટે જરૂરી સામગ્રીની ગણતરી', 
        context: 'તમારે કુલ 20 ઈંટોની જરૂર છે। તમે એક સમયે 5 ઈંટો લઈ જઈ શકો છો। તમારે કેટલી યાત્રાઓ કરવી પડશે?' 
      }
    }
  },
  {
    id: 'sports_scoring',
    title: 'Game Scoring',
    description: 'Calculate points per game',
    equation: '6x = 30',
    solution: '5',
    context: 'Your team scored 30 points in 6 games. How many points did you score per game on average?',
    difficulty: 'beginner',
    category: 'sports',
    icon: '⚽',
    color: 'bg-green-500',
    translations: {
      hi: { 
        title: 'गेम स्कोरिंग', 
        description: 'प्रति गेम अंकों की गणना', 
        context: 'आपकी टीम ने 6 गेम में 30 अंक बनाए। आपने प्रति गेम औसतन कितने अंक बनाए?' 
      },
      gu: { 
        title: 'ગેમ સ્કોરિંગ', 
        description: 'પ્રતિ ગેમ પોઈન્ટની ગણતરી', 
        context: 'તમારી ટીમે 6 ગેમમાં 30 પોઈન્ટ બનાવ્યા। તમે પ્રતિ ગેમ સરેરાશ કેટલા પોઈન્ટ બનાવ્યા?' 
      }
    }
  },
  {
    id: 'finance_interest',
    title: 'Interest Calculation',
    description: 'Calculate simple interest on investments',
    equation: '12x = 1200',
    solution: '100',
    context: 'You invested money for 12 months and earned ₹1200 interest. How much interest did you earn per month?',
    difficulty: 'intermediate',
    category: 'finance',
    icon: '💰',
    color: 'bg-yellow-500',
    translations: {
      hi: { 
        title: 'ब्याज गणना', 
        description: 'निवेश पर साधारण ब्याज की गणना', 
        context: 'आपने 12 महीने के लिए पैसा निवेश किया और ₹1200 ब्याज कमाया। आपने प्रति महीने कितना ब्याज कमाया?' 
      },
      gu: { 
        title: 'વ્યાજ ગણતરી', 
        description: 'નિવેશ પર સરળ વ્યાજની ગણતરી', 
        context: 'તમે 12 મહિના માટે પૈસા રોક્યા અને ₹1200 વ્યાજ કમાયું। તમે પ્રતિ મહિના કેટલું વ્યાજ કમાયું?' 
      }
    }
  },
  {
    id: 'science_measurement',
    title: 'Scientific Measurement',
    description: 'Convert units in scientific calculations',
    equation: '5x = 1000',
    solution: '200',
    context: 'You have 1000 milliliters of liquid total. You need to divide it into 5 equal parts. How many milliliters in each part?',
    difficulty: 'advanced',
    category: 'science',
    icon: '🧪',
    color: 'bg-purple-500',
    translations: {
      hi: { 
        title: 'वैज्ञानिक माप', 
        description: 'वैज्ञानिक गणनाओं में इकाइयों का रूपांतरण', 
        context: 'आपके पास कुल 1000 मिलीलीटर तरल है। आपको इसे 5 बराबर भागों में बांटना है। प्रत्येक भाग में कितने मिलीलीटर होंगे?' 
      },
      gu: { 
        title: 'વૈજ્ઞાનિક માપ', 
        description: 'વૈજ્ઞાનિક ગણતરીઓમાં એકમોનું રૂપાંતર', 
        context: 'તમારી પાસે કુલ 1000 મિલીલીટર પ્રવાહી છે। તમારે તેને 5 સમાન ભાગોમાં વહેંચવું છે। દરેક ભાગમાં કેટલા મિલીલીટર હશે?' 
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

  const filteredApplications = realWorldApplications;


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
          <div className="text-3xl">{app.icon}</div>
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
            <div className="text-5xl">{app.icon}</div>
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
                    x = {app.solution}
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
            <div className="applications-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map(renderApplicationCard)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RealWorldApplications;
