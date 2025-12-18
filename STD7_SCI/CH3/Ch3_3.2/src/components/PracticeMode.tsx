import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Award, BookOpen,
  RotateCcw,
  Target, Brain, Trophy, Star, Home, ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/interfaces/circuitTypes';

// Types
type QuestionType = 'mcq' | 'trueFalse';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface ElectricityPracticeModeProps {
  language?: Language;
}

type OldLanguage = 'english' | 'hindi' | 'gujarati';

interface Question {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  topic: string;
  question: Record<OldLanguage, string>;
  options: Record<OldLanguage, string[]>;
  correctAnswer: number;
  explanation: Record<OldLanguage, string>;
}

interface Topic {
  id: string;
  name: Record<OldLanguage, string>;
  icon: string;
  color: string;
  questionCount: number;
}

// Helper function to map Language type to old format used in questions
const mapLanguage = (lang: Language): OldLanguage => {
  if (lang === 'en') return 'english';
  if (lang === 'hi') return 'hindi';
  return 'gujarati';
};

// Topics data
const topics: Topic[] = [
  {
    id: 'cell',
    name: {
      english: 'Electric Cell',
      hindi: 'विद्युत सेल',
      gujarati: 'ઇલેક્ટ્રિક સેલ'
    },
    icon: '⚡',
    color: 'from-red-400 to-orange-400',
    questionCount: 8
  },
  {
    id: 'battery',
    name: {
      english: 'Battery',
      hindi: 'बैटरी',
      gujarati: 'બેટરી'
    },
    icon: '🔋',
    color: 'from-blue-400 to-purple-400',
    questionCount: 8
  },
  {
    id: 'lamps',
    name: {
      english: 'Electric Lamps',
      hindi: 'विद्युत लैंप',
      gujarati: 'ઇલેક્ટ્રિક લેમ્પ'
    },
    icon: '💡',
    color: 'from-yellow-400 to-orange-400',
    questionCount: 8
  },
  {
    id: 'circuit',
    name: {
      english: 'Electric Circuit',
      hindi: 'विद्युत परिपथ',
      gujarati: 'ઇલેક્ટ્રિક સર્કિટ'
    },
    icon: '🔌',
    color: 'from-green-400 to-blue-400',
    questionCount: 8
  },
  {
    id: 'switch',
    name: {
      english: 'Switch',
      hindi: 'स्विच',
      gujarati: 'સ્વીચ'
    },
    icon: '🔘',
    color: 'from-purple-400 to-pink-400',
    questionCount: 8
  },
  {
    id: 'conductors',
    name: {
      english: 'Conductors & Insulators',
      hindi: 'चालक और अवरोधक',
      gujarati: 'વાહક અને અવાહક'
    },
    icon: '🔬',
    color: 'from-teal-400 to-green-400',
    questionCount: 10
  }
];

// Questions Bank
const questionsBank: Question[] = [
  // Electric Cell Questions
  {
    id: 'cell_1',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'cell',
    question: {
      english: 'What are the two terminals of an electric cell called?',
      hindi: 'विद्युत सेल के दो टर्मिनल क्या कहलाते हैं?',
      gujarati: 'ઇલેક્ટ્રિક સેલના બે ટર્મિનલને શું કહેવામાં આવે છે?'
    },
    options: {
      english: ['Hot and Cold', 'Positive and Negative', 'Top and Bottom', 'Left and Right'],
      hindi: ['गर्म और ठंडा', 'धनात्मक और ऋणात्मक', 'ऊपर और नीचे', 'बाएं और दाएं'],
      gujarati: ['ગરમ અને ઠંડુ', 'પોઝિટિવ અને નેગેટિવ', 'ઉપર અને નીચે', 'ડાબે અને જમણે']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Electric cells have two terminals: Positive (+) and Negative (−). The positive terminal has a metal cap and the negative terminal has a flat metal disc.',
      hindi: 'विद्युत सेल में दो टर्मिनल होते हैं: धनात्मक (+) और ऋणात्मक (−)। धनात्मक टर्मिनल में धातु की टोपी होती है और ऋणात्मक टर्मिनल में सपाट धातु की डिस्क होती है।',
      gujarati: 'ઇલેક્ટ્રિક સેલમાં બે ટર્મિનલ છે: પોઝિટિવ (+) અને નેગેટિવ (−). પોઝિટિવ ટર્મિનલમાં મેટલ કેપ હોય છે અને નેગેટિવ ટર્મિનલમાં સપાટ મેટલ ડિસ્ક હોય છે.'
    }
  },
  {
    id: 'cell_2',
    type: 'trueFalse',
    difficulty: 'easy',
    topic: 'cell',
    question: {
      english: 'An electric cell is a portable source of electrical energy.',
      hindi: 'विद्युत सेल विद्युत ऊर्जा का एक पोर्टेबल स्रोत है।',
      gujarati: 'ઇલેક્ટ્રિક સેલ વિદ્યુત ઊર્જાનો પોર્ટેબલ સ્રોત છે.'
    },
    options: {
      english: ['True', 'False'],
      hindi: ['सही', 'गलत'],
      gujarati: ['સાચું', 'ખોટું']
    },
    correctAnswer: 0,
    explanation: {
      english: 'True! An electric cell is indeed a portable source of electrical energy. We can carry it anywhere and use it to power small devices.',
      hindi: 'सही! विद्युत सेल वास्तव में विद्युत ऊर्जा का एक पोर्टेबल स्रोत है। हम इसे कहीं भी ले जा सकते हैं और छोटे उपकरणों को चलाने के लिए इसका उपयोग कर सकते हैं।',
      gujarati: 'સાચું! ઇલેક્ટ્રિક સેલ ખરેખર વિદ્યુત ઊર્જાનો પોર્ટેબલ સ્રોત છે. આપણે તેને ગમે ત્યાં લઈ જઈ શકીએ અને નાના ઉપકરણો ચલાવવા માટે તેનો ઉપયોગ કરી શકીએ.'
    }
  },
  {
    id: 'cell_3',
    type: 'mcq',
    difficulty: 'medium',
    topic: 'cell',
    question: {
      english: 'Which part of the electric cell is the positive terminal?',
      hindi: 'विद्युत सेल का कौन सा हिस्सा धनात्मक टर्मिनल है?',
      gujarati: 'ઇલેક્ટ્રિક સેલનો કયો ભાગ પોઝિટિવ ટર્મિનલ છે?'
    },
    options: {
      english: ['The flat metal disc', 'The metal cap (protruding part)', 'The plastic cover', 'The wire inside'],
      hindi: ['सपाट धातु की डिस्क', 'धातु की टोपी (उभरा हुआ भाग)', 'प्लास्टिक कवर', 'अंदर का तार'],
      gujarati: ['સપાટ મેટલ ડિસ્ક', 'મેટલ કેપ (બહાર નીકળેલો ભાગ)', 'પ્લાસ્ટિક કવર', 'અંદરનો તાર']
    },
    correctAnswer: 1,
    explanation: {
      english: 'The metal cap (small protruding part) on one side of the cell is the positive terminal, while the flat metal disc on the other side is the negative terminal.',
      hindi: 'सेल के एक तरफ धातु की टोपी (छोटा उभरा हुआ हिस्सा) धनात्मक टर्मिनल है, जबकि दूसरी तरफ सपाट धातु की डिस्क ऋणात्मक टर्मिनल है।',
      gujarati: 'સેલની એક બાજુએ મેટલ કેપ (નાનો બહાર નીકળેલો ભાગ) પોઝિટિવ ટર્મિનલ છે, જ્યારે બીજી બાજુએ સપાટ મેટલ ડિસ્ક નેગેટિવ ટર્મિનલ છે.'
    }
  },
  {
    id: 'cell_4',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'cell',
    question: {
      english: 'Which of these devices uses an electric cell?',
      hindi: 'इनमें से कौन सा उपकरण विद्युत सेल का उपयोग करता है?',
      gujarati: 'આમાંથી કયું ઉપકરણ ઇલેક્ટ્રિક સેલનો ઉપયોગ કરે છે?'
    },
    options: {
      english: ['Electric iron', 'Wall clock', 'Refrigerator', 'Air conditioner'],
      hindi: ['इलेक्ट्रिक आयरन', 'दीवार घड़ी', 'रेफ्रिजरेटर', 'एयर कंडीशनर'],
      gujarati: ['ઇલેક્ટ્રિક આયર્ન', 'દિવાલ ઘડિયાળ', 'રેફ્રિજરેટર', 'એર કન્ડિશનર']
    },
    correctAnswer: 1,
    explanation: {
      english: 'A wall clock uses electric cells (batteries) to work. Electric iron, refrigerator, and air conditioner require high power and use electricity from wall sockets.',
      hindi: 'दीवार घड़ी काम करने के लिए विद्युत सेल (बैटरी) का उपयोग करती है। इलेक्ट्रिक आयरन, रेफ्रिजरेटर और एयर कंडीशनर को उच्च शक्ति की आवश्यकता होती है।',
      gujarati: 'દિવાલ ઘડિયાળ કામ કરવા માટે ઇલેક્ટ્રિક સેલ (બેટરી)નો ઉપયોગ કરે છે. ઇલેક્ટ્રિક આયર્ન, રેફ્રિજરેટર અને એર કન્ડિશનરને ઊંચી શક્તિની જરૂર છે.'
    }
  },

  // Battery Questions
  {
    id: 'battery_1',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'battery',
    question: {
      english: 'What is a battery?',
      hindi: 'बैटरी क्या है?',
      gujarati: 'બેટરી શું છે?'
    },
    options: {
      english: ['A single electric cell', 'A combination of two or more cells', 'A type of wire', 'A type of switch'],
      hindi: ['एक एकल विद्युत सेल', 'दो या दो से अधिक सेल का संयोजन', 'एक प्रकार का तार', 'एक प्रकार का स्विच'],
      gujarati: ['એક એકલ ઇલેક્ટ્રિક સેલ', 'બે અથવા વધુ સેલનું સંયોજન', 'એક પ્રકારનો તાર', 'એક પ્રકારનો સ્વીચ']
    },
    correctAnswer: 1,
    explanation: {
      english: 'A battery is a combination of two or more electric cells connected together in series (positive to negative).',
      hindi: 'बैटरी दो या दो से अधिक विद्युत सेल का एक संयोजन है जो श्रृंखला में (धनात्मक से ऋणात्मक) जुड़े होते हैं।',
      gujarati: 'બેટરી એ બે અથવા વધુ ઇલેક્ટ્રિક સેલનું સંયોજન છે જે શ્રેણીમાં (પોઝિટિવથી નેગેટિવ) જોડાયેલા હોય છે.'
    }
  },
  {
    id: 'battery_2',
    type: 'mcq',
    difficulty: 'medium',
    topic: 'battery',
    question: {
      english: 'How should cells be connected to make a battery?',
      hindi: 'बैटरी बनाने के लिए सेल को कैसे जोड़ा जाना चाहिए?',
      gujarati: 'બેટરી બનાવવા માટે સેલને કેવી રીતે જોડવા જોઈએ?'
    },
    options: {
      english: ['Positive to Positive', 'Negative to Negative', 'Positive to Negative', 'Any way is fine'],
      hindi: ['धनात्मक से धनात्मक', 'ऋणात्मक से ऋणात्मक', 'धनात्मक से ऋणात्मक', 'कोई भी तरीका ठीक है'],
      gujarati: ['પોઝિટિવથી પોઝિટિવ', 'નેગેટિવથી નેગેટિવ', 'પોઝિટિવથી નેગેટિવ', 'કોઈપણ રીત સારી છે']
    },
    correctAnswer: 2,
    explanation: {
      english: 'Cells must be connected Positive to Negative. The positive terminal (+) of one cell connects to the negative terminal (−) of the next cell.',
      hindi: 'सेल को धनात्मक से ऋणात्मक जोड़ना चाहिए। एक सेल का धनात्मक टर्मिनल (+) अगले सेल के ऋणात्मक टर्मिनल (−) से जुड़ता है।',
      gujarati: 'સેલને પોઝિટિવથી નેગેટિવ જોડવા જોઈએ. એક સેલનું પોઝિટિવ ટર્મિનલ (+) બીજા સેલના નેગેટિવ ટર્મિનલ (−) સાથે જોડાય છે.'
    }
  },
  {
    id: 'battery_3',
    type: 'trueFalse',
    difficulty: 'medium',
    topic: 'battery',
    question: {
      english: 'If cells are not placed in the correct order in a torch, the lamp will still glow.',
      hindi: 'यदि टॉर्च में सेल सही क्रम में नहीं रखे गए हैं, तो भी लैंप चमकेगा।',
      gujarati: 'જો ટોર્ચમાં સેલ યોગ્ય ક્રમમાં ન મૂકવામાં આવે તો પણ લેમ્પ પ્રકાશશે.'
    },
    options: {
      english: ['True', 'False'],
      hindi: ['सही', 'गलत'],
      gujarati: ['સાચું', 'ખોટું']
    },
    correctAnswer: 1,
    explanation: {
      english: 'False! If cells are not placed in the correct order (+ to − sequence), the lamp will NOT glow. The circuit will not be complete.',
      hindi: 'गलत! यदि सेल सही क्रम में नहीं रखे गए हैं (+ से − क्रम), तो लैंप नहीं चमकेगा। सर्किट पूर्ण नहीं होगा।',
      gujarati: 'ખોટું! જો સેલ યોગ્ય ક્રમમાં મૂકવામાં ન આવે (+ થી − ક્રમ), તો લેમ્પ પ્રકાશશે નહીં. સર્કિટ પૂર્ણ થશે નહીં.'
    }
  },
  {
    id: 'battery_4',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'battery',
    question: {
      english: 'Why do we use more than one cell in a torch?',
      hindi: 'हम टॉर्च में एक से अधिक सेल का उपयोग क्यों करते हैं?',
      gujarati: 'આપણે ટોર્ચમાં એકથી વધુ સેલનો ઉપયોગ કેમ કરીએ છીએ?'
    },
    options: {
      english: ['To make it heavier', 'To provide more energy and longer duration', 'To look bigger', 'Cells work only in pairs'],
      hindi: ['इसे भारी बनाने के लिए', 'अधिक ऊर्जा और लंबी अवधि के लिए', 'बड़ा दिखने के लिए', 'सेल केवल जोड़े में काम करते हैं'],
      gujarati: ['તેને ભારે બનાવવા માટે', 'વધુ ઊર્જા અને લાંબા સમય માટે', 'મોટું દેખાવા માટે', 'સેલ ફક્ત જોડીમાં કામ કરે છે']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Using more than one cell (making a battery) provides more energy to the device and makes it work for a longer time.',
      hindi: 'एक से अधिक सेल का उपयोग करना (बैटरी बनाना) उपकरण को अधिक ऊर्जा प्रदान करता है और इसे लंबे समय तक काम करता है।',
      gujarati: 'એકથી વધુ સેલનો ઉપયોગ કરવો (બેટરી બનાવવી) ઉપકરણને વધુ ઊર્જા પ્રદાન કરે છે અને તેને લાંબા સમય સુધી કામ કરે છે.'
    }
  },

  // Lamp Questions
  {
    id: 'lamp_1',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'lamps',
    question: {
      english: 'What is the thin wire inside an incandescent lamp called?',
      hindi: 'इनकैंडेसेंट लैंप के अंदर पतले तार को क्या कहा जाता है?',
      gujarati: 'ઇન્કેન્ડેસન્ટ લેમ્પની અંદર પાતળા તારને શું કહેવામાં આવે છે?'
    },
    options: {
      english: ['Wire', 'Filament', 'Thread', 'Coil'],
      hindi: ['तार', 'फिलामेंट', 'धागा', 'कुंडली'],
      gujarati: ['તાર', 'ફિલામેન્ટ', 'દોરો', 'કોઇલ']
    },
    correctAnswer: 1,
    explanation: {
      english: 'The thin wire inside an incandescent lamp is called a filament. When current passes through it, the filament gets hot and glows.',
      hindi: 'इनकैंडेसेंट लैंप के अंदर पतले तार को फिलामेंट कहा जाता है। जब इससे विद्युत धारा गुजरती है, तो फिलामेंट गर्म हो जाता है और चमकता है।',
      gujarati: 'ઇન્કેન્ડેસન્ટ લેમ્પની અંદરના પાતળા તારને ફિલામેન્ટ કહેવામાં આવે છે. જ્યારે તેમાંથી વિદ્યુત પસાર થાય ત્યારે ફિલામેન્ટ ગરમ થાય છે અને ચમકે છે.'
    }
  },
  {
    id: 'lamp_2',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'lamps',
    question: {
      english: 'What does LED stand for?',
      hindi: 'LED का पूरा नाम क्या है?',
      gujarati: 'LED નો સંપૂર્ણ નામ શું છે?'
    },
    options: {
      english: ['Light Electric Device', 'Light Emitting Diode', 'Long Energy Duration', 'Low Energy Device'],
      hindi: ['लाइट इलेक्ट्रिक डिवाइस', 'लाइट एमिटिंग डायोड', 'लॉन्ग एनर्जी ड्यूरेशन', 'लो एनर्जी डिवाइस'],
      gujarati: ['લાઇટ ઇલેક્ટ્રિક ડિવાઇસ', 'લાઇટ એમિટિંગ ડાયોડ', 'લોંગ એનર્જી ડ્યુરેશન', 'લો એનર્જી ડિવાઇસ']
    },
    correctAnswer: 1,
    explanation: {
      english: 'LED stands for Light Emitting Diode. It produces light without getting as hot as incandescent lamps.',
      hindi: 'LED का पूरा नाम लाइट एमिटिंग डायोड है। यह इनकैंडेसेंट लैंप की तरह गर्म हुए बिना प्रकाश उत्पन्न करता है।',
      gujarati: 'LED નો અર્થ લાઇટ એમિટિંગ ડાયોડ છે. તે ઇન્કેન્ડેસન્ટ લેમ્પની જેમ ગરમ થયા વિના પ્રકાશ ઉત્પન્ન કરે છે.'
    }
  },
  {
    id: 'lamp_3',
    type: 'trueFalse',
    difficulty: 'medium',
    topic: 'lamps',
    question: {
      english: 'An LED has a filament inside it just like an incandescent lamp.',
      hindi: 'एक LED के अंदर इनकैंडेसेंट लैंप की तरह फिलामेंट होता है।',
      gujarati: 'LED ની અંદર ઇન્કેન્ડેસન્ટ લેમ્પની જેમ ફિલામેન્ટ હોય છે.'
    },
    options: {
      english: ['True', 'False'],
      hindi: ['सही', 'गलत'],
      gujarati: ['સાચું', 'ખોટું']
    },
    correctAnswer: 1,
    explanation: {
      english: 'False! LEDs do not have filaments. They produce light using semiconductor technology.',
      hindi: 'गलत! LED में फिलामेंट नहीं होता है। वे सेमीकंडक्टर तकनीक का उपयोग करके प्रकाश उत्पन्न करते हैं।',
      gujarati: 'ખોટું! LED માં ફિલામેન્ટ હોતું નથી. તે સેમિકન્ડક્ટર ટેકનોલોજીનો ઉપયોગ કરીને પ્રકાશ ઉત્પન્ન કરે છે.'
    }
  },
  {
    id: 'lamp_4',
    type: 'mcq',
    difficulty: 'hard',
    topic: 'lamps',
    question: {
      english: 'How can you identify the positive terminal of an LED?',
      hindi: 'आप LED के धनात्मक टर्मिनल की पहचान कैसे कर सकते हैं?',
      gujarati: 'તમે LED ના પોઝિટિવ ટર્મિનલને કેવી રીતે ઓળખી શકો છો?'
    },
    options: {
      english: ['It has a red mark', 'It is the longer wire', 'It is the shorter wire', 'Both wires are same'],
      hindi: ['इसमें लाल निशान है', 'यह लंबा तार है', 'यह छोटा तार है', 'दोनों तार समान हैं'],
      gujarati: ['તેમાં લાલ નિશાન છે', 'તે લાંબો તાર છે', 'તે નાનો તાર છે', 'બંને તાર સમાન છે']
    },
    correctAnswer: 1,
    explanation: {
      english: 'The positive terminal of an LED is attached to the longer wire, and the negative terminal is attached to the shorter wire.',
      hindi: 'LED का धनात्मक टर्मिनल लंबे तार से जुड़ा होता है, और ऋणात्मक टर्मिनल छोटे तार से जुड़ा होता है।',
      gujarati: 'LED નું પોઝિટિવ ટર્મિનલ લાંબા તાર સાથે જોડાયેલું હોય છે, અને નેગેટિવ ટર્મિનલ નાના તાર સાથે જોડાયેલું હોય છે.'
    }
  },

  // Circuit Questions
  {
    id: 'circuit_1',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'circuit',
    question: {
      english: 'What is an electric circuit?',
      hindi: 'विद्युत परिपथ क्या है?',
      gujarati: 'ઇલેક્ટ્રિક સર્કિટ શું છે?'
    },
    options: {
      english: ['A type of battery', 'A complete path for electric current', 'A type of switch', 'A wire'],
      hindi: ['एक प्रकार की बैटरी', 'विद्युत धारा के लिए पूर्ण पथ', 'एक प्रकार का स्विच', 'एक तार'],
      gujarati: ['એક પ્રકારની બેટરી', 'વિદ્યુત પ્રવાહ માટે સંપૂર્ણ માર્ગ', 'એક પ્રકારનો સ્વીચ', 'એક તાર']
    },
    correctAnswer: 1,
    explanation: {
      english: 'An electric circuit is a complete path for electric current to flow from positive terminal through the device back to negative terminal.',
      hindi: 'विद्युत परिपथ विद्युत धारा के प्रवाह के लिए एक पूर्ण पथ है जो धनात्मक टर्मिनल से उपकरण के माध्यम से ऋणात्मक टर्मिनल तक जाता है।',
      gujarati: 'ઇલેક્ટ્રિક સર્કિટ એ વિદ્યુત પ્રવાહ માટે સંપૂર્ણ માર્ગ છે જે પોઝિટિવ ટર્મિનલથી ઉપકરણ દ્વારા નેગેટિવ ટર્મિનલ સુધી જાય છે.'
    }
  },
  {
    id: 'circuit_2',
    type: 'mcq',
    difficulty: 'medium',
    topic: 'circuit',
    question: {
      english: 'In which direction does electric current flow in a circuit?',
      hindi: 'परिपथ में विद्युत धारा किस दिशा में प्रवाहित होती है?',
      gujarati: 'સર્કિટમાં વિદ્યુત પ્રવાહ કઈ દિશામાં વહે છે?'
    },
    options: {
      english: ['From negative to positive', 'From positive to negative', 'In both directions', 'It does not flow'],
      hindi: ['ऋणात्मक से धनात्मक', 'धनात्मक से ऋणात्मक', 'दोनों दिशाओं में', 'यह प्रवाहित नहीं होती'],
      gujarati: ['નેગેટિવથી પોઝિટિવ', 'પોઝિટિવથી નેગેટિવ', 'બંને દિશાઓમાં', 'તે વહેતું નથી']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Electric current flows from the positive terminal to the negative terminal. This is the conventional direction of current flow.',
      hindi: 'विद्युत धारा धनात्मक टर्मिनल से ऋणात्मक टर्मिनल की ओर प्रवाहित होती है। यह विद्युत धारा के प्रवाह की पारंपरिक दिशा है।',
      gujarati: 'વિદ્યુત પ્રવાહ પોઝિટિવ ટર્મિનલથી નેગેટિવ ટર્મિનલ તરફ વહે છે. આ કરંટ પ્રવાહની પરંપરાગત દિશા છે.'
    }
  },
  {
    id: 'circuit_3',
    type: 'trueFalse',
    difficulty: 'easy',
    topic: 'circuit',
    question: {
      english: 'A lamp will glow only when the circuit is complete.',
      hindi: 'लैंप केवल तभी चमकेगा जब परिपथ पूर्ण होगा।',
      gujarati: 'લેમ્પ ફક્ત ત્યારે જ ચમકશે જ્યારે સર્કિટ પૂર્ણ હોય.'
    },
    options: {
      english: ['True', 'False'],
      hindi: ['सही', 'गलत'],
      gujarati: ['સાચું', 'ખોટું']
    },
    correctAnswer: 0,
    explanation: {
      english: 'True! A lamp will glow only when the circuit is complete, meaning there is a continuous path for current to flow.',
      hindi: 'सही! लैंप केवल तभी चमकेगा जब परिपथ पूर्ण होगा, जिसका अर्थ है कि विद्युत धारा के प्रवाह के लिए एक निरंतर पथ है।',
      gujarati: 'સાચું! લેમ્પ ફક્ત ત્યારે જ ચમકશે જ્યારે સર્કિટ પૂર્ણ હોય, એટલે કે કરંટ વહેવા માટે સતત માર્ગ હોય.'
    }
  },
  {
    id: 'circuit_4',
    type: 'mcq',
    difficulty: 'hard',
    topic: 'circuit',
    question: {
      english: 'What happens if there is a break or gap anywhere in the circuit?',
      hindi: 'यदि परिपथ में कहीं भी टूट या अंतराल हो तो क्या होता है?',
      gujarati: 'જો સર્કિટમાં ક્યાંય પણ તૂટક અથવા અંતર હોય તો શું થાય છે?'
    },
    options: {
      english: ['Current flows faster', 'Current cannot flow, lamp does not glow', 'Only half lamp glows', 'Battery gets damaged'],
      hindi: ['धारा तेजी से प्रवाहित होती है', 'धारा प्रवाहित नहीं हो सकती, लैंप नहीं चमकता', 'केवल आधा लैंप चमकता है', 'बैटरी क्षतिग्रस्त हो जाती है'],
      gujarati: ['કરંટ ઝડપથી વહે છે', 'કરંટ વહી શકતું નથી, લેમ્પ ચમકતું નથી', 'ફક્ત અડધું લેમ્પ ચમકે છે', 'બેટરી ક્ષતિગ્રસ્ત થાય છે']
    },
    correctAnswer: 1,
    explanation: {
      english: 'If there is any break or gap in the circuit, current cannot flow. The circuit is not complete, so the lamp will not glow.',
      hindi: 'यदि परिपथ में कोई टूट या अंतराल है, तो विद्युत धारा प्रवाहित नहीं हो सकती। परिपथ पूर्ण नहीं है, इसलिए लैंप नहीं चमकेगा।',
      gujarati: 'જો સર્કિટમાં કોઈ તૂટક અથવા અંતર હોય, તો કરંટ વહી શકતું નથી. સર્કિટ પૂર્ણ નથી, તેથી લેમ્પ ચમકશે નહીં.'
    }
  },

  // Switch Questions
  {
    id: 'switch_1',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'switch',
    question: {
      english: 'What is the function of a switch in an electric circuit?',
      hindi: 'विद्युत परिपथ में स्विच का कार्य क्या है?',
      gujarati: 'ઇલેક્ટ્રિક સર્કિટમાં સ્વીચનું કાર્ય શું છે?'
    },
    options: {
      english: ['To provide electricity', 'To complete or break the circuit', 'To increase voltage', 'To store energy'],
      hindi: ['बिजली प्रदान करना', 'परिपथ को पूर्ण या तोड़ना', 'वोल्टेज बढ़ाना', 'ऊर्जा संग्रहीत करना'],
      gujarati: ['વીજળી પ્રદાન કરવી', 'સર્કિટને પૂર્ણ અથવા તોડવું', 'વોલ્ટેજ વધારવું', 'ઊર્જા સંગ્રહ કરવી']
    },
    correctAnswer: 1,
    explanation: {
      english: 'A switch is used to complete or break an electric circuit. When ON, it completes the circuit. When OFF, it breaks the circuit.',
      hindi: 'स्विच का उपयोग विद्युत परिपथ को पूर्ण या तोड़ने के लिए किया जाता है। जब ON होता है, तो यह परिपथ को पूर्ण करता है। जब OFF होता है, तो यह परिपथ को तोड़ता है।',
      gujarati: 'સ્વીચનો ઉપયોગ ઇલેક્ટ્રિક સર્કિટને પૂર્ણ અથવા તોડવા માટે થાય છે. જ્યારે ON હોય ત્યારે તે સર્કિટ પૂર્ણ કરે છે. જ્યારે OFF હોય ત્યારે તે સર્કિટ તોડે છે.'
    }
  },
  {
    id: 'switch_2',
    type: 'trueFalse',
    difficulty: 'easy',
    topic: 'switch',
    question: {
      english: 'When a switch is in OFF position, there is a gap in the circuit.',
      hindi: 'जब स्विच OFF स्थिति में होता है, तो परिपथ में अंतराल होता है।',
      gujarati: 'જ્યારે સ્વીચ OFF સ્થિતિમાં હોય ત્યારે સર્કિટમાં અંતર હોય છે.'
    },
    options: {
      english: ['True', 'False'],
      hindi: ['सही', 'गलत'],
      gujarati: ['સાચું', 'ખોટું']
    },
    correctAnswer: 0,
    explanation: {
      english: 'True! When the switch is OFF, there is a gap (air gap) in the circuit, which prevents current from flowing.',
      hindi: 'सही! जब स्विच OFF होता है, तो परिपथ में एक अंतराल (वायु अंतराल) होता है, जो विद्युत धारा को प्रवाहित होने से रोकता है।',
      gujarati: 'સાચું! જ્યારે સ્વીચ OFF હોય ત્યારે સર્કિટમાં અંતર (હવાનું અંતર) હોય છે, જે કરંટને વહેતા અટકાવે છે.'
    }
  },
  {
    id: 'switch_3',
    type: 'mcq',
    difficulty: 'medium',
    topic: 'switch',
    question: {
      english: 'Can a switch be placed anywhere in a circuit?',
      hindi: 'क्या स्विच को परिपथ में कहीं भी रखा जा सकता है?',
      gujarati: 'શું સ્વીચને સર્કિટમાં ક્યાંય પણ મૂકી શકાય છે?'
    },
    options: {
      english: ['No, only near battery', 'No, only near lamp', 'Yes, anywhere', 'Only in the middle'],
      hindi: ['नहीं, केवल बैटरी के पास', 'नहीं, केवल लैंप के पास', 'हां, कहीं भी', 'केवल बीच में'],
      gujarati: ['ના, ફક્ત બેટરી પાસે', 'ના, ફક્ત લેમ્પ પાસે', 'હા, ક્યાંય પણ', 'ફક્ત મધ્યમાં']
    },
    correctAnswer: 2,
    explanation: {
      english: 'Yes! A switch can be placed anywhere in the circuit. It will work the same way regardless of its position.',
      hindi: 'हां! स्विच को परिपथ में कहीं भी रखा जा सकता है। यह अपनी स्थिति की परवाह किए बिना उसी तरह काम करेगा।',
      gujarati: 'હા! સ્વીચને સર્કિટમાં ક્યાંય પણ મૂકી શકાય છે. તે તેની સ્થિતિને ધ્યાનમાં લીધા વિના સમાન રીતે કામ કરશે.'
    }
  },
  {
    id: 'switch_4',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'switch',
    question: {
      english: 'What is an open circuit?',
      hindi: 'खुला परिपथ क्या है?',
      gujarati: 'ઓપન સર્કિટ શું છે?'
    },
    options: {
      english: ['Circuit with switch ON', 'Circuit with a gap where current cannot flow', 'Circuit without battery', 'Circuit with lamps'],
      hindi: ['स्विच ON के साथ परिपथ', 'अंतराल वाला परिपथ जहां धारा प्रवाहित नहीं हो सकती', 'बैटरी के बिना परिपथ', 'लैंप वाला परिपथ'],
      gujarati: ['સ્વીચ ON સાથેનું સર્કિટ', 'અંતરવાળું સર્કિટ જ્યાં કરંટ વહી શકતું નથી', 'બેટરી વિનાનું સર્કિટ', 'લેમ્પવાળું સર્કિટ']
    },
    correctAnswer: 1,
    explanation: {
      english: 'An open circuit is a circuit with a gap or break, where current cannot flow. This happens when switch is OFF.',
      hindi: 'खुला परिपथ एक ऐसा परिपथ है जिसमें अंतराल या टूट है, जहां विद्युत धारा प्रवाहित नहीं हो सकती। यह तब होता है जब स्विच OFF होता है।',
      gujarati: 'ઓપન સર્કિટ એ અંતર અથવા તૂટક સાથેનું સર્કિટ છે, જ્યાં કરંટ વહી શકતું નથી. આ ત્યારે થાય છે જ્યારે સ્વીચ OFF હોય.'
    }
  },

  // Conductors Questions
  {
    id: 'conductor_1',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'conductors',
    question: {
      english: 'What are conductors?',
      hindi: 'चालक क्या हैं?',
      gujarati: 'વાહક શું છે?'
    },
    options: {
      english: ['Materials that block electricity', 'Materials that allow electricity to flow easily', 'Materials that store electricity', 'Materials that create electricity'],
      hindi: ['वे पदार्थ जो बिजली को रोकते हैं', 'वे पदार्थ जो बिजली को आसानी से प्रवाहित होने देते हैं', 'वे पदार्थ जो बिजली को संग्रहीत करते हैं', 'वे पदार्थ जो बिजली बनाते हैं'],
      gujarati: ['વીજળીને અવરોધતી સામગ્રી', 'વીજળીને સરળતાથી વહેવા દેતી સામગ્રી', 'વીજળીને સંગ્રહ કરતી સામગ્રી', 'વીજળી બનાવતી સામગ્રી']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Conductors are materials that allow electric current to flow through them easily. Metals like copper, iron, aluminum are good conductors.',
      hindi: 'चालक वे पदार्थ हैं जो विद्युत धारा को उनके माध्यम से आसानी से प्रवाहित होने देते हैं। तांबा, लोहा, एल्यूमीनियम जैसी धातुएं अच्छे चालक हैं।',
      gujarati: 'વાહક એવી સામગ્રી છે જે વિદ્યુત પ્રવાહને તેમના દ્વારા સરળતાથી વહેવા દે છે. તાંબુ, લોખંડ, એલ્યુમિનિયમ જેવી ધાતુઓ સારા વાહક છે.'
    }
  },
  {
    id: 'conductor_2',
    type: 'mcq',
    difficulty: 'easy',
    topic: 'conductors',
    question: {
      english: 'What are insulators?',
      hindi: 'अवरोधक क्या हैं?',
      gujarati: 'અવાહક શું છે?'
    },
    options: {
      english: ['Materials that allow electricity', 'Materials that do not allow electricity to pass', 'Materials that store heat', 'Materials that create magnetism'],
      hindi: ['वे पदार्थ जो बिजली को प्रवाहित होने देते हैं', 'वे पदार्थ जो बिजली को पारित नहीं होने देते', 'वे पदार्थ जो गर्मी को संग्रहीत करते हैं', 'वे पदार्थ जो चुंबकत्व पैदा करते हैं'],
      gujarati: ['વીજળીને વહેવા દેતી સામગ્રી', 'વીજળીને પસાર થવા ન દેતી સામગ્રી', 'ગરમીને સંગ્રહ કરતી સામગ્રી', 'ચુંબકત્વ બનાવતી સામગ્રી']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Insulators are materials that do not allow electric current to pass through them. Plastic, rubber, wood, glass are good insulators.',
      hindi: 'अवरोधक वे पदार्थ हैं जो विद्युत धारा को उनके माध्यम से पारित नहीं होने देते। प्लास्टिक, रबर, लकड़ी, कांच अच्छे अवरोधक हैं।',
      gujarati: 'અવાહક એવી સામગ્રી છે જે વિદ્યુત પ્રવાહને તેમના દ્વારા પસાર થવા દેતી નથી. પ્લાસ્ટિક, રબર, લાકડું, કાચ સારા અવાહક છે.'
    }
  },
  {
    id: 'conductor_3',
    type: 'mcq',
    difficulty: 'medium',
    topic: 'conductors',
    question: {
      english: 'Which of the following is a good conductor of electricity?',
      hindi: 'निम्नलिखित में से कौन बिजली का अच्छा चालक है?',
      gujarati: 'નીચેનામાંથી કયું વીજળીનો સારો વાહક છે?'
    },
    options: {
      english: ['Plastic', 'Copper', 'Wood', 'Rubber'],
      hindi: ['प्लास्टिक', 'तांबा', 'लकड़ी', 'रबर'],
      gujarati: ['પ્લાસ્ટિક', 'તાંબુ', 'લાકડું', 'રબર']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Copper is a metal and an excellent conductor of electricity. It is commonly used in making electrical wires.',
      hindi: 'तांबा एक धातु है और बिजली का उत्कृष्ट चालक है। इसका उपयोग आमतौर पर विद्युत तार बनाने में किया जाता है।',
      gujarati: 'તાંબુ એક ધાતુ છે અને વીજળીનો ઉત્તમ વાહક છે. તેનો ઉપયોગ સામાન્ય રીતે ઇલેક્ટ્રિકલ તાર બનાવવા માટે થાય છે.'
    }
  },
  {
    id: 'conductor_4',
    type: 'trueFalse',
    difficulty: 'easy',
    topic: 'conductors',
    question: {
      english: 'All metals are good conductors of electricity.',
      hindi: 'सभी धातुएं बिजली की अच्छी चालक होती हैं।',
      gujarati: 'બધી ધાતુઓ વીજળીના સારા વાહક હોય છે.'
    },
    options: {
      english: ['True', 'False'],
      hindi: ['सही', 'गलत'],
      gujarati: ['સાચું', 'ખોટું']
    },
    correctAnswer: 0,
    explanation: {
      english: 'True! All metals are good conductors of electricity. This is why metals are used for making wires and electrical components.',
      hindi: 'सही! सभी धातुएं बिजली की अच्छी चालक होती हैं। यही कारण है कि धातुओं का उपयोग तार और विद्युत घटक बनाने के लिए किया जाता है।',
      gujarati: 'સાચું! બધી ધાતુઓ વીજળીના સારા વાહક છે. આ કારણે ધાતુઓનો ઉપયોગ તાર અને ઇલેક્ટ્રિકલ ઘટકો બનાવવા માટે થાય છે.'
    }
  },
  {
    id: 'conductor_5',
    type: 'mcq',
    difficulty: 'medium',
    topic: 'conductors',
    question: {
      english: 'Why are electric wires covered with plastic or rubber?',
      hindi: 'विद्युत तार प्लास्टिक या रबर से क्यों ढके होते हैं?',
      gujarati: 'ઇલેક્ટ્રિક તારને પ્લાસ્ટિક અથવા રબરથી શા માટે ઢાંકવામાં આવે છે?'
    },
    options: {
      english: ['To make them colorful', 'To protect us from electric shock', 'To make them heavier', 'To conduct more electricity'],
      hindi: ['उन्हें रंगीन बनाने के लिए', 'हमें बिजली के झटके से बचाने के लिए', 'उन्हें भारी बनाने के लिए', 'अधिक बिजली संचालित करने के लिए'],
      gujarati: ['તેમને રંગીન બનાવવા માટે', 'આપણને વીજળીના આઘાતથી બચાવવા માટે', 'તેમને ભારે બનાવવા માટે', 'વધુ વીજળી સંચાલિત કરવા માટે']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Plastic and rubber are insulators. They cover wires to protect us from electric shock. Without this insulation, touching the wire could be dangerous.',
      hindi: 'प्लास्टिक और रबर अवरोधक हैं। वे हमें बिजली के झटके से बचाने के लिए तारों को ढकते हैं। इस इन्सुलेशन के बिना, तार को छूना खतरनाक हो सकता है।',
      gujarati: 'પ્લાસ્ટિક અને રબર અવાહક છે. તે આપણને વીજળીના આઘાતથી બચાવવા માટે તારને ઢાંકે છે. આ ઇન્સ્યુલેશન વિના, તારને સ્પર્શ કરવો જોખમી હોઈ શકે છે.'
    }
  },
  {
    id: 'conductor_6',
    type: 'trueFalse',
    difficulty: 'hard',
    topic: 'conductors',
    question: {
      english: 'Human body is a conductor of electricity.',
      hindi: 'मानव शरीर बिजली का चालक है।',
      gujarati: 'માનવ શરીર વીજળીનું વાહક છે.'
    },
    options: {
      english: ['True', 'False'],
      hindi: ['सही', 'गलत'],
      gujarati: ['સાચું', 'ખોટું']
    },
    correctAnswer: 0,
    explanation: {
      english: 'True! The human body is a conductor of electricity. This is why electric shock can be very dangerous. We must always be careful around electricity.',
      hindi: 'सही! मानव शरीर बिजली का एक चालक है। यही कारण है कि बिजली का झटका बहुत खतरनाक हो सकता है। हमें हमेशा बिजली के आसपास सावधान रहना चाहिए।',
      gujarati: 'સાચું! માનવ શરીર વીજળીનું વાહક છે. આ કારણે વીજળીનો આઘાત ખૂબ જોખમી હોઈ શકે છે. આપણે હંમેશા વીજળીની આસપાસ સાવચેત રહેવું જોઈએ.'
    }
  },
  {
    id: 'conductor_7',
    type: 'mcq',
    difficulty: 'hard',
    topic: 'conductors',
    question: {
      english: 'Why is copper most commonly used for making electric wires?',
      hindi: 'विद्युत तार बनाने के लिए तांबा सबसे अधिक क्यों उपयोग किया जाता है?',
      gujarati: 'ઇલેક્ટ્રિક તાર બનાવવા માટે તાંબાનો સૌથી વધુ ઉપયોગ શા માટે થાય છે?'
    },
    options: {
      english: ['It is the cheapest metal', 'It is a good conductor and affordable', 'It is the strongest metal', 'It looks beautiful'],
      hindi: ['यह सबसे सस्ती धातु है', 'यह एक अच्छा चालक है और किफायती है', 'यह सबसे मजबूत धातु है', 'यह सुंदर दिखता है'],
      gujarati: ['તે સૌથી સસ્તી ધાતુ છે', 'તે સારો વાહક છે અને સસ્તું છે', 'તે સૌથી મજબૂત ધાતુ છે', 'તે સુંદર દેખાય છે']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Copper is used because it is an excellent conductor of electricity and is relatively affordable. Silver and gold conduct better but are too expensive.',
      hindi: 'तांबा का उपयोग किया जाता है क्योंकि यह बिजली का एक उत्कृष्ट चालक है और अपेक्षाकृत किफायती है। चांदी और सोना बेहतर संचालन करते हैं लेकिन बहुत महंगे हैं।',
      gujarati: 'તાંબાનો ઉપયોગ થાય છે કારણ કે તે વીજળીનો ઉત્તમ વાહક છે અને પ્રમાણમાં સસ્તું છે. ચાંદી અને સોનું વધુ સારું સંચાલન કરે છે પરંતુ ખૂબ મોંઘા છે.'
    }
  },
  {
    id: 'conductor_8',
    type: 'mcq',
    difficulty: 'medium',
    topic: 'conductors',
    question: {
      english: 'What safety precaution should you follow with electrical appliances?',
      hindi: 'विद्युत उपकरणों के साथ आपको कौन सी सुरक्षा सावधानी का पालन करना चाहिए?',
      gujarati: 'ઇલેક્ટ્રિકલ ઉપકરણો સાથે તમારે કઈ સલામતી સાવચેતીનું પાલન કરવું જોઈએ?'
    },
    options: {
      english: ['Always use in wet areas', 'Never touch switches with wet hands', 'Remove all safety covers', 'Use damaged wires'],
      hindi: ['हमेशा गीले क्षेत्रों में उपयोग करें', 'गीले हाथों से स्विच को कभी न छुएं', 'सभी सुरक्षा कवर हटा दें', 'क्षतिग्रस्त तारों का उपयोग करें'],
      gujarati: ['હંમેશા ભીના વિસ્તારોમાં વાપરો', 'ભીજેલા હાથથી ક્યારેય સ્વીચ ન સ્પર્શો', 'બધા સલામતી કવર દૂર કરો', 'ક્ષતિગ્રસ્ત તારનો ઉપયોગ કરો']
    },
    correctAnswer: 1,
    explanation: {
      english: 'Never touch switches or electrical appliances with wet hands. Water is a conductor and wet hands increase the risk of electric shock.',
      hindi: 'गीले हाथों से स्विच या विद्युत उपकरणों को कभी न छुएं। पानी एक चालक है और गीले हाथ बिजली के झटके के जोखिम को बढ़ा देते हैं।',
      gujarati: 'ભીજેલા હાથથી ક્યારેય સ્વીચ અથવા ઇલેક્ટ્રિકલ ઉપકરણોને સ્પર્શ ન કરો. પાણી વાહક છે અને ભીજેલા હાથ વીજળીના આઘાતનું જોખમ વધારે છે.'
    }
  }
];

const ElectricityPracticeMode: React.FC<ElectricityPracticeModeProps> = () => {
  const { language, t } = useLanguage();
  const mappedLang = mapLanguage(language);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Use centralized translation system

  const startPractice = (topicId: string) => {
    let questions: Question[];

    if (topicId === 'all') {
      // Mixed practice: 2 random questions from each topic
      const questionsPerTopic = 2;
      questions = [];

      topics.forEach(topic => {
        const topicQuestions = questionsBank.filter(q => q.topic === topic.id);
        const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
        questions.push(...shuffled.slice(0, questionsPerTopic));
      });

      // Shuffle all questions
      questions = questions.sort(() => Math.random() - 0.5);
    } else {
      // Topic-specific practice
      questions = questionsBank.filter(q => q.topic === topicId);
      // Shuffle questions
      questions = [...questions].sort(() => Math.random() - 0.5);
    }

    setCurrentQuestions(questions);
    setSelectedTopic(topicId);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isAnswerCorrect = selectedAnswer === currentQuestions[currentQuestionIndex].correctAnswer;
    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    // Move to next question automatically, otherwise show results when finished
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsAnswered(true);
      setShowResults(true);
    }
  };


  const resetPractice = () => {
    setSelectedTopic(null);
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);

  };

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
    }
  };

  const renderTopicSelection = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <Brain className="w-16 h-16 mx-auto text-blue-500 mb-4" />
        <h2 className="text-4xl font-bold text-gray-800 mb-2">{t('practice.mode')}</h2>
        <p className="text-gray-600">{t('practice.selectTopic')}</p>
      </div>

      {/* Mixed Practice Option */}
      <div className="mb-8">
        <button
          onClick={() => startPractice('all')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="w-10 h-10" />
              <div className="text-left">
                <h3 className="text-2xl font-bold">{t('practice.mixedPractice')}</h3>
                <p className="text-sm opacity-90">{t('practice.allTopics')} • 12 {t('practice.questions')}</p>
              </div>
            </div>
            <ChevronRight className="w-8 h-8" />
          </div>
        </button>
      </div>

      {/* Topic Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => startPractice(topic.id)}
            className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${topic.color} flex items-center justify-center text-3xl mb-4 mx-auto`}>
              {topic.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {topic.name[mappedLang]}
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{topic.questionCount} {t('practice.questions')}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderQuestion = () => {
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-blue-600">
              {t('practice.question')} {currentQuestionIndex + 1} {t('practice.of')} {currentQuestions.length}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
                {t(`practice.${question.difficulty}`)}
              </span>
              <span className="text-sm text-gray-600">
                {t('practice.score')}: {score}/{currentQuestions.length}
              </span>
            </div>
          </div>
          <button
            onClick={resetPractice}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl mb-6">
          <h4 className="text-2xl font-semibold text-gray-800 mb-6">
            {question.question[mappedLang]}
          </h4>

          {/* Options */}
          <div className="space-y-3">
            {question.options[mappedLang].map((option, index) => {
              let optionClass = 'bg-white hover:bg-blue-50 border-gray-300';
              let showIcon = null;

              if (isAnswered) {
                if (index === question.correctAnswer) {
                  optionClass = 'bg-green-100 border-green-500';
                  showIcon = <CheckCircle className="w-6 h-6 text-green-600" />;
                } else if (index === selectedAnswer) {
                  optionClass = 'bg-red-100 border-red-500';
                  showIcon = <XCircle className="w-6 h-6 text-red-600" />;
                }
              } else if (selectedAnswer === index) {
                optionClass = 'bg-blue-100 border-blue-500';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-lg border-2 ${optionClass} text-left transition-all transform hover:scale-102 disabled:cursor-not-allowed flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </div>
                  {showIcon}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className={`p-6 rounded-xl mb-6 border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              {isCorrect ? t('practice.correct') : t('practice.incorrect')}
            </h4>
            <p className="text-gray-700 mb-3">
              <strong>{t('practice.explanation')}:</strong> {question.explanation[mappedLang]}
            </p>
            {!isCorrect && (
              <p className="text-gray-700">
                <strong>{t('practice.correctAnswer')}:</strong> {question.options[mappedLang][question.correctAnswer]}
              </p>
            )}
          </div>
        )}

        {/* Navigation Buttons removed per request */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('practice.submit')}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const percentage = (score / currentQuestions.length) * 100;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="mb-6">
          {percentage >= 80 ? (
            <>
              <Award className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-4xl font-bold text-green-600 mb-4">{t('practice.excellent')}</h2>
            </>
          ) : percentage >= 60 ? (
            <>
              <Star className="w-24 h-24 mx-auto text-blue-500 mb-4" />
              <h2 className="text-4xl font-bold text-blue-600 mb-4">{t('practice.good')}</h2>
            </>
          ) : (
            <>
              <BookOpen className="w-24 h-24 mx-auto text-purple-500 mb-4" />
              <h2 className="text-4xl font-bold text-purple-600 mb-4">{t('practice.keepPracticing')}</h2>
            </>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl mb-6">
          <p className="text-6xl font-bold text-blue-600 mb-2">
            {score}/{currentQuestions.length}
          </p>
          <p className="text-2xl text-gray-700">{t('practice.score')}: {percentage.toFixed(0)}%</p>
        </div>

        {/* Performance message */}
        <div className="mb-8">
          {percentage >= 80 ? (
            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-300">
              <p className="text-gray-700">
                {t('practice.result.excellent')}
              </p>
            </div>
          ) : percentage >= 60 ? (
            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-300">
              <p className="text-gray-700">
                {t('practice.result.good')}
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-300">
              <p className="text-gray-700">
                {t('practice.result.keepPracticing')}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => startPractice(selectedTopic!)}
            className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {t('practice.tryAgain')}
          </button>
          <button
            onClick={resetPractice}
            className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition"
          >
            {t('practice.backToTopics')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ⚡ {t('practice.mode')}
          </h1>
        </div>

        {/* Main Content */}
        <div>
          {!selectedTopic && renderTopicSelection()}
          {selectedTopic && !showResults && renderQuestion()}
          {showResults && renderResults()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            💡 {language === 'en' && 'Practice makes perfect!'}
            {language === 'hi' && 'अभ्यास से पूर्णता आती है!'}
            {language === 'gu' && 'પ્રેક્ટિસથી પૂર્ણતા આવે છે!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ElectricityPracticeMode;