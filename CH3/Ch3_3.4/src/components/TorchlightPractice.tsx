import React, { useState } from 'react';
import {
  CheckCircle, XCircle, RotateCcw,
  ChevronRight, ChevronLeft, Trophy, Star, BookOpen,
  Target, Brain, Home
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type QuestionType = 'mcq' | 'trueFalse' | 'identify' | 'scenario';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface Question {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: {
    english: string;
    hindi: string;
    gujarati: string;
  };
  options?: {
    english: string[];
    hindi: string[];
    gujarati: string[];
  };
  correctAnswer: number;
  explanation: {
    english: string;
    hindi: string;
    gujarati: string;
  };
  topic: string;
}

const ConductorsInsulatorsPractice: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentView, setCurrentView] = useState<'topics' | 'practice' | 'results'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Map i18n language codes to component language format
  const getLanguageKey = (): 'english' | 'hindi' | 'gujarati' => {
    if (language === 'hi') return 'hindi';
    if (language === 'gu') return 'gujarati';
    return 'english';
  };
  const langKey = getLanguageKey();

  // Question Bank
  const questionBank: Question[] = [
    // Basic Conductor/Insulator Identification - Easy
    {
      id: 'ci_1',
      type: 'mcq',
      difficulty: 'easy',
      question: {
        english: 'Which of the following is a conductor of electricity?',
        hindi: 'निम्नलिखित में से कौन विद्युत का सुचालक है?',
        gujarati: 'નીચેનામાંથી કયું વીજળીનું સુવાહક છે?'
      },
      options: {
        english: ['Plastic scale', 'Copper wire', 'Rubber eraser', 'Wooden stick'],
        hindi: ['प्लास्टिक स्केल', 'तांबे का तार', 'रबर का इरेज़र', 'लकड़ी की छड़ी'],
        gujarati: ['પ્લાસ્ટિક સ્કેલ', 'તાંબાનો તાર', 'રબરનું ઇરેઝર', 'લાકડાની લાકડી']
      },
      correctAnswer: 1,
      explanation: {
        english: 'Copper wire is a conductor because it is made of metal. Metals allow electricity to flow through them easily.',
        hindi: 'तांबे का तार एक सुचालक है क्योंकि यह धातु से बना होता है। धातुएं विद्युत को आसानी से प्रवाहित होने देती हैं।',
        gujarati: 'તાંબાનો તાર સુવાહક છે કારણ કે તે ધાતુથી બનેલો છે. ધાતુઓ વીજળીને સરળતાથી વહેવા દે છે.'
      },
      topic: 'identification'
    },
    {
      id: 'ci_2',
      type: 'mcq',
      difficulty: 'easy',
      question: {
        english: 'Which material is an insulator?',
        hindi: 'कौन सी सामग्री कुचालक है?',
        gujarati: 'કઈ સામગ્રી કુવાહક છે?'
      },
      options: {
        english: ['Iron nail', 'Aluminum foil', 'Glass bangle', 'Steel spoon'],
        hindi: ['लोहे की कील', 'एल्युमिनियम फॉयल', 'कांच की चूड़ी', 'स्टील का चम्मच'],
        gujarati: ['લોખંડની ખીલી', 'એલ્યુમિનિયમ ફોઇલ', 'કાચનું બંગડી', 'સ્ટીલનો ચમચો']
      },
      correctAnswer: 2,
      explanation: {
        english: 'Glass bangle is an insulator because glass does not allow electricity to pass through it.',
        hindi: 'कांच की चूड़ी एक कुचालक है क्योंकि कांच विद्युत को अपने माध्यम से नहीं जाने देता।',
        gujarati: 'કાચનું બંગડી કુવાહક છે કારણ કે કાચ વીજળીને તેમાંથી પસાર થવા દેતું નથી.'
      },
      topic: 'identification'
    },
    {
      id: 'ci_3',
      type: 'trueFalse',
      difficulty: 'easy',
      question: {
        english: 'All metals are good conductors of electricity.',
        hindi: 'सभी धातुएं विद्युत की अच्छी सुचालक होती हैं।',
        gujarati: 'બધી ધાતુઓ વીજળીની સારી સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 0,
      explanation: {
        english: 'True! All metals like copper, iron, aluminum, gold, and silver are good conductors of electricity.',
        hindi: 'सही! तांबा, लोहा, एल्युमिनियम, सोना और चांदी जैसी सभी धातुएं विद्युत की अच्छी सुचालक होती हैं।',
        gujarati: 'સાચું! તાંબુ, લોખંડ, એલ્યુમિનિયમ, સોનું અને ચાંદી જેવી બધી ધાતુઓ વીજળીની સારી સુવાહક છે.'
      },
      topic: 'properties'
    },
    {
      id: 'ci_4',
      type: 'trueFalse',
      difficulty: 'easy',
      question: {
        english: 'Plastic is a good conductor of electricity.',
        hindi: 'प्लास्टिक विद्युत का अच्छा सुचालक है।',
        gujarati: 'પ્લાસ્ટિક વીજળીનું સારું સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 1,
      explanation: {
        english: 'False! Plastic is an insulator and does not allow electricity to pass through it. That\'s why wires are covered with plastic.',
        hindi: 'गलत! प्लास्टिक एक कुचालक है और विद्युत को अपने माध्यम से नहीं जाने देता। इसीलिए तारों को प्लास्टिक से ढका जाता है।',
        gujarati: 'ખોટું! પ્લાસ્ટિક કુવાહક છે અને વીજળીને તેમાંથી પસાર થવા દેતું નથી. તેથી જ તારોને પ્લાસ્ટિકથી ઢાંકવામાં આવે છે.'
      },
      topic: 'properties'
    },

    // Wire and Safety - Medium
    {
      id: 'ci_5',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'Why are electric wires made of copper or aluminum?',
        hindi: 'विद्युत तार तांबे या एल्युमिनियम से क्यों बनाए जाते हैं?',
        gujarati: 'વીજળીના તાર તાંબા અથવા એલ્યુમિનિયમમાંથી કેમ બનાવવામાં આવે છે?'
      },
      options: {
        english: [
          'Because they are cheap',
          'Because they are good conductors',
          'Because they are colorful',
          'Because they are light'
        ],
        hindi: [
          'क्योंकि वे सस्ते हैं',
          'क्योंकि वे अच्छे सुचालक हैं',
          'क्योंकि वे रंगीन हैं',
          'क्योंकि वे हल्के हैं'
        ],
        gujarati: [
          'કારણ કે તેઓ સસ્તા છે',
          'કારણ કે તેઓ સારા સુવાહક છે',
          'કારણ કે તેઓ રંગીન છે',
          'કારણ કે તેઓ હલકા છે'
        ]
      },
      correctAnswer: 1,
      explanation: {
        english: 'Copper and aluminum are good conductors of electricity, so they allow electric current to flow easily through them.',
        hindi: 'तांबा और एल्युमिनियम विद्युत के अच्छे सुचालक हैं, इसलिए वे विद्युत धारा को आसानी से प्रवाहित होने देते हैं।',
        gujarati: 'તાંબુ અને એલ્યુમિનિયમ વીજળીના સારા સુવાહક છે, તેથી તેઓ વિદ્યુત પ્રવાહને સરળતાથી વહેવા દે છે.'
      },
      topic: 'wires'
    },
    {
      id: 'ci_6',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'Why are electric wires covered with plastic or rubber?',
        hindi: 'विद्युत तारों को प्लास्टिक या रबर से क्यों ढका जाता है?',
        gujarati: 'વીજળીના તારોને પ્લાસ્ટિક અથવા રબરથી કેમ ઢાંકવામાં આવે છે?'
      },
      options: {
        english: [
          'To make them look colorful',
          'To protect us from electric shock',
          'To make them stronger',
          'To make them waterproof'
        ],
        hindi: [
          'उन्हें रंगीन दिखाने के लिए',
          'हमें बिजली के झटके से बचाने के लिए',
          'उन्हें मजबूत बनाने के लिए',
          'उन्हें जलरोधी बनाने के लिए'
        ],
        gujarati: [
          'તેમને રંગીન બનાવવા માટે',
          'આપણને વીજળીના આંચકાથી બચાવવા માટે',
          'તેમને વધુ મજબૂત બનાવવા માટે',
          'તેમને પાણીરોધક બનાવવા માટે'
        ]
      },
      correctAnswer: 1,
      explanation: {
        english: 'Plastic and rubber are insulators. They prevent electricity from flowing out of the wires and protect us from electric shocks.',
        hindi: 'प्लास्टिक और रबर कुचालक हैं। वे विद्युत को तारों से बाहर बहने से रोकते हैं और हमें बिजली के झटके से बचाते हैं।',
        gujarati: 'પ્લાસ્ટિક અને રબર કુવાહક છે. તેઓ વીજળીને તારમાંથી બહાર વહેતી અટકાવે છે અને આપણને વીજળીના આંચકાથી બચાવે છે.'
      },
      topic: 'wires'
    },
    {
      id: 'ci_7',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'What will happen if we use wooden sticks instead of metal wires in a circuit?',
        hindi: 'यदि हम सर्किट में धातु के तारों के बजाय लकड़ी की छड़ियों का उपयोग करें तो क्या होगा?',
        gujarati: 'જો આપણે સર્કિટમાં ધાતુના તારોને બદલે લાકડાની લાકડીઓનો ઉપયોગ કરીએ તો શું થશે?'
      },
      options: {
        english: [
          'The lamp will glow brighter',
          'The lamp will not glow',
          'The circuit will work better',
          'Nothing will change'
        ],
        hindi: [
          'लैंप अधिक चमकेगा',
          'लैंप नहीं चमकेगा',
          'सर्किट बेहतर काम करेगा',
          'कुछ नहीं बदलेगा'
        ],
        gujarati: [
          'દીવો વધુ તેજસ્વી થશે',
          'દીવો પ્રકાશશે નહીં',
          'સર્કિટ વધુ સારી રીતે કામ કરશે',
          'કંઈ બદલાશે નહીં'
        ]
      },
      correctAnswer: 1,
      explanation: {
        english: 'Wood is an insulator, so it does not allow electricity to pass through. The circuit will not be complete and the lamp will not glow.',
        hindi: 'लकड़ी एक कुचालक है, इसलिए यह विद्युत को अपने माध्यम से नहीं जाने देती। सर्किट पूर्ण नहीं होगा और लैंप नहीं चमकेगा।',
        gujarati: 'લાકડું કુવાહક છે, તેથી તે વીજળીને તેમાંથી પસાર થવા દેતું નથી. સર્કિટ પૂર્ણ થશે નહીં અને દીવો પ્રકાશશે નહીં.'
      },
      topic: 'wires'
    },
    {
      id: 'ci_8',
      type: 'trueFalse',
      difficulty: 'medium',
      question: {
        english: 'Silver is the best conductor of electricity among all metals.',
        hindi: 'चांदी सभी धातुओं में विद्युत का सबसे अच्छा सुचालक है।',
        gujarati: 'ચાંદી બધી ધાતુઓમાં વીજળીનું શ્રેષ્ઠ સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 0,
      explanation: {
        english: 'True! Silver is the best conductor, followed by copper and gold. However, copper is most commonly used because silver is expensive.',
        hindi: 'सही! चांदी सबसे अच्छा सुचालक है, उसके बाद तांबा और सोना। हालांकि, तांबे का सबसे अधिक उपयोग किया जाता है क्योंकि चांदी महंगी है।',
        gujarati: 'સાચું! ચાંદી શ્રેષ્ઠ સુવાહક છે, ત્યારબાદ તાંબુ અને સોનું. જો કે, તાંબુનો સૌથી વધુ ઉપયોગ થાય છે કારણ કે ચાંદી મોંઘી છે.'
      },
      topic: 'properties'
    },

    // Tester and Testing - Medium
    {
      id: 'ci_9',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'In a conduction tester, what does it mean if the lamp glows when we touch an object?',
        hindi: 'चालन परीक्षक में, यदि हम किसी वस्तु को छूने पर लैंप चमकता है तो इसका क्या मतलब है?',
        gujarati: 'વહન પરીક્ષકમાં, જો આપણે કોઈ વસ્તુને સ્પર્શ કરીએ અને દીવો પ્રકાશે તો તેનો અર્થ શું છે?'
      },
      options: {
        english: [
          'The object is an insulator',
          'The object is a conductor',
          'The tester is broken',
          'The battery is dead'
        ],
        hindi: [
          'वस्तु एक कुचालक है',
          'वस्तु एक सुचालक है',
          'परीक्षक टूट गया है',
          'बैटरी खत्म हो गई है'
        ],
        gujarati: [
          'વસ્તુ કુવાહક છે',
          'વસ્તુ સુવાહક છે',
          'પરીક્ષક તૂટી ગયું છે',
          'બેટરી ખતમ થઈ ગઈ છે'
        ]
      },
      correctAnswer: 1,
      explanation: {
        english: 'If the lamp glows, it means electricity can flow through the object, so it is a conductor.',
        hindi: 'यदि लैंप चमकता है, तो इसका मतलब है कि वस्तु के माध्यम से विद्युत प्रवाहित हो सकती है, इसलिए यह एक सुचालक है।',
        gujarati: 'જો દીવો પ્રકાશે છે, તો તેનો અર્થ એ કે વીજળી વસ્તુમાંથી પસાર થઈ શકે છે, તેથી તે સુવાહક છે.'
      },
      topic: 'testing'
    },
    {
      id: 'ci_10',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'What are the main components needed to make a conduction tester?',
        hindi: 'चालन परीक्षक बनाने के लिए मुख्य घटक क्या आवश्यक हैं?',
        gujarati: 'વહન પરીક્ષક બનાવવા માટે મુખ્ય ઘટકો શું જરૂરી છે?'
      },
      options: {
        english: [
          'Cell, lamp, and wires',
          'Only a battery',
          'Switch and bulb only',
          'Magnet and compass'
        ],
        hindi: [
          'सेल, लैंप और तार',
          'केवल बैटरी',
          'केवल स्विच और बल्ब',
          'चुंबक और कम्पास'
        ],
        gujarati: [
          'સેલ, દીવો અને તારો',
          'ફક્ત બેટરી',
          'ફક્ત સ્વીચ અને બલ્બ',
          'ચુંબક અને હોકાયંત્ર'
        ]
      },
      correctAnswer: 0,
      explanation: {
        english: 'A conduction tester needs a cell (battery) for power, a lamp to show when current flows, and wires to connect everything with free ends for testing.',
        hindi: 'चालन परीक्षक को बिजली के लिए एक सेल (बैटरी), धारा प्रवाहित होने पर दिखाने के लिए एक लैंप, और सब कुछ जोड़ने के लिए तारों की आवश्यकता होती है जिनके मुक्त सिरे परीक्षण के लिए हों।',
        gujarati: 'વહન પરીક્ષકને પાવર માટે સેલ (બેટરી), પ્રવાહ વહે ત્યારે બતાવવા માટે દીવો, અને બધું જોડવા માટે તારોની જરૂર છે જેના મુક્ત છેડાઓ પરીક્ષણ માટે હોય.'
      },
      topic: 'testing'
    },

    // Safety Questions - Medium/Hard
    {
      id: 'ci_11',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'Why should we never touch electrical appliances with wet hands?',
        hindi: 'हमें गीले हाथों से विद्युत उपकरणों को कभी क्यों नहीं छूना चाहिए?',
        gujarati: 'આપણે ભીના હાથથી વિદ્યુત ઉપકરણોને કેમ નહીં સ્પર્શ કરવું જોઈએ?'
      },
      options: {
        english: [
          'Water makes appliances dirty',
          'Water is a conductor and increases risk of electric shock',
          'It damages the appliance',
          'It wastes electricity'
        ],
        hindi: [
          'पानी उपकरणों को गंदा करता है',
          'पानी एक सुचालक है और बिजली के झटके का खतरा बढ़ाता है',
          'यह उपकरण को नुकसान पहुंचाता है',
          'यह बिजली बर्बाद करता है'
        ],
        gujarati: [
          'પાણી ઉપકરણોને ગંદા બનાવે છે',
          'પાણી સુવાહક છે અને વીજળીના આંચકાનું જોખમ વધારે છે',
          'તે ઉપકરણને નુકસાન પહોંચાડે છે',
          'તે વીજળી બગાડે છે'
        ]
      },
      correctAnswer: 1,
      explanation: {
        english: 'Water (especially with dissolved salts) is a conductor of electricity. Wet hands increase the risk of electric current passing through our body, causing shock.',
        hindi: 'पानी (विशेषकर घुले हुए लवण के साथ) विद्युत का सुचालक है। गीले हाथ हमारे शरीर के माध्यम से विद्युत धारा प्रवाहित होने का खतरा बढ़ाते हैं, जिससे झटका लग सकता है।',
        gujarati: 'પાણી (ખાસ કરીને ઓગળેલા ક્ષાર સાથે) વીજળીનું સુવાહક છે. ભીના હાથ આપણા શરીરમાંથી વિદ્યુત પ્રવાહ પસાર થવાનું જોખમ વધારે છે, જે આંચકો આપી શકે છે.'
      },
      topic: 'safety'
    },
    {
      id: 'ci_12',
      type: 'trueFalse',
      difficulty: 'hard',
      question: {
        english: 'Human body is a conductor of electricity.',
        hindi: 'मानव शरीर विद्युत का सुचालक है।',
        gujarati: 'માનવ શરીર વીજળીનું સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 0,
      explanation: {
        english: 'True! Human body contains water and salts that make it a conductor of electricity. This is why electric shock can be dangerous or even fatal.',
        hindi: 'सही! मानव शरीर में पानी और लवण होते हैं जो इसे विद्युत का सुचालक बनाते हैं। यही कारण है कि बिजली का झटका खतरनाक या घातक भी हो सकता है।',
        gujarati: 'સાચું! માનવ શરીરમાં પાણી અને ક્ષાર છે જે તેને વીજળીનું સુવાહક બનાવે છે. આ કારણે જ વીજળીનો આંચકો ખતરનાક અથવા જીવલેણ પણ હોઈ શકે છે.'
      },
      topic: 'safety'
    },
    {
      id: 'ci_13',
      type: 'mcq',
      difficulty: 'hard',
      question: {
        english: 'What should you do if you see a wire with damaged insulation?',
        hindi: 'यदि आप क्षतिग्रस्त इन्सुलेशन वाले तार को देखें तो आपको क्या करना चाहिए?',
        gujarati: 'જો તમે ક્ષતિગ્રસ્ત ઇન્સ્યુલેશન સાથેના તારને જુઓ તો તમારે શું કરવું જોઈએ?'
      },
      options: {
        english: [
          'Touch it to check if it works',
          'Leave it as it is',
          'Inform an adult and do not touch it',
          'Try to repair it yourself'
        ],
        hindi: [
          'इसे छूकर देखें कि यह काम करता है या नहीं',
          'इसे जैसा है वैसा ही छोड़ दें',
          'किसी वयस्क को सूचित करें और इसे न छुएं',
          'इसे स्वयं ठीक करने का प्रयास करें'
        ],
        gujarati: [
          'તે કામ કરે છે કે નહીં તે તપાસવા માટે તેને સ્પર્શ કરો',
          'તેને જેમ છે તેમ છોડી દો',
          'કોઈ પુખ્ત વયના વ્યક્તિને જાણ કરો અને તેને સ્પર્શ ન કરો',
          'તેને જાતે સરખું કરવાનો પ્રયાસ કરો'
        ]
      },
      correctAnswer: 2,
      explanation: {
        english: 'Damaged insulation exposes the conducting wire, which can cause electric shock. Always inform an adult and never touch or try to repair it yourself.',
        hindi: 'क्षतिग्रस्त इन्सुलेशन सुचालक तार को उजागर कर देता है, जिससे बिजली का झटका लग सकता है। हमेशा किसी वयस्क को सूचित करें और इसे कभी भी खुद न छुएं या ठीक करने का प्रयास न करें।',
        gujarati: 'ક્ષતિગ્રસ્ત ઇન્સ્યુલેશન સુવાહક તારને ખુલ્લો પાડે છે, જે વીજળીનો આંચકો આપી શકે છે. હંમેશા પુખ્ત વયના વ્યક્તિને જાણ કરો અને ક્યારેય જાતે સ્પર્શ કરો નહીં અથવા સારું કરવાનો પ્રયાસ કરો નહીં.'
      },
      topic: 'safety'
    },

    // Application Questions - Medium/Hard
    {
      id: 'ci_14',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'Why are the handles of electric tools made of plastic or rubber?',
        hindi: 'विद्युत उपकरणों के हैंडल प्लास्टिक या रबर से क्यों बनाए जाते हैं?',
        gujarati: 'વીજળીના સાધનોના હેન્ડલ પ્લાસ્ટિક અથવા રબરથી કેમ બનાવવામાં આવે છે?'
      },
      options: {
        english: [
          'To make them comfortable to hold',
          'To protect from electric shock',
          'To make them look nice',
          'To make them cheaper'
        ],
        hindi: [
          'उन्हें पकड़ने में आरामदायक बनाने के लिए',
          'बिजली के झटके से बचाने के लिए',
          'उन्हें अच्छा दिखाने के लिए',
          'उन्हें सस्ता बनाने के लिए'
        ],
        gujarati: [
          'તેમને પકડવામાં આરામદાયક બનાવવા માટે',
          'વીજળીના આંચકાથી બચાવવા માટે',
          'તેમને સુંદર બનાવવા માટે',
          'તેમને સસ્તા બનાવવા માટે'
        ]
      },
      correctAnswer: 1,
      explanation: {
        english: 'Plastic and rubber are insulators. Handles made of these materials prevent electricity from reaching our hands and protect us from shocks.',
        hindi: 'प्लास्टिक और रबर कुचालक हैं। इन सामग्रियों से बने हैंडल विद्युत को हमारे हाथों तक पहुंचने से रोकते हैं और हमें झटके से बचाते हैं।',
        gujarati: 'પ્લાસ્ટિક અને રબર કુવાહક છે. આ સામગ્રીઓથી બનેલા હેન્ડલ વીજળીને આપણા હાથ સુધી પહોંચતી અટકાવે છે અને આપણને આંચકાથી બચાવે છે.'
      },
      topic: 'applications'
    },
    {
      id: 'ci_15',
      type: 'mcq',
      difficulty: 'hard',
      question: {
        english: 'A bird sitting on a single electric wire does not get shocked. Why?',
        hindi: 'एकल बिजली के तार पर बैठा पक्षी झटका नहीं खाता। क्यों?',
        gujarati: 'એક વીજળીના તાર પર બેઠેલા પક્ષીને આંચકો લાગતો નથી. શા માટે?'
      },
      options: {
        english: [
          'Birds are insulators',
          'Birds have thick feathers',
          'Current needs a complete path to flow',
          'The wire has low voltage'
        ],
        hindi: [
          'पक्षी कुचालक होते हैं',
          'पक्षियों के मोटे पंख होते हैं',
          'धारा को प्रवाहित होने के लिए पूर्ण पथ की आवश्यकता होती है',
          'तार में कम वोल्टेज होता है'
        ],
        gujarati: [
          'પક્ષીઓ કુવાહક છે',
          'પક્ષીઓને જાડા પીંછાં હોય છે',
          'પ્રવાહને વહેવા માટે સંપૂર્ણ માર્ગની જરૂર છે',
          'તારમાં ઓછું વોલ્ટેજ છે'
        ]
      },
      correctAnswer: 2,
      explanation: {
        english: 'Electric current needs a complete circuit to flow. The bird touches only one wire, so current has no complete path to flow through its body.',
        hindi: 'विद्युत धारा को प्रवाहित होने के लिए पूर्ण सर्किट की आवश्यकता होती है। पक्षी केवल एक तार को छूता है, इसलिए धारा के पास उसके शरीर से प्रवाहित होने के लिए कोई पूर्ण पथ नहीं है।',
        gujarati: 'વિદ્યુત પ્રવાહને વહેવા માટે સંપૂર્ણ સર્કિટની જરૂર છે. પક્ષી ફક્ત એક તારને સ્પર્શે છે, તેથી પ્રવાહને તેના શરીરમાંથી વહેવા માટે કોઈ સંપૂર્ણ માર્ગ નથી.'
      },
      topic: 'applications'
    },

    // Scenario-based Questions - Hard
    {
      id: 'ci_16',
      type: 'mcq',
      difficulty: 'hard',
      question: {
        english: 'You want to test if a coin is a conductor. Your tester\'s lamp doesn\'t glow when you touch the coin. What could be the problem?',
        hindi: 'आप यह परीक्षण करना चाहते हैं कि सिक्का सुचालक है या नहीं। जब आप सिक्के को छूते हैं तो आपके परीक्षक का लैंप नहीं चमकता। समस्या क्या हो सकती है?',
        gujarati: 'તમે પરીક્ષણ કરવા માંગો છો કે સિક્કો સુવાહક છે કે નહીં. જ્યારે તમે સિક્કાને સ્પર્શ કરો છો ત્યારે તમારા પરીક્ષકનો દીવો પ્રકાશતો નથી. સમસ્યા શું હોઈ શકે?'
      },
      options: {
        english: [
          'The coin is not a conductor',
          'The battery may be dead or wires may be loose',
          'Coins cannot conduct electricity',
          'The lamp is too bright'
        ],
        hindi: [
          'सिक्का सुचालक नहीं है',
          'बैटरी खत्म हो सकती है या तार ढीले हो सकते हैं',
          'सिक्के विद्युत का संचालन नहीं कर सकते',
          'लैंप बहुत चमकीला है'
        ],
        gujarati: [
          'સિક્કો સુવાહક નથી',
          'બેટરી ખતમ થઈ ગઈ હશે અથવા તારો ઢીલા હશે',
          'સિક્કા વીજળી વહન કરી શકતા નથી',
          'દીવો ખૂબ તેજસ્વી છે'
        ]
      },
      correctAnswer: 1,
      explanation: {
        english: 'Coins are made of metal and are conductors. If the lamp doesn\'t glow, check if the battery is working or if the connections are loose. Test by touching the free ends together first.',
        hindi: 'सिक्के धातु से बने होते हैं और सुचालक होते हैं। यदि लैंप नहीं चमकता है, तो जांचें कि बैटरी काम कर रही है या नहीं या कनेक्शन ढीले हैं या नहीं। पहले मुक्त सिरों को एक साथ छूकर परीक्षण करें।',
        gujarati: 'સિક્કા ધાતુથી બનેલા છે અને સુવાહક છે. જો દીવો પ્રકાશતો નથી, તો તપાસો કે બેટરી કામ કરી રહી છે કે નહીં અથવા જોડાણો ઢીલા છે કે નહીં. પહેલા મુક્ત છેડાઓને સાથે સ્પર્શ કરીને પરીક્ષણ કરો.'
      },
      topic: 'testing'
    },
    {
      id: 'ci_17',
      type: 'mcq',
      difficulty: 'hard',
      question: {
        english: 'Which material combination would be BEST for making a safe electrical plug?',
        hindi: 'सुरक्षित विद्युत प्लग बनाने के लिए कौन सा सामग्री संयोजन सर्वोत्तम होगा?',
        gujarati: 'સુરક્ષિત વિદ્યુત પ્લગ બનાવવા માટે કઈ સામગ્રી સંયોજન શ્રેષ્ઠ હશે?'
      },
      options: {
        english: [
          'Metal pins with plastic body',
          'All plastic',
          'All metal',
          'Wood pins with metal body'
        ],
        hindi: [
          'प्लास्टिक बॉडी के साथ धातु की पिन',
          'सभी प्लास्टिक',
          'सभी धातु',
          'धातु की बॉडी के साथ लकड़ी की पिन'
        ],
        gujarati: [
          'પ્લાસ્ટિક બોડી સાથે ધાતુની પિન',
          'બધું પ્લાસ્ટિક',
          'બધી ધાતુ',
          'ધાતુના શરીર સાથે લાકડાની પિન'
        ]
      },
      correctAnswer: 0,
      explanation: {
        english: 'Metal pins conduct electricity to make the connection, while the plastic body insulates and protects us from touching the conducting parts.',
        hindi: 'धातु की पिन कनेक्शन बनाने के लिए विद्युत का संचालन करती हैं, जबकि प्लास्टिक की बॉडी हमें सुचालक भागों को छूने से इन्सुलेट और सुरक्षित करती है।',
        gujarati: 'ધાતુની પિન જોડાણ બનાવવા માટે વીજળી વહન કરે છે, જ્યારે પ્લાસ્ટિક બોડી આપણને સુવાહક ભાગોને સ્પર્શ કરવાથી અલગ રાખે છે અને સુરક્ષિત કરે છે.'
      },
      topic: 'applications'
    },
    {
      id: 'ci_18',
      type: 'trueFalse',
      difficulty: 'hard',
      question: {
        english: 'Pure water (distilled water) is a poor conductor of electricity.',
        hindi: 'शुद्ध पानी (आसुत जल) विद्युत का कमजोर सुचालक है।',
        gujarati: 'શુદ્ધ પાણી (નિસ્યંદિત પાણી) વીજળીનું નબળું સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 0,
      explanation: {
        english: 'True! Pure water doesn\'t conduct electricity well. But water we use daily has dissolved salts and minerals that make it a good conductor.',
        hindi: 'सही! शुद्ध पानी विद्युत का अच्छा संचालन नहीं करता। लेकिन हम रोजाना जो पानी उपयोग करते हैं उसमें घुले हुए लवण और खनिज होते हैं जो इसे अच्छा सुचालक बनाते हैं।',
        gujarati: 'સાચું! શુદ્ધ પાણી વીજળીનું સારું વહન કરતું નથી. પરંતુ આપણે દરરોજ જે પાણીનો ઉપયોગ કરીએ છીએ તેમાં ઓગળેલા ક્ષાર અને ખનિજો હોય છે જે તેને સારું સુવાહક બનાવે છે.'
      },
      topic: 'properties'
    }
  ];

  // Topic definitions
  const topics = [
    {
      id: 'identification',
      name: t('practice.topics.identification.name'),
      description: t('practice.topics.identification.description'),
      icon: '🔍',
      color: 'blue',
      questionCount: questionBank.filter(q => q.topic === 'identification').length
    },
    {
      id: 'properties',
      name: t('practice.topics.properties.name'),
      description: t('practice.topics.properties.description'),
      icon: '⚡',
      color: 'green',
      questionCount: questionBank.filter(q => q.topic === 'properties').length
    },
    {
      id: 'wires',
      name: t('practice.topics.wires.name'),
      description: t('practice.topics.wires.description'),
      icon: '🔌',
      color: 'purple',
      questionCount: questionBank.filter(q => q.topic === 'wires').length
    },
    {
      id: 'testing',
      name: t('practice.topics.testing.name'),
      description: t('practice.topics.testing.description'),
      icon: '🧪',
      color: 'yellow',
      questionCount: questionBank.filter(q => q.topic === 'testing').length
    },
    {
      id: 'safety',
      name: t('practice.topics.safety.name'),
      description: t('practice.topics.safety.description'),
      icon: '⚠️',
      color: 'red',
      questionCount: questionBank.filter(q => q.topic === 'safety').length
    },
    {
      id: 'applications',
      name: t('practice.topics.applications.name'),
      description: t('practice.topics.applications.description'),
      icon: '💡',
      color: 'orange',
      questionCount: questionBank.filter(q => q.topic === 'applications').length
    }
  ];

  const startPractice = (topicId: string | null) => {
    let questions: Question[] = [];

    if (topicId === 'mixed') {
      // Mixed practice: 3 random questions from each topic
      topics.forEach(topic => {
        const topicQuestions = questionBank.filter(q => q.topic === topic.id);
        const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
        questions.push(...shuffled.slice(0, 3));
      });
    } else if (topicId) {
      // Topic-specific practice
      questions = questionBank.filter(q => q.topic === topicId);
    }

    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5);

    setSelectedTopic(topicId);
    setCurrentQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setCurrentView('practice');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isAnswered) {
      setIsAnswered(true);
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newUserAnswers);

      if (selectedAnswer === currentQuestions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
      setIsAnswered(true);
    }
  };

  const resetPractice = () => {
    startPractice(selectedTopic);
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const percentage = Math.round((score / currentQuestions.length) * 100);

  // Topic Selection Screen
  const renderTopicSelection = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          ⚡ {t('practice.practiceMode')}
        </h1>
      </div>

      {/* Mixed Practice Card */}
      <div
        onClick={() => startPractice('mixed')}
        className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all border-2 border-purple-600"
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
              🎯
            </div>
            <div>
              <h3 className="text-2xl font-bold">{t('practice.mixedPractice')}</h3>
              <p className="text-purple-100">{t('practice.allTopics')}</p>
              <p className="text-sm text-purple-200 mt-1">
                {topics.reduce((sum, topic) => sum + Math.min(3, topic.questionCount), 0)} {t('practice.questions')}
              </p>
            </div>
          </div>
          <ChevronRight className="w-8 h-8" />
        </div>
      </div>

      {/* Individual Topic Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => startPractice(topic.id)}
            className={`bg-gradient-to-br from-${topic.color}-50 to-${topic.color}-100 p-6 rounded-xl shadow-md cursor-pointer transform hover:scale-105 transition-all border-2 border-${topic.color}-300 hover:border-${topic.color}-500`}
          >
            <div className="text-center">
              <div className="text-5xl mb-3">{topic.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {topic.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {topic.description}
              </p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${topic.color}-200 text-${topic.color}-800 rounded-full text-sm font-semibold`}>
                <Target className="w-4 h-4" />
                {topic.questionCount} {t('practice.questions')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Practice Screen
  const renderPractice = () => {
    if (showResults) {
      return renderResults();
    }

    if (!currentQuestion) return null;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {t('practice.progress')}: {currentQuestionIndex + 1} / {currentQuestions.length}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {t('practice.yourScore')}: {score} / {currentQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
            <Brain className="w-4 h-4" />
            {currentQuestion.difficulty === 'easy' ? t('practice.easy') :
              currentQuestion.difficulty === 'medium' ? t('practice.medium') :
                t('practice.hard')}
          </span>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {currentQuestion.question[langKey]}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options?.[langKey].map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isAnswered
                ? index === currentQuestion.correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : index === selectedAnswer
                    ? 'bg-red-100 border-red-500 text-red-800'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                : selectedAnswer === index
                  ? 'bg-blue-100 border-blue-500 text-blue-800'
                  : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isAnswered
                  ? index === currentQuestion.correctAnswer
                    ? 'bg-green-500 text-white'
                    : index === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  : selectedAnswer === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 font-medium">{option}</span>
                {isAnswered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className={`p-6 rounded-xl mb-6 border-2 ${isCorrect
            ? 'bg-green-50 border-green-500'
            : 'bg-red-50 border-red-500'
            }`}>
            <div className="flex items-start gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div>
                <h4 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                  {isCorrect ? t('practice.correct') : t('practice.incorrect')}
                </h4>
                {!isCorrect && (
                  <p className="text-red-700 mb-2">
                    <strong>{t('practice.correctAnswer')}</strong> {currentQuestion.options?.[langKey][currentQuestion.correctAnswer]}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>{t('practice.explanation')}</strong> {currentQuestion.explanation[langKey]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('common.previous')}
            </button>
          )}

          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                }`}
            >
              {t('practice.submitAnswer')}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition flex items-center justify-center gap-2"
            >
              {currentQuestionIndex < currentQuestions.length - 1 ? t('practice.nextQuestion') : t('practice.finishPractice')}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Results Screen
  const renderResults = () => {
    const getPerformanceMessage = () => {
      if (percentage >= 80) {
        return {
          title: t('practice.excellentWork'),
          message: t('practice.outstandingWork'),
          icon: Trophy,
          color: 'yellow'
        };
      } else if (percentage >= 60) {
        return {
          title: t('practice.goodJob'),
          message: t('practice.goodWork'),
          icon: Star,
          color: 'blue'
        };
      } else {
        return {
          title: t('practice.keepPracticing'),
          message: t('practice.dontGiveUp'),
          icon: BookOpen,
          color: 'purple'
        };
      }
    };

    const performance = getPerformanceMessage();
    const PerformanceIcon = performance.icon;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-${performance.color}-100 mb-4`}>
            <PerformanceIcon className={`w-12 h-12 text-${performance.color}-600`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {performance.title}
          </h2>
          <p className="text-lg text-gray-600">
            {performance.message}
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl mb-8 border-2 border-blue-200">
          <div className="text-center">
            <p className="text-gray-600 mb-2">{t('practice.yourScore')}</p>
            <div className="text-6xl font-bold text-gray-800 mb-2">
              {score} / {currentQuestions.length}
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {percentage}%
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{score}</div>
            <div className="text-sm text-gray-600">
              {t('practice.correct')}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">{currentQuestions.length - score}</div>
            <div className="text-sm text-gray-600">
              {t('practice.incorrect')}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{currentQuestions.length}</div>
            <div className="text-sm text-gray-600">
              {t('practice.total')}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentView('topics')}
            className="flex-1 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            {t('practice.backToTopics')}
          </button>
          <button
            onClick={resetPractice}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {t('practice.tryAgain')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {currentView === 'topics' && renderTopicSelection()}
        {currentView === 'practice' && renderPractice()}
      </div>
    </div>
  );
};

export default ConductorsInsulatorsPractice;