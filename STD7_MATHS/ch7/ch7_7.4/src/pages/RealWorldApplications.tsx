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
  steps?: string[];
  stepsKey?: boolean; // Flag to indicate steps are translation keys
  translations?: {
    [key: string]: {
      title: string;
      description: string;
      context: string;
    };
  };
}

const realWorldApplications: RealWorldApplication[] = [
  // Simple Interest Basics
  {
    id: 'si_basic_terms',
    title: 'Basic Terms: Principal, Interest, Amount, Rate, Time',
    description: 'Understand P (Principal), I (Interest), A (Amount), R (Rate p.a.), T (Time in years)',
    equation: 'A = P + I',
    solution: '—',
    context: 'Principal (P) is the money borrowed. Interest (I) is the extra paid for using the money. Amount (A) is total to repay = P + I. Rate (R) is percentage per annum. Time (T) is the borrowing period in years.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '📘',
    color: 'bg-blue-500',
    type: 'fraction_to_percentage',
    steps: [
      'rwa_step_identifyPrincipal',
      'rwa_step_identifyRate',
      'rwa_step_identifyTime',
      'rwa_step_computeInterest',
      'rwa_step_computeAmount'
    ],
    stepsKey: true,
    translations: {
      hi: {
        title: 'मूल शब्द: मूलधन, ब्याज, राशि, दर, समय',
        description: 'P (मूलधन), I (ब्याज), A (राशि), R (वार्षिक दर), T (वर्ष) को समझें',
        context: 'मूलधन (P) उधार ली गई राशि है। ब्याज (I) पैसे के उपयोग का अतिरिक्त भुगतान है। राशि (A) = P + I. दर (R) वार्षिक प्रतिशत है। समय (T) वर्षों में होता है।'
      },
      gu: {
        title: 'મૂળ શબ્દો: મૂળધન, વ્યાજ, રકમ, દર, સમય',
        description: 'P (મૂળધન), I (વ્યાજ), A (રકમ), R (વર્ષિક દર), T (વર્ષ) સમજવું',
        context: 'મૂળધન (P) ઉધાર લીધેલા પૈસા છે. વ્યાજ (I) પૈસા ઉપયોગ માટે ચૂકવાતું વધારાનું છે. રકમ (A) = P + I. દર (R) પ્રતિ વર્ષ. સમય (T) વર્ષોમાં.'
      }
    }
  },

  // Basics: add third card
  {
    id: 'si_what_is_principal',
    title: 'What is Principal (P)?',
    description: 'Principal is the original amount of money borrowed or invested',
    equation: 'P = A − I',
    solution: 'P in ₹',
    context: 'If you know the amount (A) and interest (I), principal P can be found as P = A − I. Example: A=₹1300, I=₹300 ⇒ P=₹1000.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🏷️',
    color: 'bg-sky-500',
    type: 'fraction_to_percentage',
    steps: [
      'rwa_step_identifyTotalAmount',
      'rwa_step_useRelation',
      'rwa_step_computePrincipal'
    ],
    stepsKey: true,
    translations: {
      hi: {
        title: 'मूलधन (P) क्या है?',
        description: 'मूलधन वह मूल राशि है जो उधार ली या निवेश की गई है',
        context: 'यदि राशि A और ब्याज I ज्ञात हों, तो P = A − I. उदाहरण: A=₹1300, I=₹300 ⇒ P=₹1000.'
      },
      gu: {
        title: 'મૂળધન (P) શું છે?',
        description: 'મૂળધન એ મૂળ રકમ છે જે ઉધાર લેવામાં આવી કે રોકાયેલી છે',
        context: 'જો રકમ A અને વ્યાજ I જાણીતું હોય તો P = A − I. ઉદાહરણ: A=₹1300, I=₹300 ⇒ P=₹1000.'
      }
    }
  },
  {
    id: 'si_rate_meaning',
    title: 'Understanding Interest Rate (p.a.)',
    description: '10% p.a. means ₹10 per year on every ₹100',
    equation: 'On ₹100 → ₹10 in 1 year',
    solution: '—',
    context: 'Interest is typically expressed per annum (per year). For example, 10% p.a. means for every ₹100 borrowed, ₹10 is paid as interest for one year.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '📊',
    color: 'bg-emerald-500',
    type: 'fraction_to_percentage',
    steps: [
      'rwa_step_rateExample',
      'rwa_step_rateProportion',
      'rwa_step_estimateInterest'
    ],
    stepsKey: true,
    translations: {
      hi: {
        title: 'ब्याज दर (p.a.) को समझना',
        description: '10% p.a. का अर्थ है हर ₹100 पर प्रति वर्ष ₹10',
        context: 'ब्याज आमतौर पर प्रति वर्ष व्यक्त किया जाता है। उदाहरण: 10% p.a. पर हर ₹100 पर 1 वर्ष में ₹10 ब्याज।'
      },
      gu: {
        title: 'વ્યાજદર (p.a.) સમજવું',
        description: '10% p.a. નો મતલબ દર ₹100 પર દર વર્ષે ₹10',
        context: 'વ્યાજ સામાન્ય રીતે વાર્ષિક હોય છે. ઉદાહરણ: 10% p.a. એ દર ₹100 પર 1 વર્ષે ₹10 વ્યાજ.'
      }
    }
  },

  // Simple Interest Formula
  {
    id: 'si_one_year',
    title: 'Simple Interest for One Year',
    description: 'Use the formula I = (P × R) / 100 for 1 year',
    equation: 'I = (P × R) / 100',
    solution: 'I in ₹',
    context: 'When the time is 1 year, simple interest equals Principal × Rate ÷ 100. Example: P = ₹2000 at 8% p.a. → I = (2000 × 8)/100 = ₹160.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🧮',
    color: 'bg-green-500',
    type: 'decimal_to_percentage',
    steps: [
      'rwa_step_writeFormula',
      'rwa_step_substitutePR',
      'rwa_step_calculate',
      'rwa_step_multiply',
      'rwa_step_divide100'
    ],
    stepsKey: true,
    translations: {
      hi: {
        title: 'एक वर्ष के लिए साधारण ब्याज',
        description: '1 वर्ष के लिए I = (P × R)/100 का उपयोग करें',
        context: 'जब समय 1 वर्ष हो, तो I = P × R ÷ 100. उदाहरण: P=₹2000, R=8% → I=₹160.'
      },
      gu: {
        title: 'એક વર્ષ માટે સરળ વ્યાજ',
        description: '1 વર્ષ માટે I = (P × R)/100 વાપરો',
        context: 'સમય 1 વર્ષ હોય ત્યારે I = P × R ÷ 100. ઉદાહરણ: P=₹2000, R=8% → I=₹160.'
      }
    }
  },
  {
    id: 'si_multi_years',
    title: 'Simple Interest for Multiple Years',
    description: 'Use I = (P × R × T) / 100 for T years',
    equation: 'I = (P × R × T) / 100',
    solution: 'I in ₹',
    context: 'For T years, multiply by the time. Example: P = ₹3000, R = 5% p.a., T = 3 → I = (3000 × 5 × 3)/100 = ₹450.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '⏱️',
    color: 'bg-purple-500',
    type: 'decimal_to_percentage',
    steps: [
      'rwa_step_writeFormulaMulti',
      'rwa_step_substitutePRT',
      'rwa_step_multiplyPRT',
      'rwa_step_divide100Result'
    ],
    stepsKey: true,
    translations: {
      hi: {
        title: 'कई वर्षों के लिए साधारण ब्याज',
        description: 'T वर्षों के लिए I = (P × R × T)/100 का उपयोग करें',
        context: 'उदाहरण: P=₹3000, R=5%, T=3 → I=₹450.'
      },
      gu: {
        title: 'ઘણા વર્ષો માટે સરળ વ્યાજ',
        description: 'T વર્ષ માટે I = (P × R × T)/100 વાપરો',
        context: 'ઉદાહરણ: P=₹3000, R=5%, T=3 → I=₹450.'
      }
    }
  },

  // Months handling (to complete 3 cards in this row)
  {
    id: 'si_months',
    title: 'Simple Interest for Months (T in years)',
    description: 'Convert months to years when computing SI',
    equation: 'I = (P × R × (months/12)) / 100',
    solution: 'I in ₹',
    context: 'Example: P=₹9200, R=9% p.a., T=6 months ⇒ T=0.5 years. I=(9200×9×0.5)/100=₹414.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🗓️',
    color: 'bg-pink-500',
    type: 'decimal_to_percentage',
    steps: [
      'rwa_convertMonths',
      'rwa_applyFormula',
      'rwa_substituteCompute'
    ],
    stepsKey: true,
    translations: {
      hi: {
        title: 'महीनों के लिए साधारण ब्याज (T वर्षों में)',
        description: 'SI निकालते समय महीनों को वर्षों में बदलें',
        context: 'उदाहरण: P=₹9200, R=9%, T=6 माह ⇒ T=0.5 वर्ष। I=(9200×9×0.5)/100=₹414.'
      },
      gu: {
        title: 'મહિના માટે સરળ વ્યાજ (T વર્ષમાં)',
        description: 'SI ગણતા મહિના ને વર્ષમાં રૂપાંતર કરો',
        context: 'ઉદાહરણ: P=₹9200, R=9%, T=6 મહિના ⇒ T=0.5 વર્ષ. I=(9200×9×0.5)/100=₹414.'
      }
    }
  },

  // Amount Computation
  {
    id: 'si_amount',
    title: 'Amount to be Paid',
    description: 'Add interest to principal to get total amount',
    equation: 'A = P + I = 5000 + 750 = ₹5750',
    solution: '₹5750',
    context: 'Using Anita’s example: P = ₹5000 and I = ₹750. Amount is A = P + I = 5000 + 750 = ₹5750.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '💰',
    color: 'bg-yellow-500',
    type: 'percentage_to_fraction',
    steps: [
      'rwa_step_writeAmountFormula',
      'rwa_step_useValues',
      'rwa_step_substituteAdd',
      'rwa_step_computeAmountFinal'
    ],
    stepsKey: true
  },

  // Amount: add third card
  {
    id: 'si_amount_example_b',
    title: 'Amount Example (3 years)',
    description: 'Find A when interest is known after T years',
    equation: 'A = 3000 + 450 = ₹3450',
    solution: '₹3450',
    context: 'For P=₹3000, R=5% p.a., T=3 years → I=(3000×5×3)/100=₹450, so A=P+I=₹3450.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🧾',
    color: 'bg-amber-500',
    type: 'percentage_to_fraction',
    steps: [
      'rwa_step_computeInterestFormula',
      'rwa_step_addToPrincipal',
      'rwa_step_reportAmount'
    ],
    stepsKey: true,
    translations: {
      hi: {
        title: 'राशि का उदाहरण (3 वर्ष)',
        description: 'T वर्षों बाद ब्याज मिलने पर राशि A निकालें',
        context: 'P=₹3000, R=5% p.a., T=3 वर्ष → I=₹450, अतः A=₹3450.'
      },
      gu: {
        title: 'રકમ ઉદાહરણ (3 વર્ષ)',
        description: 'T વર્ષ પછી વ્યાજ મળ્યા પછી રકમ A શોધો',
        context: 'P=₹3000, R=5% p.a., T=3 વર્ષ → I=₹450, એટલે A=₹3450.'
      }
    }
  },

  // Worked Example
  {
    id: 'si_example_anita',
    title: 'Example: Anita’s Loan',
    description: 'Find interest and amount for a one-year loan',
    equation: 'I = (5000 × 15 × 1) / 100 = ₹750',
    solution: 'A = ₹5750',
    context: 'Anita borrows ₹5,000 at 15% p.a. for 1 year. Interest I = (P × R × T)/100 = (5000 × 15 × 1)/100 = ₹750. Amount A = P + I = ₹5750.',
    difficulty: 'beginner',
    category: 'finance',
    icon: '🏦',
    color: 'bg-cyan-500',
    type: 'percentage_to_fraction',
    steps: [
      'rwa_step_writeFormulaAnita',
      'rwa_step_substituteAnita',
      'rwa_step_multiplyAnita',
      'rwa_step_divideAnita',
      'rwa_step_amountAnita'
    ],
    stepsKey: true
  },

  // (removed key point card per request)
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

  // Type titles using translations
  const typeTitles = {
    fraction_to_percentage: t('rwa_siBasics'),
    decimal_to_percentage: t('rwa_siFormula'),
    percentage_to_fraction: t('rwa_amount'),
    part_of_total: t('rwa_keyPoints')
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
                    {t('solutionGoal').replace('{solution}', app.solution)}
                  </div>
                </div>
                {app.steps && (
                  <div className="mt-6 text-green-900">
                    {app.steps.map((step, idx) => {
                      const stepText = (app as any).stepsKey ? t(step) : step;
                      return (
                        <div key={idx} className="mb-2">
                          <span className="font-semibold">{t('stepWithNumber').replace('{n}', String(idx + 1))}</span> {stepText}
                        </div>
                      );
                    })}
                  </div>
                )}
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
                      {typeTitles[type as keyof typeof typeTitles]}
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
