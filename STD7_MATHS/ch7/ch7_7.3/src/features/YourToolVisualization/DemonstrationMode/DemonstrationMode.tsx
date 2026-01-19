import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import ComprehensiveProfitLossTool from '../../../components/ComprehensiveProfitLossTool';

function AnimatedText({ text, delay = 0, speed = 100 }: { text: string; delay?: number; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    let currentIndex = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, speed); // Configurable speed between each word
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default function DemonstrationMode() {
  const { isTransitioning, language } = useLanguage();
  const [showTool, setShowTool] = useState(false);
  const [selectedTypeForTool, setSelectedTypeForTool] = useState<
    'profit_calculation' | 'loss_calculation' | 'profit_percentage' | 'loss_percentage' | null
  >(null);

  return (
    <div className={`transition-all duration-100 ease-out ${
      isTransitioning ? 'opacity-70 scale-995' : 'opacity-100 scale-100'
    }`}>
      {/* Equation Examples Block */}
      <div className="transition-all duration-800 ease-out">
          <div className="bg-gradient-to-br from-white to-teal-50/50 rounded-xl border border-teal-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-purple-600 h-1"></div>
            <div className="p-4">
              <EquationAnimation
                onSelectType={(t: 'profit_calculation' | 'loss_calculation' | 'profit_percentage' | 'loss_percentage') => {
                  setSelectedTypeForTool(t);
                  setShowTool(true);
                }}
              />
            </div>
        </div>
      </div>

      {/* Independent Step-by-Step Tool Block (Block 2) */}
      {showTool && (
        <div className="transition-all duration-800 ease-out mt-6">
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl border border-blue-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1"></div>
            <div className="p-4">
              <ComprehensiveProfitLossTool
                language={language}
                showStep={true}
                defaultSelectedType={selectedTypeForTool || 'profit_calculation'}
                onBackToTypes={() => setShowTool(false)}
                hideTypeGrid={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EquationAnimation({ onSelectType }: { onSelectType: (t: 'profit_calculation' | 'loss_calculation' | 'profit_percentage' | 'loss_percentage') => void }) {
  return <LinearEquationExample onSelectType={onSelectType} />;
}

function LinearEquationExample({ onSelectType }: { onSelectType: (t: 'profit_calculation' | 'loss_calculation' | 'profit_percentage' | 'loss_percentage') => void }) {
  const { t, language } = useLanguage();
  // Removed inline tool selection; Block 1 is examples-only
  const [showTitle, setShowTitle] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [showVariableX, setShowVariableX] = useState(false);
  const [showRestOfDefinition, setShowRestOfDefinition] = useState(false);
  const [showExamplesTitle, setShowExamplesTitle] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [visibleExampleIndex, setVisibleExampleIndex] = useState(-1);
  
  useEffect(() => {
    // Reset all states when language changes
    setShowTitle(false);
    setShowDefinition(false);
    setShowVariableX(false);
    setShowRestOfDefinition(false);
    setShowExamplesTitle(false);
    setShowExamples(false);
    setVisibleExampleIndex(-1);

    // Sequential display with custom delays
    const timer1 = setTimeout(() => setShowTitle(true), 0); // "Linear Equations" title
    const timer2 = setTimeout(() => setShowDefinition(true), 700); // First definition sentence (700ms after title)
    const timer3 = setTimeout(() => setShowVariableX(true), 1900); // Variable x symbol (1200ms after first definition)
    const timer4 = setTimeout(() => setShowRestOfDefinition(true), 3100); // Second definition sentence (1200ms after x symbol)
    const timer5 = setTimeout(() => setShowExamplesTitle(true), 4100); // "Examples" title (1000ms after second definition)
    const timer6 = setTimeout(() => setShowExamples(true), 5500); // Examples container (1400ms after examples title)
    const timer7 = setTimeout(() => setVisibleExampleIndex(0), 6700); // Addition example (1200ms after container)
    const timer8 = setTimeout(() => setVisibleExampleIndex(1), 8000); // Subtraction example (1300ms after Addition)
    const timer9 = setTimeout(() => setVisibleExampleIndex(2), 9300); // Multiplication example (1300ms after Subtraction)
    const timer10 = setTimeout(() => setVisibleExampleIndex(3), 10600); // Division example (1300ms after Multiplication)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
      clearTimeout(timer9);
      clearTimeout(timer10);
    };
  }, [language]); // Re-run when language changes

  // Language-specific profit/loss examples (Topic 7.3)
  const equationExamples = {
    en: [
      { equation: "CP = ₹100, SP = ₹120, Profit = ₹20", solution: "₹20", operation: "Profit Calculation", icon: "💰" },
      { equation: "CP = ₹150, SP = ₹120, Loss = ₹30", solution: "₹30", operation: "Loss Calculation", icon: "📉" },
      { equation: "CP = ₹200, Profit = ₹40, Profit % = 20%", solution: "20%", operation: "Profit Percentage", icon: "📊" },
      { equation: "CP = ₹300, Loss = ₹45, Loss % = 15%", solution: "15%", operation: "Loss Percentage", icon: "📈" }
    ],
    hi: [
      { equation: "CP = ₹100, SP = ₹120, लाभ = ₹20", solution: "₹20", operation: "लाभ गणना", icon: "💰" },
      { equation: "CP = ₹150, SP = ₹120, हानि = ₹30", solution: "₹30", operation: "हानि गणना", icon: "📉" },
      { equation: "CP = ₹200, लाभ = ₹40, लाभ % = 20%", solution: "20%", operation: "लाभ प्रतिशत", icon: "📊" },
      { equation: "CP = ₹300, हानि = ₹45, हानि % = 15%", solution: "15%", operation: "हानि प्रतिशत", icon: "📈" }
    ],
    gu: [
      { equation: "CP = ₹100, SP = ₹120, નફો = ₹20", solution: "₹20", operation: "નફો ગણતરી", icon: "💰" },
      { equation: "CP = ₹150, SP = ₹120, નુકસાન = ₹30", solution: "₹30", operation: "નુકસાન ગણતરી", icon: "📉" },
      { equation: "CP = ₹200, નફો = ₹40, નફો % = 20%", solution: "20%", operation: "નફો ટકાવારી", icon: "📊" },
      { equation: "CP = ₹300, નુકસાન = ₹45, નુકસાન % = 15%", solution: "15%", operation: "નુકસાન ટકાવારી", icon: "📈" }
    ]
  };

  const currentExamples = equationExamples[language] || equationExamples.en;

  return (
    <div className="rounded-xl bg-gradient-to-br from-teal-50 to-purple-50 border-2 border-teal-200/60 p-4 shadow-lg mt-2 relative overflow-hidden">
      {/* Definition Section */}
      <div className="text-center mb-6">
        <h3 className={`text-lg font-bold bg-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent mb-4 transition-all duration-1000 ease-out ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {t('linearEquations')}
        </h3>
        
        {/* Definition Text */}
        <div className="space-y-3">
                  <p className={`text-gray-700 text-sm transition-all duration-1000 ease-out ${
                    showDefinition ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <AnimatedText text={`${(t('linearEquationsDesc') || '').split('.')[0] || ''}.`} delay={0} />
                  </p>
          
          {/* Variable X Display */}
          <div className={`transition-all duration-1000 ease-out ${
            showVariableX ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="inline-block bg-gradient-to-r from-teal-400 to-purple-400 text-white text-4xl font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              x
            </div>
            {language === 'hi' && (
              <div className="mt-3">
                <AnimatedText text="इन्हें जोड़, घटाव, गुणा और भाग जैसी बुनियादी बीजगणितीय संक्रियाओं का उपयोग करके हल किया जा सकता है।" delay={0} />
              </div>
            )}
          </div>
          
                  <p className={`text-gray-700 text-sm transition-all duration-1000 ease-out ${
                    showRestOfDefinition ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <AnimatedText text={`${(t('linearEquationsDesc') || '').split('.')[1] || ''}.`} delay={0} />
                  </p>
        </div>
      </div>

      {/* Examples Section */}
      {showExamples && (
        <div className={`transition-all duration-1000 ease-out ${
          showExamples ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h4 className={`text-md font-semibold text-gray-800 mb-4 text-center transition-all duration-1000 ease-out ${
            showExamplesTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {language === 'en' ? 'Examples' : language === 'hi' ? 'उदाहरण' : 'ઉદાહરણો'}
          </h4>
          
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                {currentExamples.map((example, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      const mapping: Record<number, 'profit_calculation' | 'loss_calculation' | 'profit_percentage' | 'loss_percentage'> = {
                        0: 'profit_calculation',
                        1: 'loss_calculation',
                        2: 'profit_percentage',
                        3: 'loss_percentage'
                      };
                      onSelectType(mapping[index]);
                    }}
                    className={`text-left transition-all duration-1200 ease-out ${
                      visibleExampleIndex >= index 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                  >
                    <AnimatedEquation
                      equation={example.equation}
                      operation={example.operation}
                      icon={example.icon}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnimatedEquation({ equation, operation, icon }: {
  equation: string;
  operation: string;
  icon: string;
}) {
  const [displayedEquation, setDisplayedEquation] = useState('');

  useEffect(() => {
    setDisplayedEquation(equation);
  }, [equation]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-teal-200/50 shadow-inner hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-3xl">{icon}</span>
          <span className="text-sm font-semibold text-gray-700">{operation}</span>
        </div>
        
        {/* Equation Display */}
        <div className="text-lg font-mono mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <span className="text-black animate-slideIn">
            {displayedEquation}
          </span>
        </div>
      </div>
    </div>
  );
}

// StepByStepExplanation removed; the tool is rendered inline after clicking an example.
