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
  type: 'fraction_to_percentage' | 'decimal_to_percentage' | 'percentage_to_fraction' | 'part_of_total';
  translations?: {
    [key: string]: {
      title: string;
      description: string;
      context: string;
    };
  };
}

const realWorldApplications: RealWorldApplication[] = [
  // Fraction to Percentage Examples
  {
    id: 'fraction_grade',
    title: 'Academic Performance & Grade Comparison',
    description: 'Convert fractions to percentages to compare scores fairly',
    equation: '45/50 = 0.9 = 90%',
    solution: '90%',
    context: 'A student scoring 45 out of 50 marks has achieved 90%. Converting the fraction 45/50 to a percent makes comparison clear.',
    difficulty: 'beginner',
    category: 'science',
    icon: '🎓',
    color: 'bg-blue-500',
    type: 'fraction_to_percentage',
    translations: {
      hi: { 
        title: 'शैक्षणिक प्रदर्शन और ग्रेड तुलना', 
        description: 'भिन्न को प्रतिशत में बदलकर निष्पक्ष तुलना', 
        context: 'एक छात्र ने 50 में से 45 अंक प्राप्त किए, जो 90% है। भिन्न 45/50 को प्रतिशत में बदलने से तुलना स्पष्ट हो जाती है।' 
      },
      gu: { 
        title: 'શૈક્ષણિક કામગીરી અને ગ્રેડ તુલના', 
        description: 'અપૂર્ણાંકને ટકાવારીમાં બદલીને ન્યાયપૂર્ણ તુલના', 
        context: 'એક વિદ્યાર્થીએ 50 માંથી 45 માર્ક્સ મેળવ્યા, જે 90% છે. અપૂર્ણાંક 45/50 ને ટકાવારીમાં બદલવાથી તુલના સ્પષ્ટ થાય છે.' 
      }
    }
  },
  {
    id: 'fraction_discount',
    title: 'Shopping Discounts',
    description: 'Convert fractions to percentages to understand discounts',
    equation: '1/5 = 0.2 = 20%',
    solution: '20%',
    context: 'A discount of 1/5 on a ₹1000 product equals ₹200 off (20% discount). Fractions to percentages make price changes easy to grasp.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🛍️',
    color: 'bg-orange-500',
    type: 'fraction_to_percentage',
    translations: {
      hi: { 
        title: 'खरीदारी छूट', 
        description: 'छूट को समझने के लिए भिन्न को प्रतिशत में बदलें', 
        context: '₹1000 के उत्पाद पर 1/5 की छूट ₹200 की बचत (20% छूट) के बराबर है। भिन्न को प्रतिशत में बदलने से मूल्य परिवर्तन आसानी से समझ आता है।' 
      },
      gu: { 
        title: 'ખરીદી છૂટ', 
        description: 'છૂટ સમજવા માટે અપૂર્ણાંકને ટકાવારીમાં બદલો', 
        context: '₹1000 ના ઉત્પાદન પર 1/5 ની છૂટ ₹200 ની બચત (20% છૂટ) બરાબર છે. અપૂર્ણાંકને ટકાવારીમાં બદલવાથી કિંમત પરિવર્તન સરળતાથી સમજાય છે.' 
      }
    }
  },
  {
    id: 'fraction_recipe',
    title: 'Cooking Recipes',
    description: 'Convert recipe fractions to percentages for scaling',
    equation: '3/4 = 0.75 = 75%',
    solution: '75%',
    context: 'If a recipe calls for 3/4 cup of flour, that represents 75% of the total flour needed. Converting fractions helps in recipe scaling.',
    difficulty: 'beginner',
    category: 'cooking',
    icon: '👨‍🍳',
    color: 'bg-yellow-500',
    type: 'fraction_to_percentage',
    translations: {
      hi: { 
        title: 'खाना पकाने की रेसिपी', 
        description: 'स्केलिंग के लिए रेसिपी भिन्न को प्रतिशत में बदलें', 
        context: 'यदि रेसिपी में 3/4 कप आटा चाहिए, तो यह कुल आटे का 75% है। भिन्न को बदलने से रेसिपी स्केलिंग में मदद मिलती है।' 
      },
      gu: { 
        title: 'રસોઈ રેસિપી', 
        description: 'સ્કેલિંગ માટે રેસિપી અપૂર્ણાંકને ટકાવારીમાં બદલો', 
        context: 'જો રેસિપીમાં 3/4 કપ લોટની જરૂર હોય, તો તે કુલ લોટનો 75% છે. અપૂર્ણાંક બદલવાથી રેસિપી સ્કેલિંગમાં મદદ મળે છે.' 
      }
    }
  },

  // Decimal to Percentage Examples
  {
    id: 'decimal_interest',
    title: 'Bank Interest Rates',
    description: 'Convert decimal interest rates to percentages',
    equation: '0.075 = 7.5%',
    solution: '7.5%',
    context: 'A bank offers 0.075 interest rate, which is 7.5% annually. Converting decimals to percentages makes interest rates clearer for customers.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🏦',
    color: 'bg-green-500',
    type: 'decimal_to_percentage',
    translations: {
      hi: { 
        title: 'बैंक ब्याज दरें', 
        description: 'दशमलव ब्याज दरों को प्रतिशत में बदलें', 
        context: 'एक बैंक 0.075 ब्याज दर प्रदान करता है, जो वार्षिक 7.5% है। दशमलव को प्रतिशत में बदलने से ग्राहकों के लिए ब्याज दरें स्पष्ट हो जाती हैं।' 
      },
      gu: { 
        title: 'બેંક વ્યાજ દરો', 
        description: 'દશાંશ વ્યાજ દરોને ટકાવારીમાં બદલો', 
        context: 'એક બેંક 0.075 વ્યાજ દર પ્રદાન કરે છે, જે વાર્ષિક 7.5% છે. દશાંશને ટકાવારીમાં બદલવાથી ગ્રાહકો માટે વ્યાજ દરો સ્પષ્ટ થાય છે.' 
      }
    }
  },
  {
    id: 'decimal_sales',
    title: 'Sales Performance',
    description: 'Convert decimal sales figures to percentages',
    equation: '0.85 = 85%',
    solution: '85%',
    context: 'A salesperson achieved 0.85 of their target, which is 85% completion. Decimal to percentage conversion helps track performance goals.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '📈',
    color: 'bg-purple-500',
    type: 'decimal_to_percentage',
    translations: {
      hi: { 
        title: 'बिक्री प्रदर्शन', 
        description: 'दशमलव बिक्री आंकड़ों को प्रतिशत में बदलें', 
        context: 'एक सेल्सपर्सन ने अपने लक्ष्य का 0.85 हासिल किया, जो 85% पूर्णता है। दशमलव को प्रतिशत में बदलने से प्रदर्शन लक्ष्यों को ट्रैक करने में मदद मिलती है।' 
      },
      gu: { 
        title: 'વેચાણ કામગીરી', 
        description: 'દશાંશ વેચાણ આંકડાઓને ટકાવારીમાં બદલો', 
        context: 'એક વેચાણકર્તાએ પોતાના લક્ષ્યનો 0.85 હાંસલ કર્યો, જે 85% પૂર્ણતા છે. દશાંશને ટકાવારીમાં બદલવાથી કામગીરી લક્ષ્યોને ટ્રેક કરવામાં મદદ મળે છે.' 
      }
    }
  },
  {
    id: 'decimal_weather',
    title: 'Weather Forecast',
    description: 'Convert decimal probabilities to percentages',
    equation: '0.3 = 30%',
    solution: '30%',
    context: 'Weather forecast shows 0.3 probability of rain, which is 30% chance. Converting decimals to percentages makes weather predictions clearer.',
    difficulty: 'beginner',
    category: 'science',
    icon: '🌧️',
    color: 'bg-cyan-500',
    type: 'decimal_to_percentage',
    translations: {
      hi: { 
        title: 'मौसम पूर्वानुमान', 
        description: 'दशमलव संभावनाओं को प्रतिशत में बदलें', 
        context: 'मौसम पूर्वानुमान में बारिश की 0.3 संभावना है, जो 30% मौका है। दशमलव को प्रतिशत में बदलने से मौसम पूर्वानुमान स्पष्ट हो जाते हैं।' 
      },
      gu: { 
        title: 'હવામાન આગાહી', 
        description: 'દશાંશ સંભાવનાઓને ટકાવારીમાં બદલો', 
        context: 'હવામાન આગાહીમાં વરસાદની 0.3 સંભાવના છે, જે 30% તક છે. દશાંશને ટકાવારીમાં બદલવાથી હવામાન આગાહી સ્પષ્ટ થાય છે.' 
      }
    }
  },

  // Percentage to Fraction Examples
  {
    id: 'percentage_nutrition',
    title: 'Nutritional Information',
    description: 'Convert percentages to fractions for diet planning',
    equation: '60% = 60/100 = 3/5',
    solution: '3/5',
    context: 'If 60% of your daily calories should come from carbohydrates, that means 3/5 of your food intake should be carbs. Percentages to fractions help in meal planning.',
    difficulty: 'beginner',
    category: 'science',
    icon: '🥗',
    color: 'bg-yellow-500',
    type: 'percentage_to_fraction',
    translations: {
      hi: { 
        title: 'पोषण संबंधी जानकारी', 
        description: 'आहार योजना के लिए प्रतिशत को भिन्न में बदलें', 
        context: 'यदि आपकी दैनिक कैलोरी का 60% कार्बोहाइड्रेट से आना चाहिए, तो इसका मतलब है कि आपके भोजन का 3/5 हिस्सा कार्ब्स होना चाहिए। प्रतिशत को भिन्न में बदलने से भोजन योजना में मदद मिलती है।' 
      },
      gu: { 
        title: 'પોષણ માહિતી', 
        description: 'આહાર આયોજન માટે ટકાવારીને અપૂર્ણાંકમાં બદલો', 
        context: 'જો તમારી દૈનિક કેલરીનો 60% કાર્બોહાઇડ્રેટથી આવવું જોઈએ, તો તેનો અર્થ છે કે તમારા ખોરાકનો 3/5 ભાગ કાર્બ્સ હોવો જોઈએ. ટકાવારીને અપૂર્ણાંકમાં બદલવાથી ખોરાક આયોજનમાં મદદ મળે છે.' 
      }
    }
  },
  {
    id: 'percentage_survey',
    title: 'Survey Results',
    description: 'Convert survey percentages to fractions for analysis',
    equation: '25% = 25/100 = 1/4',
    solution: '1/4',
    context: 'In a survey, 25% of people prefer tea over coffee. This means 1/4 of the population chooses tea. Converting percentages to fractions helps in data analysis.',
    difficulty: 'beginner',
    category: 'science',
    icon: '📊',
    color: 'bg-indigo-500',
    type: 'percentage_to_fraction',
    translations: {
      hi: { 
        title: 'सर्वेक्षण परिणाम', 
        description: 'विश्लेषण के लिए सर्वेक्षण प्रतिशत को भिन्न में बदलें', 
        context: 'एक सर्वेक्षण में, 25% लोग कॉफी की तुलना में चाय पसंद करते हैं। इसका मतलब है कि आबादी का 1/4 हिस्सा चाय चुनता है। प्रतिशत को भिन्न में बदलने से डेटा विश्लेषण में मदद मिलती है।' 
      },
      gu: { 
        title: 'સર્વે પરિણામો', 
        description: 'વિશ્લેષણ માટે સર્વે ટકાવારીને અપૂર્ણાંકમાં બદલો', 
        context: 'એક સર્વેમાં, 25% લોકો કોફી કરતાં ચા પસંદ કરે છે. આનો અર્થ છે કે વસ્તીનો 1/4 ભાગ ચા પસંદ કરે છે. ટકાવારીને અપૂર્ણાંકમાં બદલવાથી ડેટા વિશ્લેષણમાં મદદ મળે છે.' 
      }
    }
  },
  {
    id: 'percentage_budget',
    title: 'Budget Planning',
    description: 'Convert budget percentages to fractions for allocation',
    equation: '40% = 40/100 = 2/5',
    solution: '2/5',
    context: 'If 40% of your monthly budget goes to rent, that means 2/5 of your income is spent on housing. Converting percentages to fractions helps in budget visualization.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '💰',
    color: 'bg-emerald-500',
    type: 'percentage_to_fraction',
    translations: {
      hi: { 
        title: 'बजट योजना', 
        description: 'आवंटन के लिए बजट प्रतिशत को भिन्न में बदलें', 
        context: 'यदि आपके मासिक बजट का 40% किराए पर जाता है, तो इसका मतलब है कि आपकी आय का 2/5 हिस्सा आवास पर खर्च होता है। प्रतिशत को भिन्न में बदलने से बजट विज़ुअलाइज़ेशन में मदद मिलती है।' 
      },
      gu: { 
        title: 'બજેટ આયોજન', 
        description: 'આવંટન માટે બજેટ ટકાવારીને અપૂર્ણાંકમાં બદલો', 
        context: 'જો તમારા માસિક બજેટનો 40% ભાડા પર જાય છે, તો તેનો અર્થ છે કે તમારી આવકનો 2/5 ભાગ આવાસ પર ખર્ચ થાય છે. ટકાવારીને અપૂર્ણાંકમાં બદલવાથી બજેટ વિઝ્યુઅલાઇઝેશનમાં મદદ મળે છે.' 
      }
    }
  },

  // Part of Total Examples
  {
    id: 'part_total_inventory',
    title: 'Inventory Management',
    description: 'Calculate what percentage a part represents of total stock',
    equation: '30/120 = 0.25 = 25%',
    solution: '25%',
    context: 'If 30 out of 120 items in inventory are shoes, shoes make up 25% of total stock. Part of total calculations help in inventory distribution.',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '📦',
    color: 'bg-teal-500',
    type: 'part_of_total',
    translations: {
      hi: { 
        title: 'इन्वेंटरी प्रबंधन', 
        description: 'कुल स्टॉक में भाग का प्रतिशत गणना करें', 
        context: 'यदि इन्वेंटरी में 120 वस्तुओं में से 30 जूते हैं, तो जूते कुल स्टॉक का 25% बनाते हैं। कुल का भाग गणना इन्वेंटरी वितरण में मदद करती है।' 
      },
      gu: { 
        title: 'ઈન્વેન્ટરી મેનેજમેન્ટ', 
        description: 'કુલ સ્ટોકમાં ભાગની ટકાવારી ગણતરી કરો', 
        context: 'જો ઈન્વેન્ટરીમાં 120 વસ્તુઓમાંથી 30 જુતા છે, તો જુતા કુલ સ્ટોકનો 25% બનાવે છે. કુલનો ભાગ ગણતરી ઈન્વેન્ટરી વિતરણમાં મદદ કરે છે.' 
      }
    }
  },
  {
    id: 'part_total_quality',
    title: 'Quality Control',
    description: 'Calculate defect rate as percentage of total production',
    equation: '5/500 = 0.01 = 1%',
    solution: '1%',
    context: 'In manufacturing, if 5 out of 500 items are defective, the defect rate is 1%. Part of total calculations help evaluate quality standards.',
    difficulty: 'beginner',
    category: 'science',
    icon: '🔧',
    color: 'bg-red-500',
    type: 'part_of_total',
    translations: {
      hi: { 
        title: 'गुणवत्ता नियंत्रण', 
        description: 'कुल उत्पादन के प्रतिशत के रूप में दोष दर गणना करें', 
        context: 'निर्माण में, यदि 500 वस्तुओं में से 5 दोषपूर्ण हैं, तो दोष दर 1% है। कुल का भाग गणना गुणवत्ता मानकों का मूल्यांकन करने में मदद करती है।' 
      },
      gu: { 
        title: 'ગુણવત્તા નિયંત્રણ', 
        description: 'કુલ ઉત્પાદનના ટકા તરીકે દોષ દર ગણતરી કરો', 
        context: 'ઉત્પાદનમાં, જો 500 વસ્તુઓમાંથી 5 ખામીવાળી છે, તો દોષ દર 1% છે. કુલનો ભાગ ગણતરી ગુણવત્તા ધોરણોનું મૂલ્યાંકન કરવામાં મદદ કરે છે.' 
      }
    }
  },
  {
    id: 'part_total_sports',
    title: 'Sports Statistics',
    description: 'Calculate player performance as percentage of team total',
    equation: '18/60 = 0.3 = 30%',
    solution: '30%',
    context: 'If a basketball player scores 18 points out of team total 60 points, they contributed 30% of the team score. Part of total calculations help analyze player performance.',
    difficulty: 'beginner',
    category: 'sports',
    icon: '🏀',
    color: 'bg-orange-500',
    type: 'part_of_total',
    translations: {
      hi: { 
        title: 'खेल आंकड़े', 
        description: 'टीम कुल के प्रतिशत के रूप में खिलाड़ी प्रदर्शन गणना करें', 
        context: 'यदि एक बास्केटबॉल खिलाड़ी टीम कुल 60 अंकों में से 18 अंक बनाता है, तो उन्होंने टीम स्कोर का 30% योगदान दिया। कुल का भाग गणना खिलाड़ी प्रदर्शन का विश्लेषण करने में मदद करती है।' 
      },
      gu: { 
        title: 'રમત આંકડા', 
        description: 'ટીમ કુલના ટકા તરીકે ખેલાડી કામગીરી ગણતરી કરો', 
        context: 'જો એક બાસ્કેટબોલ ખેલાડી ટીમ કુલ 60 પોઈન્ટમાંથી 18 પોઈન્ટ બનાવે છે, તો તેમણે ટીમ સ્કોરમાં 30% યોગદાન આપ્યું છે. કુલનો ભાગ ગણતરી ખેલાડી કામગીરીનું વિશ્લેષણ કરવામાં મદદ કરે છે.' 
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
    fraction_to_percentage: {
      en: 'Fraction to Percentage',
      hi: 'भिन्न से प्रतिशत',
      gu: 'અપૂર્ણાંકથી ટકાવારી'
    },
    decimal_to_percentage: {
      en: 'Decimal to Percentage',
      hi: 'दशमलव से प्रतिशत',
      gu: 'દશાંશથી ટકાવારી'
    },
    percentage_to_fraction: {
      en: 'Percentage to Fraction',
      hi: 'प्रतिशत से भिन्न',
      gu: 'ટકાવારીથી અપૂર્ણાંક'
    },
    part_of_total: {
      en: 'Part of Total',
      hi: 'कुल का भाग',
      gu: 'કુલનો ભાગ'
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
