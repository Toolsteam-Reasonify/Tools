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
  type: 'interpret' | 'percent_of_total' | 'ratio_to_percent' | 'percent_change';
  translations?: {
    [key: string]: {
      title: string;
      description: string;
      context: string;
    };
  };
}

const realWorldApplications: RealWorldApplication[] = [
  // Interpret Percentage Statement Examples
  {
    id: 'interpret_shopping_discount',
    title: 'Shopping & Discounts',
    description: 'Understand how much money you save during sales',
            equation: '5% * ₹100 = ₹5',
    solution: '₹5 saved (pay ₹95)',
    context: 'If an item costs ₹100 and there\'s a 5% discount, you save ₹5 and pay ₹95.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🛍️',
    color: 'bg-blue-500',
    type: 'interpret',
    translations: {
      hi: { 
        title: 'खरीदारी और छूट', 
        description: 'बिक्री के दौरान आप कितना पैसा बचाते हैं', 
        context: 'यदि कोई वस्तु ₹100 की है और 5% छूट है, तो आप ₹5 बचाते हैं और ₹95 देते हैं।' 
      },
      gu: { 
        title: 'ખરીદી અને છૂટ', 
        description: 'વેચાણ દરમિયાન તમે કેટલા પૈસા બચાવો છો', 
        context: 'જો કોઈ વસ્તુ ₹100 ની છે અને 5% છૂટ છે, તો તમે ₹5 બચાવો છો અને ₹95 આપો છો।' 
      }
    }
  },
  {
    id: 'interpret_bank_interest',
    title: 'Bank Interest & Savings',
    description: 'Interpret percentage rates to know how much interest you\'ll earn',
            equation: '6% * ₹10,000 = ₹600',
    solution: '₹600',
    context: 'You earn ₹600 interest on ₹10,000 in one year at 6% interest.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🏦',
    color: 'bg-green-500',
    type: 'interpret',
    translations: {
      hi: { 
        title: 'बैंक ब्याज और बचत', 
        description: 'प्रतिशत दरों की व्याख्या करके जानें कि आप कितना ब्याज कमाएंगे', 
        context: '6% ब्याज पर ₹10,000 पर एक साल में ₹600 ब्याज मिलता है।' 
      },
      gu: { 
        title: 'બેંક વ્યાજ અને બચત', 
        description: 'ટકાવારી દરોની વ્યાખ્યા કરીને જાણો કે તમે કેટલું વ્યાજ કમાશો', 
        context: '6% વ્યાજ પર ₹10,000 પર એક વર્ષમાં ₹600 વ્યાજ મળે છે।' 
      }
    }
  },
  {
    id: 'interpret_tax_calculation',
    title: 'Tax & GST Calculation',
    description: 'Calculate tax amounts using percentage rates',
            equation: '18% * ₹1,000 = ₹180',
    solution: '₹180 GST',
    context: 'An 18% GST on ₹1,000 adds ₹180 tax, making the total ₹1,180.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🧾',
    color: 'bg-yellow-500',
    type: 'interpret',
    translations: {
      hi: { 
        title: 'कर और जीएसटी गणना', 
        description: 'प्रतिशत दरों का उपयोग करके कर राशि की गणना करें', 
        context: '₹1,000 पर 18% जीएसटी ₹180 कर जोड़ता है, जिससे कुल ₹1,180 हो जाता है।' 
      },
      gu: { 
        title: 'કર અને જીએસટી ગણતરી', 
        description: 'ટકાવારી દરોનો ઉપયોગ કરીને કર રકમની ગણતરી કરો', 
        context: '₹1,000 પર 18% જીએસટી ₹180 કર ઉમેરે છે, જે કુલ ₹1,180 બનાવે છે।' 
      }
    }
  },

  // Percentage of a Total Examples
  {
    id: 'percent_total_classroom',
    title: 'Classroom Composition',
    description: 'Calculate how many students fall into different categories',
            equation: '25% * 40 children = 10 children',
    solution: '10 children',
    context: 'In a class of 40 children, 25% like football. That means 10 children like football.',
    difficulty: 'beginner',
    category: 'science',
    icon: '🎓',
    color: 'bg-purple-500',
    type: 'percent_of_total',
    translations: {
      hi: { 
        title: 'कक्षा संरचना', 
        description: 'गणना करें कि कितने छात्र अलग-अलग श्रेणियों में आते हैं', 
        context: '40 बच्चों की कक्षा में, 25% को फुटबॉल पसंद है। इसका मतलब है कि 10 बच्चों को फुटबॉल पसंद है।' 
      },
      gu: { 
        title: 'વર્ગ રચના', 
        description: 'ગણતરી કરો કે કેટલા વિદ્યાર્થીઓ વિવિધ શ્રેણીઓમાં આવે છે', 
        context: '40 બાળકોના વર્ગમાં, 25% ને ફૂટબોલ ગમે છે. એનો અર્થ છે કે 10 બાળકોને ફૂટબોલ ગમે છે।' 
      }
    }
  },
  {
    id: 'percent_total_manufacturing',
    title: 'Manufacturing & Quality Control',
    description: 'Find out defect rates or production efficiency',
            equation: '2% * 500 = 10 items',
    solution: '10 items defective',
    context: 'If 2% of products are defective, 10 out of 500 items have faults.',
    difficulty: 'beginner',
    category: 'science',
    icon: '🏭',
    color: 'bg-orange-500',
    type: 'percent_of_total',
    translations: {
      hi: { 
        title: 'निर्माण और गुणवत्ता नियंत्रण', 
        description: 'दोष दर या उत्पादन दक्षता का पता लगाएं', 
        context: 'यदि 2% उत्पाद दोषपूर्ण हैं, तो 500 वस्तुओं में से 10 में खामियां हैं।' 
      },
      gu: { 
        title: 'ઉત્પાદન અને ગુણવત્તા નિયંત્રણ', 
        description: 'દોષ દર અથવા ઉત્પાદન કાર્યક્ષમતા શોધો', 
        context: 'જો 2% ઉત્પાદનો ખામીવાળા છે, તો 500 વસ્તુઓમાંથી 10 માં ખામીઓ છે।' 
      }
    }
  },
  {
    id: 'percent_total_inventory',
    title: 'Inventory Management',
    description: 'Calculate stock distribution percentages',
            equation: '20% * 150 dresses = 30 dresses',
    solution: '30 blue dresses',
    context: 'In a store with 150 dresses, 20% are blue. That means 30 dresses are blue.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '👗',
    color: 'bg-pink-500',
    type: 'percent_of_total',
    translations: {
      hi: { 
        title: 'इन्वेंटरी प्रबंधन', 
        description: 'स्टॉक वितरण प्रतिशत की गणना करें', 
        context: '150 पोशाकों वाली दुकान में, 20% नीली हैं। इसका मतलब है कि 30 पोशाकें नीली हैं।' 
      },
      gu: { 
        title: 'ઈન્વેન્ટરી મેનેજમેન્ટ', 
        description: 'સ્ટોક વિતરણ ટકાવારી ગણતરી કરો', 
        context: '150 ડ્રેસવાળી દુકાનમાં, 20% વાદળી છે. એનો અર્થ છે કે 30 ડ્રેસ વાદળી છે।' 
      }
    }
  },

  // Ratio to Percentage Examples
  {
    id: 'ratio_percent_recipe',
    title: 'Cooking Recipes',
    description: 'Convert recipe ratios to percentages for scaling',
    equation: '2:1 ratio = 2/3 × 100% = 66⅔%',
    solution: '66⅔%',
    context: 'A recipe has rice and urad dal in ratio 2:1. Rice makes up 66⅔% of the mixture.',
    difficulty: 'beginner',
    category: 'cooking',
    icon: '👨‍🍳',
    color: 'bg-yellow-500',
    type: 'ratio_to_percent',
    translations: {
      hi: { 
        title: 'खाना पकाने की रेसिपी', 
        description: 'स्केलिंग के लिए रेसिपी अनुपात को प्रतिशत में बदलें', 
        context: 'एक रेसिपी में चावल और उड़द दाल का अनुपात 2:1 है। चावल मिश्रण का 66⅔% बनाता है।' 
      },
      gu: { 
        title: 'રસોઈ રેસિપી', 
        description: 'સ્કેલિંગ માટે રેસિપી અનુપાતને ટકાવારીમાં બદલો', 
        context: 'એક રેસિપીમાં ચોખા અને ઉડદ દાળનો અનુપાત 2:1 છે. ચોખા મિશ્રણનો 66⅔% બનાવે છે।' 
      }
    }
  },
  {
    id: 'ratio_percent_mixture',
    title: 'Chemical Mixtures',
    description: 'Convert mixture ratios to percentages for analysis',
    equation: '3:2 ratio = 3/5 × 100% = 60%',
    solution: '60%',
    context: 'A mixture has sugar and salt in ratio 3:2. Sugar makes up 60% of the mixture.',
    difficulty: 'beginner',
    category: 'science',
    icon: '🧪',
    color: 'bg-cyan-500',
    type: 'ratio_to_percent',
    translations: {
      hi: { 
        title: 'रासायनिक मिश्रण', 
        description: 'विश्लेषण के लिए मिश्रण अनुपात को प्रतिशत में बदलें', 
        context: 'एक मिश्रण में चीनी और नमक का अनुपात 3:2 है। चीनी मिश्रण का 60% बनाती है।' 
      },
      gu: { 
        title: 'રાસાયણિક મિશ્રણ', 
        description: 'વિશ્લેષણ માટે મિશ્રણ અનુપાતને ટકાવારીમાં બદલો', 
        context: 'એક મિશ્રણમાં ખાંડ અને મીઠુંનો અનુપાત 3:2 છે. ખાંડ મિશ્રણનો 60% બનાવે છે।' 
      }
    }
  },
  {
    id: 'ratio_percent_construction',
    title: 'Construction Materials',
    description: 'Convert material ratios to percentages for planning',
    equation: '4:1 ratio = 4/5 × 100% = 80%',
    solution: '80%',
    context: 'Concrete mix has water and cement in ratio 4:1. Water makes up 80% of the mixture.',
    difficulty: 'beginner',
    category: 'construction',
    icon: '🏗️',
    color: 'bg-gray-500',
    type: 'ratio_to_percent',
    translations: {
      hi: { 
        title: 'निर्माण सामग्री', 
        description: 'योजना के लिए सामग्री अनुपात को प्रतिशत में बदलें', 
        context: 'कंक्रीट मिश्रण में पानी और सीमेंट का अनुपात 4:1 है। पानी मिश्रण का 80% बनाता है।' 
      },
      gu: { 
        title: 'બાંધકામ સામગ્રી', 
        description: 'આયોજન માટે સામગ્રી અનુપાતને ટકાવારીમાં બદલો', 
        context: 'કોંક્રિટ મિશ્રણમાં પાણી અને સિમેન્ટનો અનુપાત 4:1 છે. પાણી મિશ્રણનો 80% બનાવે છે।' 
      }
    }
  },

  // Percentage Change Examples
  {
    id: 'percent_change_price',
    title: 'Price Changes',
    description: 'Calculate percentage increase or decrease in prices',
    equation: 'Increase: ₹280→₹350; (70/280) × 100 = 25%',
    solution: '25% increase',
    context: 'If a price increases from ₹280 to ₹350, the percentage increase is 25%.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '💰',
    color: 'bg-red-500',
    type: 'percent_change',
    translations: {
      hi: { 
        title: 'कीमत परिवर्तन', 
        description: 'कीमतों में प्रतिशत वृद्धि या कमी की गणना करें', 
        context: 'यदि कीमत ₹280 से ₹350 हो जाती है, तो प्रतिशत वृद्धि 25% है।' 
      },
      gu: { 
        title: 'કિંમત ફેરફાર', 
        description: 'કિંમતોમાં ટકાવારી વધારો અથવા ઘટાડો ગણતરી કરો', 
        context: 'જો કિંમત ₹280 થી ₹350 થાય છે, તો ટકાવારી વધારો 25% છે।' 
      }
    }
  },
  {
    id: 'percent_change_salary',
    title: 'Salary & Income Changes',
    description: 'Calculate percentage changes in salary or income',
    equation: 'Increase: ₹8000→₹10000; (2000/8000) × 100 = 25%',
    solution: '25% increase',
    context: 'If a salary increases from ₹8000 to ₹10000, the percentage increase is 25%.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '💼',
    color: 'bg-indigo-500',
    type: 'percent_change',
    translations: {
      hi: { 
        title: 'वेतन और आय परिवर्तन', 
        description: 'वेतन या आय में प्रतिशत परिवर्तन की गणना करें', 
        context: 'यदि वेतन ₹8000 से ₹10000 हो जाता है, तो प्रतिशत वृद्धि 25% है।' 
      },
      gu: { 
        title: 'વેતન અને આવક ફેરફાર', 
        description: 'વેતન અથવા આવકમાં ટકાવારી ફેરફાર ગણતરી કરો', 
        context: 'જો વેતન ₹8000 થી ₹10000 થાય છે, તો ટકાવારી વધારો 25% છે।' 
      }
    }
  },
  {
    id: 'percent_change_population',
    title: 'Population Growth',
    description: 'Calculate percentage changes in population or demographics',
    equation: 'Decrease: 500→400; (100/500) × 100 = 20%',
    solution: '20% decrease',
    context: 'If a town\'s population decreases from 500 to 400, the percentage decrease is 20%.',
    difficulty: 'beginner',
    category: 'science',
    icon: '👥',
    color: 'bg-emerald-500',
    type: 'percent_change',
    translations: {
      hi: { 
        title: 'जनसंख्या वृद्धि', 
        description: 'जनसंख्या या जनसांख्यिकी में प्रतिशत परिवर्तन की गणना करें', 
        context: 'यदि किसी शहर की जनसंख्या 500 से घटकर 400 हो जाती है, तो प्रतिशत कमी 20% है।' 
      },
      gu: { 
        title: 'વસ્તી વૃદ્ધિ', 
        description: 'વસ્તી અથવા જનસંખ્યાશાસ્ત્રમાં ટકાવારી ફેરફાર ગણતરી કરો', 
        context: 'જો કોઈ શહેરની વસ્તી 500 થી ઘટીને 400 થાય છે, તો ટકાવારી ઘટાડો 20% છે।' 
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
    interpret: {
      en: 'Interpret Percentage Statement',
      hi: 'प्रतिशत का अर्थ',
      gu: 'ટકાનો અર્થ'
    },
    percent_of_total: {
      en: 'Percentage of a Total',
      hi: 'कुल का प्रतिशत',
      gu: 'કુલનું ટકા'
    },
    ratio_to_percent: {
      en: 'Ratio to Percentage',
      hi: 'अनुपात से प्रतिशत',
      gu: 'અનુપાતથી ટકા'
    },
    percent_change: {
      en: 'Percentage Change',
      hi: 'प्रतिशत परिवर्तन',
      gu: 'ટકા ફેરફાર'
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
          <div className="text-5xl">{app.icon}</div>
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
