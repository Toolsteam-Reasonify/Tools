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
    equation: 'x + 25 = 100',
    solution: '75',
    context: 'You have ₹100 for shopping. You buy a book for ₹25. How much money do you have left for other items?',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🛒',
    color: 'bg-blue-500',
    translations: {
      hi: { 
        title: 'खरीदारी बजट', 
        description: 'खरीदारी के बाद बचे बजट की गणना', 
        context: 'आपके पास खरीदारी के लिए ₹100 हैं। आप ₹25 में किताब खरीदते हैं। अन्य सामान के लिए आपके पास कितने पैसे बचे हैं?' 
      },
      gu: { 
        title: 'ખરીદી બજેટ', 
        description: 'ખરીદી પછી બાકી બજેટની ગણતરી', 
        context: 'તમારી પાસે ખરીદી માટે ₹100 છે। તમે ₹25 માં પુસ્તક ખરીદો છો। અન્ય સામાન માટે તમારી પાસે કેટલા પૈસા બાકી છે?' 
      }
    }
  },
  {
    id: 'cooking_recipe',
    title: 'Recipe Scaling',
    description: 'Scale recipe ingredients proportionally',
    equation: 'x + 2 = 8',
    solution: '6',
    context: 'A recipe serves 2 people. You need to serve 8 people. How many more servings do you need to add?',
    difficulty: 'intermediate',
    category: 'cooking',
    icon: '👨‍🍳',
    color: 'bg-orange-500',
    translations: {
      hi: { 
        title: 'रेसिपी स्केलिंग', 
        description: 'रेसिपी के घटकों को अनुपात में स्केल करें', 
        context: 'एक रेसिपी 2 लोगों को परोसती है। आपको 8 लोगों को परोसना है। आपको कितने और सर्विंग्स जोड़ने होंगे?' 
      },
      gu: { 
        title: 'રેસિપી સ્કેલિંગ', 
        description: 'રેસિપીના ઘટકોને પ્રમાણમાં સ્કેલ કરો', 
        context: 'એક રેસિપી 2 લોકોને સેવા આપે છે। તમારે 8 લોકોને સેવા આપવાની છે। તમારે કેટલા વધુ સર્વિંગ્સ ઉમેરવા પડશે?' 
      }
    }
  },
  {
    id: 'construction_materials',
    title: 'Material Calculation',
    description: 'Calculate materials needed for construction',
    equation: 'x + 5 = 20',
    solution: '15',
    context: 'You need 20 bricks total. You already have 5 bricks. How many more bricks do you need to add?',
    difficulty: 'advanced',
    category: 'construction',
    icon: '🏗️',
    color: 'bg-gray-500',
    translations: {
      hi: { 
        title: 'सामग्री गणना', 
        description: 'निर्माण के लिए आवश्यक सामग्री की गणना', 
        context: 'आपको कुल 20 ईंटों की आवश्यकता है। आपके पास पहले से 5 ईंटें हैं। आपको कितनी और ईंटें जोड़नी होंगी?' 
      },
      gu: { 
        title: 'સામગ્રી ગણતરી', 
        description: 'બાંધકામ માટે જરૂરી સામગ્રીની ગણતરી', 
        context: 'તમારે કુલ 20 ઈંટોની જરૂર છે। તમારી પાસે પહેલેથી 5 ઈંટો છે। તમારે કેટલી વધુ ઈંટો ઉમેરવી પડશે?' 
      }
    }
  },
  {
    id: 'sports_scoring',
    title: 'Game Scoring',
    description: 'Calculate points needed to win',
    equation: 'x + 15 = 30',
    solution: '15',
    context: 'Your team has 15 points. You need 30 points total to win. How many more points do you need to add?',
    difficulty: 'beginner',
    category: 'sports',
    icon: '⚽',
    color: 'bg-green-500',
    translations: {
      hi: { 
        title: 'गेम स्कोरिंग', 
        description: 'जीतने के लिए आवश्यक अंकों की गणना', 
        context: 'आपकी टीम के पास 15 अंक हैं। जीतने के लिए आपको कुल 30 अंक चाहिए। आपको कितने और अंक जोड़ने होंगे?' 
      },
      gu: { 
        title: 'ગેમ સ્કોરિંગ', 
        description: 'જીતવા માટે જરૂરી પોઈન્ટની ગણતરી', 
        context: 'તમારી ટીમ પાસે 15 પોઈન્ટ છે। જીતવા માટે તમારે કુલ 30 પોઈન્ટ જોઈએ છે। તમારે કેટલા વધુ પોઈન્ટ ઉમેરવા પડશે?' 
      }
    }
  },
  {
    id: 'finance_interest',
    title: 'Interest Calculation',
    description: 'Calculate simple interest on investments',
    equation: 'x + 500 = 2000',
    solution: '1500',
    context: 'You want to invest money to earn ₹500 interest. Your total investment goal is ₹2000. How much more money do you need to add?',
    difficulty: 'intermediate',
    category: 'finance',
    icon: '💰',
    color: 'bg-yellow-500',
    translations: {
      hi: { 
        title: 'ब्याज गणना', 
        description: 'निवेश पर साधारण ब्याज की गणना', 
        context: 'आप ₹500 ब्याज कमाने के लिए पैसा निवेश करना चाहते हैं। आपका कुल निवेश लक्ष्य ₹2000 है। आपको कितना और पैसा जोड़ना होगा?' 
      },
      gu: { 
        title: 'વ્યાજ ગણતરી', 
        description: 'નિવેશ પર સરળ વ્યાજની ગણતરી', 
        context: 'તમે ₹500 વ્યાજ કમાવા માટે પૈસા રોકવા માંગો છો। તમારું કુલ નિવેશ લક્ષ્ય ₹2000 છે। તમારે કેટલા વધુ પૈસા ઉમેરવા પડશે?' 
      }
    }
  },
  {
    id: 'science_measurement',
    title: 'Scientific Measurement',
    description: 'Convert units in scientific calculations',
    equation: 'x + 500 = 1000',
    solution: '500',
    context: 'You have 1000 milliliters of liquid total. You already have 500 milliliters. How many more milliliters do you need to add?',
    difficulty: 'advanced',
    category: 'science',
    icon: '🧪',
    color: 'bg-purple-500',
    translations: {
      hi: { 
        title: 'वैज्ञानिक माप', 
        description: 'वैज्ञानिक गणनाओं में इकाइयों का रूपांतरण', 
        context: 'आपके पास कुल 1000 मिलीलीटर तरल है। आपके पास पहले से 500 मिलीलीटर है। आपको कितने और मिलीलीटर जोड़ने होंगे?' 
      },
      gu: { 
        title: 'વૈજ્ઞાનિક માપ', 
        description: 'વૈજ્ઞાનિક ગણતરીઓમાં એકમોનું રૂપાંતર', 
        context: 'તમારી પાસે કુલ 1000 મિલીલીટર પ્રવાહી છે। તમારી પાસે પહેલેથી 500 મિલીલીટર છે। તમારે કેટલા વધુ મિલીલીટર ઉમેરવા પડશે?' 
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
