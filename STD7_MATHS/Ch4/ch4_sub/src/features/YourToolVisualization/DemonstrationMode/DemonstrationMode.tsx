import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

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
  const { isTransitioning } = useLanguage();

  return (
    <div className={`transition-all duration-100 ease-out ${
      isTransitioning ? 'opacity-70 scale-995' : 'opacity-100 scale-100'
    }`}>
      {/* Equation Examples Block */}
      <div className="transition-all duration-800 ease-out">
          <div className="bg-gradient-to-br from-white to-teal-50/50 rounded-xl border border-teal-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-purple-600 h-1"></div>
            <div className="p-4">
              <EquationAnimation />
            </div>
        </div>
      </div>

      {/* Step-by-Step Explanation Block */}
      <div className="transition-all duration-800 ease-out mt-6">
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl border border-blue-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1"></div>
          <div className="p-4">
            <StepByStepExplanation />
          </div>
        </div>
      </div>
    </div>
  );
}

function EquationAnimation() {
  return <LinearEquationExample />;
}

function LinearEquationExample() {
  const { t, language } = useLanguage();
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

  // Language-specific equation examples
  const equationExamples = {
    en: [
      { equation: "x + 5 = 12", solution: "x = 7", operation: "Addition", icon: "➕" },
      { equation: "x - 3 = 8", solution: "x = 11", operation: "Subtraction", icon: "➖" },
      { equation: "2x = 10", solution: "x = 5", operation: "Multiplication", icon: "✖️" },
      { equation: "x/4 = 3", solution: "x = 12", operation: "Division", icon: "➗" }
    ],
    hi: [
      { equation: "x + 5 = 12", solution: "x = 7", operation: "जोड़", icon: "➕" },
      { equation: "x - 3 = 8", solution: "x = 11", operation: "घटाव", icon: "➖" },
      { equation: "2x = 10", solution: "x = 5", operation: "गुणा", icon: "✖️" },
      { equation: "x/4 = 3", solution: "x = 12", operation: "भाग", icon: "➗" }
    ],
    gu: [
      { equation: "x + 5 = 12", solution: "x = 7", operation: "સરવાળો", icon: "➕" },
      { equation: "x - 3 = 8", solution: "x = 11", operation: "બાદબાકી", icon: "➖" },
      { equation: "2x = 10", solution: "x = 5", operation: "ગુણાકાર", icon: "✖️" },
      { equation: "x/4 = 3", solution: "x = 12", operation: "ભાગાકાર", icon: "➗" }
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
                    <AnimatedText text={language === 'hi' ? '' : `${(t('linearEquationsDesc') || '').split('.')[1] || ''}.`} delay={0} />
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
                  <div
                    key={index}
                    className={`transition-all duration-1200 ease-out ${
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
                  </div>
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
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold text-gray-700">{operation}</span>
        </div>
        
        {/* Equation Display */}
        <div className="text-lg font-mono mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <span className="text-black">
            {displayedEquation}
          </span>
        </div>
      </div>
    </div>
  );
}

function StepByStepExplanation() {
  const { language } = useLanguage();
  const [showBlock2, setShowBlock2] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showStep1, setShowStep1] = useState(false);
  const [showStep2, setShowStep2] = useState(false);
  const [showStep3, setShowStep3] = useState(false);
  const [showStep4, setShowStep4] = useState(false);
  const [showStep5, setShowStep5] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Language-specific step explanations for subtraction example: x - 5 = 7
  const stepExplanations = {
    en: {
      title: "Subtraction Examples",
      steps: [
        {
          step: "Step 1:",
          equation: "x - 5 = 7",
          explanation: "Start with the given equation"
        },
        {
          step: "Step 2:",
          equation: "x - 5 + 5 = 7 + 5",
          explanation: "Add 5 to both sides to isolate x"
        },
        {
          step: "Step 3:",
          equation: "x = 12",
          explanation: "Simplify both sides"
        },
        {
          step: "Step 4:",
          equation: "12 - 5 = 7",
          explanation: "Check: Substitute x = 12 back into original equation"
        },
        {
          step: "Step 5:",
          equation: "7 = 7 ✓",
          explanation: "Verification: Both sides are equal, solution is correct"
        }
      ]
    },
    hi: {
      title: "घटाव के उदाहरण",
      steps: [
        {
          step: "चरण 1:",
          equation: "x - 5 = 7",
          explanation: "दिए गए समीकरण से शुरू करें"
        },
        {
          step: "चरण 2:",
          equation: "x - 5 + 5 = 7 + 5",
          explanation: "x को अलग करने के लिए दोनों तरफ में 5 जोड़ें"
        },
        {
          step: "चरण 3:",
          equation: "x = 12",
          explanation: "दोनों तरफ को सरल बनाएं"
        },
        {
          step: "चरण 4:",
          equation: "12 - 5 = 7",
          explanation: "जांच: x = 12 को मूल समीकरण में रखें"
        },
        {
          step: "चरण 5:",
          equation: "7 = 7 ✓",
          explanation: "सत्यापन: दोनों तरफ बराबर हैं, समाधान सही है"
        }
      ]
    },
    gu: {
      title: "બાદબાકીના ઉદાહરણો",
      steps: [
        {
          step: "પગલું 1:",
          equation: "x - 5 = 7",
          explanation: "આપેલ સમીકરણથી શરૂ કરો"
        },
        {
          step: "પગલું 2:",
          equation: "x - 5 + 5 = 7 + 5",
          explanation: "x ને અલગ કરવા માટે બંને બાજુઓમાં 5 ઉમેરો"
        },
        {
          step: "પગલું 3:",
          equation: "x = 12",
          explanation: "બંને બાજુને સરળ બનાવો"
        },
        {
          step: "પગલું 4:",
          equation: "12 - 5 = 7",
          explanation: "તપાસ: x = 12 ને મૂળ સમીકરણમાં મૂકો"
        },
        {
          step: "પગલું 5:",
          equation: "7 = 7 ✓",
          explanation: "સત્યાપન: બંને બાજુ સમાન છે, ઉકેલ સાચો છે"
        }
      ]
    }
  };

  const currentExplanation = stepExplanations[language] || stepExplanations.en;

  useEffect(() => {
    // Reset all states when language changes
    setShowBlock2(false);
    setShowTitle(false);
    setShowStep1(false);
    setShowStep2(false);
    setShowStep3(false);
    setShowStep4(false);
    setShowStep5(false);
    setIsLooping(false);

    // Wait for Block 1 to complete (10600ms + 300ms buffer)
    const block2StartTimer = setTimeout(() => setShowBlock2(true), 10900);
    
    // Sequential step display (relative to block 2 start)
    const timer1 = setTimeout(() => setShowTitle(true), 11100); // 200ms after block 2 starts
    const timer2 = setTimeout(() => setShowStep1(true), 11400); // 500ms after block 2 starts
    const timer3 = setTimeout(() => setShowStep2(true), 11900); // 1000ms after block 2 starts
    const timer4 = setTimeout(() => setShowStep3(true), 12400); // 1500ms after block 2 starts
    const timer5 = setTimeout(() => setShowStep4(true), 12900); // 2000ms after block 2 starts
    const timer6 = setTimeout(() => setShowStep5(true), 13400); // 2500ms after block 2 starts
    
    // Start looping after all steps are shown
    const loopTimer = setTimeout(() => {
      setIsLooping(true);
    }, 14400); // Start loop 1 second after step 5 is shown

    return () => {
      clearTimeout(block2StartTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(loopTimer);
    };
  }, [language]);

  // Loop effect - separate useEffect for looping
  useEffect(() => {
    if (!isLooping) return;

    const loopInterval = setInterval(() => {
      // Reset all steps
      setShowTitle(false);
      setShowStep1(false);
      setShowStep2(false);
      setShowStep3(false);
      setShowStep4(false);
      setShowStep5(false);
      
      // Restart the sequence
      setTimeout(() => setShowTitle(true), 200);
      setTimeout(() => setShowStep1(true), 500);
      setTimeout(() => setShowStep2(true), 1000);
      setTimeout(() => setShowStep3(true), 1500);
      setTimeout(() => setShowStep4(true), 2000);
      setTimeout(() => setShowStep5(true), 2500);
    }, 4000); // Loop every 4 seconds (3.5s for steps + 0.5s pause)

    return () => {
      clearInterval(loopInterval);
    };
  }, [isLooping]);

  return (
    <div className={`rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 p-4 shadow-lg transition-all duration-1000 ease-out ${
      showBlock2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`}>
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className={`text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4 transition-all duration-1000 ease-out ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {currentExplanation.title}
        </h3>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {currentExplanation.steps.map((step, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg p-4 border border-blue-200 shadow-sm transition-all duration-1000 ease-out ${
              (index === 0 && showStep1) || 
              (index === 1 && showStep2) || 
              (index === 2 && showStep3) || 
              (index === 3 && showStep4) || 
              (index === 4 && showStep5)
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-4 scale-95'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full min-w-fit transition-all duration-800 ease-out">
                {step.step}
              </div>
              <div className="flex-1">
                <div className="text-lg font-mono text-black mb-2 bg-gray-50 rounded p-2 border transition-all duration-800 ease-out">
                  {step.equation}
                </div>
                <p className="text-gray-700 text-sm transition-all duration-800 ease-out">
                  <AnimatedText text={step.explanation} delay={0} speed={200} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}