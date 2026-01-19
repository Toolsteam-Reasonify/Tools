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
    description: 'Calculate remaining budget after purchases',
    equation: 'x - 25 = 75',
    solution: '100',
    context: 'You have some money for shopping. After buying a book for ₹25, you have ₹75 left. How much money did you start with?',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🛒',
    color: 'bg-blue-500',
    translations: {
      hi: { 
        title: 'खरीदारी बजट', 
        description: 'खरीदारी के बाद बचे बजट की गणना', 
        context: 'आपके पास खरीदारी के लिए कुछ पैसे हैं। ₹25 में किताब खरीदने के बाद, आपके पास ₹75 बचे हैं। आपने कितने पैसे से शुरुआत की थी?' 
      },
      gu: { 
        title: 'ખરીદી બજેટ', 
        description: 'ખરીદી પછી બાકી બજેટની ગણતરી', 
        context: 'તમારી પાસે ખરીદી માટે કેટલાક પૈસા છે। ₹25 માં પુસ્તક ખરીદ્યા પછી, તમારી પાસે ₹75 બાકી છે। તમે કેટલા પૈસાથી શરૂઆત કરી હતી?' 
      }
    }
  },
  {
    id: 'cooking_recipe',
    title: 'Recipe Scaling',
    description: 'Scale recipe ingredients proportionally',
    equation: 'x - 2 = 6',
    solution: '8',
    context: 'A recipe serves some people. After serving 2 people, you have 6 servings left. How many people does the original recipe serve?',
    difficulty: 'intermediate',
    category: 'cooking',
    icon: '👨‍🍳',
    color: 'bg-orange-500',
    translations: {
      hi: { 
        title: 'रेसिपी स्केलिंग', 
        description: 'रेसिपी के घटकों को अनुपात में स्केल करें', 
        context: 'एक रेसिपी कुछ लोगों को परोसती है। 2 लोगों को परोसने के बाद, आपके पास 6 सर्विंग्स बचे हैं। मूल रेसिपी कितने लोगों को परोसती है?' 
      },
      gu: { 
        title: 'રેસિપી સ્કેલિંગ', 
        description: 'રેસિપીના ઘટકોને પ્રમાણમાં સ્કેલ કરો', 
        context: 'એક રેસિપી કેટલાક લોકોને સેવા આપે છે। 2 લોકોને સેવા આપ્યા પછી, તમારી પાસે 6 સર્વિંગ્સ બાકી છે। મૂળ રેસિપી કેટલા લોકોને સેવા આપે છે?' 
      }
    }
  },
  {
    id: 'construction_materials',
    title: 'Material Calculation',
    description: 'Calculate materials needed for construction',
    equation: 'x - 5 = 15',
    solution: '20',
    context: 'You have some bricks for construction. After using 5 bricks, you have 15 bricks left. How many bricks did you start with?',
    difficulty: 'advanced',
    category: 'construction',
    icon: '🏗️',
    color: 'bg-gray-500',
    translations: {
      hi: { 
        title: 'सामग्री गणना', 
        description: 'निर्माण के लिए आवश्यक सामग्री की गणना', 
        context: 'आपके पास निर्माण के लिए कुछ ईंटें हैं। 5 ईंटें इस्तेमाल करने के बाद, आपके पास 15 ईंटें बची हैं। आपने कितनी ईंटों से शुरुआत की थी?' 
      },
      gu: { 
        title: 'સામગ્રી ગણતરી', 
        description: 'બાંધકામ માટે જરૂરી સામગ્રીની ગણતરી', 
        context: 'તમારી પાસે બાંધકામ માટે કેટલીક ઈંટો છે। 5 ઈંટો વાપર્યા પછી, તમારી પાસે 15 ઈંટો બાકી છે। તમે કેટલી ઈંટો સાથે શરૂઆત કરી હતી?' 
      }
    }
  },
  {
    id: 'sports_scoring',
    title: 'Game Scoring',
    description: 'Calculate points needed to win',
    equation: 'x - 15 = 15',
    solution: '30',
    context: 'Your team has some points. After losing 15 points, you have 15 points left. How many points did you start with?',
    difficulty: 'beginner',
    category: 'sports',
    icon: '⚽',
    color: 'bg-green-500',
    translations: {
      hi: { 
        title: 'गेम स्कोरिंग', 
        description: 'जीतने के लिए आवश्यक अंकों की गणना', 
        context: 'आपकी टीम के पास कुछ अंक हैं। 15 अंक खोने के बाद, आपके पास 15 अंक बचे हैं। आपने कितने अंकों से शुरुआत की थी?' 
      },
      gu: { 
        title: 'ગેમ સ્કોરિંગ', 
        description: 'જીતવા માટે જરૂરી પોઈન્ટની ગણતરી', 
        context: 'તમારી ટીમ પાસે કેટલાક પોઈન્ટ છે। 15 પોઈન્ટ ગુમાવ્યા પછી, તમારી પાસે 15 પોઈન્ટ બાકી છે। તમે કેટલા પોઈન્ટ સાથે શરૂઆત કરી હતી?' 
      }
    }
  },
  {
    id: 'finance_interest',
    title: 'Interest Calculation',
    description: 'Calculate simple interest on investments',
    equation: 'x - 500 = 1500',
    solution: '2000',
    context: 'You have some money invested. After earning ₹500 interest, your total is ₹2000. How much did you originally invest?',
    difficulty: 'intermediate',
    category: 'finance',
    icon: '💰',
    color: 'bg-yellow-500',
    translations: {
      hi: { 
        title: 'ब्याज गणना', 
        description: 'निवेश पर साधारण ब्याज की गणना', 
        context: 'आपके पास कुछ पैसा निवेशित है। ₹500 ब्याज कमाने के बाद, आपका कुल ₹2000 है। आपने मूल रूप से कितना निवेश किया था?' 
      },
      gu: { 
        title: 'વ્યાજ ગણતરી', 
        description: 'નિવેશ પર સરળ વ્યાજની ગણતરી', 
        context: 'તમારી પાસે કેટલાક પૈસા રોકાયેલા છે। ₹500 વ્યાજ કમાયા પછી, તમારું કુલ ₹2000 છે। તમે મૂળ રીતે કેટલા રોક્યા હતા?' 
      }
    }
  },
  {
    id: 'science_measurement',
    title: 'Scientific Measurement',
    description: 'Convert units in scientific calculations',
    equation: 'x - 500 = 500',
    solution: '1000',
    context: 'You have some liquid in a container. After using 500 milliliters, you have 500 milliliters left. How much liquid did you start with?',
    difficulty: 'advanced',
    category: 'science',
    icon: '🧪',
    color: 'bg-purple-500',
    translations: {
      hi: { 
        title: 'वैज्ञानिक माप', 
        description: 'वैज्ञानिक गणनाओं में इकाइयों का रूपांतरण', 
        context: 'आपके पास कंटेनर में कुछ तरल है। 500 मिलीलीटर इस्तेमाल करने के बाद, आपके पास 500 मिलीलीटर बचा है। आपने कितने मिलीलीटर से शुरुआत की थी?' 
      },
      gu: { 
        title: 'વૈજ્ઞાનિક માપ', 
        description: 'વૈજ્ઞાનિક ગણતરીઓમાં એકમોનું રૂપાંતર', 
        context: 'તમારી પાસે કન્ટેનરમાં કેટલાક પ્રવાહી છે। 500 મિલીલીટર વાપર્યા પછી, તમારી પાસે 500 મિલીલીટર બાકી છે। તમે કેટલા મિલીલીટર સાથે શરૂઆત કરી હતી?' 
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
