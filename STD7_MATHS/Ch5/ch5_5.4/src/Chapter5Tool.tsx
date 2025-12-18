import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle, RotateCcw, SkipForward, Trophy, ArrowLeft } from 'lucide-react';

interface PracticeExercise {
  id: string;
  type: 'calculation' | 'identification' | 'verification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  data: any;
  correctAnswer: number | string;
  hint: string;
  translations?: {
    [key: string]: {
      question: string;
      hint: string;
    };
  };
}

// Language translations
const translations = {
  en: {
    correct: 'Correct!',
    incorrect: 'Try again!',
    submit: 'Submit',
    hint: 'Hint',
    learning: 'Learn',
    practice: 'Practice',
    selectLanguage: 'Select Language',
    chapterTitle: 'Linear Pair and Vertically Opposite Angles',
    linearPair: 'Linear Pair',
    verticallyOpposite: 'Vertically Opposite Angles',
    linearPairDef: 'When two angles are adjacent (share a common vertex and side) and their non-common sides form a straight line, they are called a Linear Pair. The sum of angles in a linear pair is always 180°.',
    verticallyOppositeDef: 'When two lines intersect, they form two pairs of opposite angles. These opposite angles are called Vertically Opposite Angles and they are always equal.',
    interactiveDiagram: 'Interactive Diagram',
    adjustAngle: 'Adjust Angle',
    animateAngles: 'Animate',
    realWorldApplications: 'Real World Applications',
    practiceExercises: 'Practice Exercises',
    yourAnswer: 'Your Answer',
    enterAnswer: 'Enter your answer',
    skip: 'Skip',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    overview: 'Overview',
    congratulations: 'Congratulations!',
    practiceComplete: 'Practice Complete!',
    youHaveCompleted: 'You have completed all practice exercises.',
    restartPractice: 'Restart Practice',
    backToPractice: 'Back to Learn',
    statusCorrect: 'Correct',
    statusIncorrect: 'Incorrect',
    skipped: 'Skipped',
    notAttempted: 'Not Attempted',
    score: 'Score',
    exerciseNumber: 'Exercise',
    status: 'Status',
    question: 'Question',
    // Real World Applications
    scissors: 'Scissors',
    scissorsDesc: 'When scissors open and close, the blades form vertically opposite angles that are always equal. The handles also form a linear pair.',
    clockHands: 'Clock Hands',
    clockHandsDesc: 'Clock hands create various angle pairs. At certain times, they form linear pairs (180°) or vertically opposite angles.',
    streetIntersection: 'Street Intersections',
    streetIntersectionDesc: 'When two roads cross, they create vertically opposite angles. Traffic planners use this to design signal timings.',
    ladder: 'Ladder Against Wall',
    ladderDesc: 'A ladder leaning against a wall forms a linear pair with the ground and wall angles.',
    furniture: 'Furniture Design',
    furnitureDesc: 'Foldable furniture like chairs and tables use linear pair principles for hinges and joints.',
    bridges: 'Bridge Construction',
    bridgesDesc: 'Bridge supports create vertically opposite angles for structural stability and load distribution.',
  },
  hi: {
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    submit: 'जमा करें',
    hint: 'संकेत',
    learning: 'सीखें',
    practice: 'अभ्यास',
    selectLanguage: 'भाषा चुनें',
    chapterTitle: 'रैखिक युग्म और शीर्षाभिमुख कोण',
    linearPair: 'रैखिक युग्म',
    verticallyOpposite: 'शीर्षाभिमुख कोण',
    linearPairDef: 'जब दो कोण आसन्न होते हैं (एक सामान्य शीर्ष और भुजा साझा करते हैं) और उनकी असामान्य भुजाएं एक सीधी रेखा बनाती हैं, तो उन्हें रैखिक युग्म कहा जाता है। रैखिक युग्म में कोणों का योग हमेशा 180° होता है।',
    verticallyOppositeDef: 'जब दो रेखाएं प्रतिच्छेद करती हैं, तो वे विपरीत कोणों के दो युग्म बनाती हैं। ये विपरीत कोण शीर्षाभिमुख कोण कहलाते हैं और वे हमेशा समान होते हैं।',
    interactiveDiagram: 'इंटरैक्टिव आरेख',
    adjustAngle: 'कोण समायोजित करें',
    animateAngles: 'एनिमेट करें',
    realWorldApplications: 'वास्तविक दुनिया के अनुप्रयोग',
    practiceExercises: 'अभ्यास कसरतें',
    yourAnswer: 'आपका उत्तर',
    enterAnswer: 'अपना उत्तर दर्ज करें',
    skip: 'छोड़ें',
    beginner: 'शुरुआती',
    intermediate: 'मध्यम',
    advanced: 'उन्नत',
    overview: 'अवलोकन',
    congratulations: 'बधाई हो!',
    practiceComplete: 'अभ्यास पूर्ण!',
    youHaveCompleted: 'आपने सभी अभ्यास कसरतें पूर्ण कर ली हैं।',
    restartPractice: 'अभ्यास पुनः प्रारंभ करें',
    backToPractice: 'सीखने पर वापस जाएं',
    statusCorrect: 'सही',
    statusIncorrect: 'गलत',
    skipped: 'छोड़ा गया',
    notAttempted: 'प्रयास नहीं किया',
    score: 'स्कोर',
    exerciseNumber: 'कसरत',
    status: 'स्थिति',
    question: 'प्रश्न',
    scissors: 'कैंची',
    scissorsDesc: 'जब कैंची खुलती और बंद होती है, तो ब्लेड शीर्षाभिमुख कोण बनाते हैं जो हमेशा समान होते हैं। हैंडल भी एक रैखिक युग्म बनाते हैं।',
    clockHands: 'घड़ी की सुइयां',
    clockHandsDesc: 'घड़ी की सुइयां विभिन्न कोण युग्म बनाती हैं। कुछ समय पर, वे रैखिक युग्म (180°) या शीर्षाभिमुख कोण बनाती हैं।',
    streetIntersection: 'सड़क चौराहे',
    streetIntersectionDesc: 'जब दो सड़कें पार करती हैं, तो वे शीर्षाभिमुख कोण बनाती हैं। यातायात योजनाकार सिग्नल समय डिजाइन करने के लिए इसका उपयोग करते हैं।',
    ladder: 'दीवार के खिलाफ सीढ़ी',
    ladderDesc: 'दीवार के खिलाफ झुकी हुई सीढ़ी जमीन और दीवार के कोणों के साथ एक रैखिक युग्म बनाती है।',
    furniture: 'फर्नीचर डिजाइन',
    furnitureDesc: 'कुर्सियों और मेजों जैसे फोल्ड करने योग्य फर्नीचर काज और जोड़ों के लिए रैखिक युग्म सिद्धांतों का उपयोग करते हैं।',
    bridges: 'पुल निर्माण',
    bridgesDesc: 'पुल समर्थन संरचनात्मक स्थिरता और भार वितरण के लिए शीर्षाभिमुख कोण बनाते हैं।',
  },
  gu: {
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    submit: 'જમા કરો',
    hint: 'સંકેત',
    learning: 'શીખો',
    practice: 'અભ્યાસ',
    selectLanguage: 'ભાષા પસંદ કરો',
    chapterTitle: 'રેખીય જોડ અને ઊભી વિરુદ્ધ કોણ',
    linearPair: 'રેખીય જોડ',
    verticallyOpposite: 'ઊભી વિરુદ્ધ કોણ',
    linearPairDef: 'જ્યારે બે કોણ નજીકના હોય (એક સામાન્ય શિરોબિંદુ અને બાજુ શેર કરે છે) અને તેમની અસામાન્ય બાજુઓ એક સીધી રેખા બનાવે છે, તો તેને રેખીય જોડ કહેવામાં આવે છે। રેખીય જોડમાં કોણનો સરવાળો હંમેશા 180° હોય છે।',
    verticallyOppositeDef: 'જ્યારે બે રેખાઓ એકબીજાને છેદે છે, ત્યારે તે વિરુદ્ધ કોણની બે જોડી બનાવે છે। આ વિરુદ્ધ કોણને ઊભી વિરુદ્ધ કોણ કહેવામાં આવે છે અને તે હંમેશા સમાન હોય છે।',
    interactiveDiagram: 'ઇન્ટરેક્ટિવ આકૃતિ',
    adjustAngle: 'કોણ સમાયોજિત કરો',
    animateAngles: 'ઍનિમેટ કરો',
    realWorldApplications: 'વાસ્તવિક દુનિયા',
    practiceExercises: 'અભ્યાસ કસરતો',
    yourAnswer: 'તમારો જવાબ',
    enterAnswer: 'તમારો જવાબ દાખલ કરો',
    skip: 'છોડી દો',
    beginner: 'શરૂઆત',
    intermediate: 'મધ્યમ',
    advanced: 'અદ્યતન',
    overview: 'સારાંશ',
    congratulations: 'અભિનંદન!',
    practiceComplete: 'અભ્યાસ પૂર્ણ!',
    youHaveCompleted: 'તમે બધા અભ્યાસ કસરતો પૂર્ણ કરી લીધી છે.',
    restartPractice: 'અભ્યાસ ફરી શરૂ કરો',
    backToPractice: 'શીખવા પર પાછા જાઓ',
    statusCorrect: 'સાચું',
    statusIncorrect: 'ખોટું',
    skipped: 'છોડી દીધી',
    notAttempted: 'પ્રયાસ નથી કર્યો',
    score: 'સ્કોર',
    exerciseNumber: 'કસરત',
    status: 'સ્થિતિ',
    question: 'પ્રશ્ન',
    scissors: 'કાતર',
    scissorsDesc: 'જ્યારે કાતર ખુલે છે અને બંધ થાય છે, ત્યારે બ્લેડ ઊભી વિરુદ્ધ કોણ બનાવે છે જે હંમેશા સમાન હોય છે। હેન્ડલ પણ રેખીય જોડ બનાવે છે।',
    clockHands: 'ઘડિયાળની સોય',
    clockHandsDesc: 'ઘડિયાળની સોય વિવિધ કોણ જોડી બનાવે છે। ચોક્કસ સમયે, તે રેખીય જોડ (180°) અથવા ઊભી વિરુદ્ધ કોણ બનાવે છે।',
    streetIntersection: 'શેરી ક્રોસિંગ',
    streetIntersectionDesc: 'જ્યારે બે રસ્તા ક્રોસ કરે છે, ત્યારે તે ઊભી વિરુદ્ધ કોણ બનાવે છે। ટ્રાફિક આયોજકો સિગ્નલ સમય ડિઝાઇન કરવા માટે આનો ઉપયોગ કરે છે।',
    ladder: 'દિવાલ સામે સીડી',
    ladderDesc: 'દિવાલ સામે ઝૂકેલી સીડી જમીન અને દિવાલના કોણ સાથે રેખીય જોડ બનાવે છે।',
    furniture: 'ફર્નિચર ડિઝાઇન',
    furnitureDesc: 'ખુરશીઓ અને ટેબલ જેવા ફોલ્ડ કરી શકાય તેવા ફર્નિચર હિન્જ અને જોડાણો માટે રેખીય જોડ સિદ્ધાંતોનો ઉપયોગ કરે છે।',
    bridges: 'પુલ બાંધકામ',
    bridgesDesc: 'પુલ સપોર્ટ માળખાકીય સ્થિરતા અને ભાર વિતરણ માટે ઊભી વિરુદ્ધ કોણ બનાવે છે।',
  }
};

// Practice exercises
const practiceExercises: PracticeExercise[] = [
  {
    id: 'ex1',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'Two angles form a linear pair. If one angle is 110°, find the other angle.',
    data: {},
    correctAnswer: 70,
    hint: 'Linear pair angles always add up to 180°. So the other angle = 180° - 110° = 70°.',
    translations: {
      gu: {
        question: 'બે કોણ રેખીય જોડ બનાવે છે. જો એક કોણ 110° હોય, તો બીજો કોણ શોધો।',
        hint: 'રેખીય જોડ કોણ હંમેશા 180° સુધી ઉમેરે છે. તેથી બીજો કોણ = 180° - 110° = 70°।'
      },
      hi: {
        question: 'दो कोण एक रैखिक युग्म बनाते हैं। यदि एक कोण 110° है, तो दूसरा कोण ज्ञात करें।',
        hint: 'रैखिक युग्म कोण हमेशा 180° तक जुड़ते हैं। इसलिए दूसरा कोण = 180° - 110° = 70°।'
      }
    }
  },
  {
    id: 'ex2',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'Two lines intersect forming angles. If one angle is 65°, find its vertically opposite angle.',
    data: {},
    correctAnswer: 65,
    hint: 'Vertically opposite angles are always equal. So the answer is 65°.',
    translations: {
      gu: {
        question: 'બે રેખાઓ છેદે છે અને કોણ બનાવે છે. જો એક કોણ 65° હોય, તો તેનો ઊભી વિરુદ્ધ કોણ શોધો।',
        hint: 'ઊભી વિરુદ્ધ કોણ હંમેશા સમાન હોય છે. તેથી જવાબ 65° છે।'
      },
      hi: {
        question: 'दो रेखाएं प्रतिच्छेद करती हैं और कोण बनाती हैं। यदि एक कोण 65° है, तो इसका शीर्षाभिमुख कोण ज्ञात करें।',
        hint: 'शीर्षाभिमुख कोण हमेशा समान होते हैं। इसलिए उत्तर 65° है।'
      }
    }
  },
  {
    id: 'ex3',
    type: 'calculation',
    difficulty: 'intermediate',
    question: 'Two angles form a linear pair. If one angle is 45° more than the other, find both angles.',
    data: {},
    correctAnswer: '67.5, 112.5',
    hint: 'Let one angle be x. Then other angle is x + 45. Since x + (x + 45) = 180, we get 2x = 135, so x = 67.5°. Angles are 67.5° and 112.5°.',
    translations: {
      gu: {
        question: 'બે કોણ રેખીય જોડ બનાવે છે. જો એક કોણ બીજા કરતાં 45° વધુ હોય, તો બંને કોણ શોધો।',
        hint: 'ચાલો એક કોણ x હોય. પછી બીજો કોણ x + 45 છે. કારણ કે x + (x + 45) = 180, આપણને 2x = 135 મળે છે, તેથી x = 67.5°. કોણ 67.5° અને 112.5° છે।'
      },
      hi: {
        question: 'दो कोण एक रैखिक युग्म बनाते हैं। यदि एक कोण दूसरे से 45° अधिक है, तो दोनों कोण ज्ञात करें।',
        hint: 'माना एक कोण x है। तब दूसरा कोण x + 45 है। चूंकि x + (x + 45) = 180, हमें 2x = 135 मिलता है, इसलिए x = 67.5°। कोण 67.5° और 112.5° हैं।'
      }
    }
  },
  {
    id: 'ex4',
    type: 'calculation',
    difficulty: 'intermediate',
    question: 'Angles in a linear pair are in ratio 2:3. Find both angles.',
    data: {},
    correctAnswer: '72, 108',
    hint: 'Let angles be 2x and 3x. Since 2x + 3x = 180°, we get 5x = 180°, so x = 36°. Angles are 72° and 108°.',
    translations: {
      gu: {
        question: 'રેખીય જોડમાં કોણ 2:3 ના ગુણોત્તરમાં છે. બંને કોણ શોધો।',
        hint: 'ચાલો કોણ 2x અને 3x હોય. કારણ કે 2x + 3x = 180°, આપણને 5x = 180° મળે છે, તેથી x = 36°. કોણ 72° અને 108° છે।'
      },
      hi: {
        question: 'एक रैखिक युग्म में कोण 2:3 के अनुपात में हैं। दोनों कोण ज्ञात करें।',
        hint: 'माना कोण 2x और 3x हैं। चूंकि 2x + 3x = 180°, हमें 5x = 180° मिलता है, इसलिए x = 36°। कोण 72° और 108° हैं।'
      }
    }
  },
  {
    id: 'ex5',
    type: 'calculation',
    difficulty: 'intermediate',
    question: 'Two lines intersect. If one angle is 128°, find all four angles formed at the intersection.',
    data: {},
    correctAnswer: '128, 52, 128, 52',
    hint: 'Vertically opposite angles are equal, and adjacent angles form linear pair (180°). So: 128°, 180° - 128° = 52°, 128°, 52°.',
    translations: {
      gu: {
        question: 'બે રેખાઓ છેદે છે. જો એક કોણ 128° હોય, તો છેદ પર રચાયેલા ચારેય કોણ શોધો।',
        hint: 'ઊભી વિરુદ્ધ કોણ સમાન છે, અને નજીકના કોણ રેખીય જોડ (180°) બનાવે છે. તેથી: 128°, 180° - 128° = 52°, 128°, 52°।'
      },
      hi: {
        question: 'दो रेखाएं प्रतिच्छेद करती हैं। यदि एक कोण 128° है, तो प्रतिच्छेदन पर बने सभी चार कोण ज्ञात करें।',
        hint: 'शीर्षाभिमुख कोण समान होते हैं, और आसन्न कोण रैखिक युग्म (180°) बनाते हैं। इसलिए: 128°, 180° - 128° = 52°, 128°, 52°।'
      }
    }
  },
  {
    id: 'ex6',
    type: 'calculation',
    difficulty: 'advanced',
    question: 'Two lines intersect. One of the angles is 3x + 20°. Find x if its adjacent angle is 2x + 10°.',
    data: {},
    correctAnswer: 30,
    hint: 'Adjacent angles at intersection form linear pair, so (3x + 20) + (2x + 10) = 180. Solving: 5x + 30 = 180, so x = 30.',
    translations: {
      gu: {
        question: 'બે રેખાઓ છેદે છે. એક કોણ 3x + 20° છે. x શોધો જો તેનો નજીકનો કોણ 2x + 10° હોય।',
        hint: 'છેદ પર નજીકના કોણ રેખીય જોડ બનાવે છે, તેથી (3x + 20) + (2x + 10) = 180. ઉકેલ: 5x + 30 = 180, તેથી x = 30.'
      },
      hi: {
        question: 'दो रेखाएं प्रतिच्छेद करती हैं। एक कोण 3x + 20° है। x ज्ञात करें यदि इसका आसन्न कोण 2x + 10° है।',
        hint: 'प्रतिच्छेदन पर आसन्न कोण रैखिक युग्म बनाते हैं, इसलिए (3x + 20) + (2x + 10) = 180। हल: 5x + 30 = 180, इसलिए x = 30।'
      }
    }
  },
  {
    id: 'ex7',
    type: 'calculation',
    difficulty: 'advanced',
    question: 'Two lines intersect. One angle is 4x - 10° and its vertically opposite angle is 3x + 15°. Find x and the angle.',
    data: {},
    correctAnswer: '25, 90',
    hint: 'Vertically opposite angles are equal. So 4x - 10 = 3x + 15. Solving: x = 25. Angle = 4(25) - 10 = 90°.',
    translations: {
      gu: {
        question: 'બે રેખાઓ છેદે છે. એક કોણ 4x - 10° છે અને તેનો ઊભી વિરુદ્ધ કોણ 3x + 15° છે. x અને કોણ શોધો।',
        hint: 'ઊભી વિરુદ્ધ કોણ સમાન છે. તેથી 4x - 10 = 3x + 15. ઉકેલ: x = 25. કોણ = 4(25) - 10 = 90°।'
      },
      hi: {
        question: 'दो रेखाएं प्रतिच्छेद करती हैं। एक कोण 4x - 10° है और इसका शीर्षाभिमुख कोण 3x + 15° है। x और कोण ज्ञात करें।',
        hint: 'शीर्षाभिमुख कोण समान होते हैं। इसलिए 4x - 10 = 3x + 15। हल: x = 25। कोण = 4(25) - 10 = 90°।'
      }
    }
  },
  {
    id: 'ex8',
    type: 'calculation',
    difficulty: 'advanced',
    question: 'In a linear pair, one angle is three times the other. Find the smaller angle.',
    data: {},
    correctAnswer: 45,
    hint: 'Let smaller angle be x, then larger is 3x. Since x + 3x = 180°, we get 4x = 180°, so x = 45°.',
    translations: {
      gu: {
        question: 'રેખીય જોડમાં, એક કોણ બીજા કરતાં ત્રણ ગણો છે. નાનો કોણ શોધો।',
        hint: 'ચાલો નાનો કોણ x હોય, તો મોટો 3x છે. કારણ કે x + 3x = 180°, આપણને 4x = 180° મળે છે, તેથી x = 45°।'
      },
      hi: {
        question: 'एक रैखिक युग्म में, एक कोण दूसरे का तीन गुना है। छोटा कोण ज्ञात करें।',
        hint: 'माना छोटा कोण x है, तो बड़ा 3x है। चूंकि x + 3x = 180°, हमें 4x = 180° मिलता है, इसलिए x = 45°।'
      }
    }
  }
];

const Chapter5Tool: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch5-5.4-language');
    return (savedLanguage as 'en' | 'hi' | 'gu') || 'en';
  });
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, 'correct' | 'incorrect' | 'skipped' | 'notAttempted'>>({});
  
  const [activeTab, setActiveTab] = useState<'linearPair' | 'verticallyOpposite' | null>(null);
  const [angle1, setAngle1] = useState(110);
  const [angle2, setAngle2] = useState(70);
  const [intersectAngle, setIntersectAngle] = useState(60);
  const [isAnimating, setIsAnimating] = useState(false);

  const t = translations[language];

  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch5-5.4-language', newLanguage);
  };

  useEffect(() => {
    setAngle2(180 - angle1);
  }, [angle1]);

  const animateAngles = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const duration = 4000;
    const startTime = Date.now();
    const startAngle1 = angle1;
    const startIntersectAngle = intersectAngle;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (activeTab === 'linearPair') {
        const minAngle = 40;
        const maxAngle = 140;
        const range = maxAngle - minAngle;
        const normalizedProgress = (Math.sin(progress * Math.PI * 2) + 1) / 2;
        const newAngle = minAngle + normalizedProgress * range;
        setAngle1(Math.round(newAngle));
      } else if (activeTab === 'verticallyOpposite') {
        const minAngle = 30;
        const maxAngle = 150;
        const range = maxAngle - minAngle;
        const normalizedProgress = (Math.sin(progress * Math.PI * 2) + 1) / 2;
        const newAngle = minAngle + normalizedProgress * range;
        setIntersectAngle(Math.round(newAngle));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure angles return to visible values after animation
        if (activeTab === 'linearPair') {
          setAngle1(startAngle1);
        } else if (activeTab === 'verticallyOpposite') {
          setIntersectAngle(startIntersectAngle);
        }
        setIsAnimating(false);
      }
    };

    animate();
  };

  const drawAngleArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number, color: string) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(start);
    const y1 = cy - radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy - radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return (
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        opacity="0.8"
      />
    );
  };

  const LinearPairDiagram = () => (
    <svg width="100%" height="350" viewBox="0 0 450 350" preserveAspectRatio="xMidYMid meet" className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg">
      <defs>
        <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Base line (straight line) with shadow */}
      <line x1="30" y1="220" x2="420" y2="220" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
      <line x1="30" y1="220" x2="420" y2="220" stroke="#1e293b" strokeWidth="4" />
      
      {/* Ray forming angle 1 */}
      <line 
        x1="225" 
        y1="220" 
        x2={225 + 180 * Math.cos((angle1 * Math.PI) / 180)} 
        y2={220 - 180 * Math.sin((angle1 * Math.PI) / 180)} 
        stroke="#3b82f6"
        strokeWidth="4" 
        strokeLinecap="round"
      />
      <line 
        x1="225" 
        y1="220" 
        x2={225 + 180 * Math.cos((angle1 * Math.PI) / 180)} 
        y2={220 - 180 * Math.sin((angle1 * Math.PI) / 180)} 
        stroke="url(#lineGrad1)" 
        strokeWidth="4" 
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Angle fills for better visibility */}
      <path
        d={`M 225 220 L ${225 + 70 * Math.cos((0 * Math.PI) / 180)} ${220 - 70 * Math.sin((0 * Math.PI) / 180)} A 70 70 0 0 0 ${225 + 70 * Math.cos((angle1 * Math.PI) / 180)} ${220 - 70 * Math.sin((angle1 * Math.PI) / 180)} Z`}
        fill="#3b82f6"
        opacity="0.2"
      />
      <path
        d={`M 225 220 L ${225 + 70 * Math.cos((angle1 * Math.PI) / 180)} ${220 - 70 * Math.sin((angle1 * Math.PI) / 180)} A 70 70 0 0 0 ${225 + 70 * Math.cos((180 * Math.PI) / 180)} ${220 - 70 * Math.sin((180 * Math.PI) / 180)} Z`}
        fill="#8b5cf6"
        opacity="0.2"
      />
      
      {/* Angle arcs */}
      {drawAngleArc(225, 220, 65, 0, angle1, '#3b82f6')}
      {drawAngleArc(225, 220, 85, angle1, 180, '#8b5cf6')}
      
      {/* Dynamic labels with background */}
      <g>
        <rect 
          x={225 + 95 * Math.cos((angle1 / 2 * Math.PI) / 180) - 25} 
          y={220 - 95 * Math.sin((angle1 / 2 * Math.PI) / 180) - 18} 
          width="50" 
          height="28" 
          fill="white" 
          rx="6" 
          opacity="0.9"
        />
        <text 
          x={225 + 95 * Math.cos((angle1 / 2 * Math.PI) / 180)} 
          y={220 - 95 * Math.sin((angle1 / 2 * Math.PI) / 180)} 
          fill="#3b82f6" 
          fontSize="22" 
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {angle1}°
        </text>
      </g>
      
      <g>
        <rect 
          x={225 + 105 * Math.cos(((angle1 + 90) * Math.PI) / 180) - 25} 
          y={Math.min(220 - 105 * Math.sin(((angle1 + 90) * Math.PI) / 180) - 18, 185)} 
          width="50" 
          height="28" 
          fill="white" 
          rx="6" 
          opacity="0.9"
        />
        <text 
          x={225 + 105 * Math.cos(((angle1 + 90) * Math.PI) / 180)} 
          y={Math.min(220 - 105 * Math.sin(((angle1 + 90) * Math.PI) / 180), 203)} 
          fill="#8b5cf6" 
          fontSize="22" 
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {angle2}°
        </text>
      </g>
      
      {/* Sum equation at bottom with styled background */}
      <rect x="100" y="280" width="250" height="40" fill="white" rx="20" stroke="#059669" strokeWidth="2" opacity="0.95" />
      <text x="225" y="305" fill="#059669" fontSize="20" fontWeight="bold" textAnchor="middle">
        {angle1}° + {angle2}° = 180°
      </text>
      
      {/* Vertex point with highlight */}
      <circle cx="225" cy="220" r="6" fill="white" stroke="#1e293b" strokeWidth="2" />
      <circle cx="225" cy="220" r="3" fill="#1e293b" />
      
      {/* Labels for rays */}
      <text x="400" y="230" fill="#1e293b" fontSize="16" fontWeight="bold">A</text>
      <text x="20" y="230" fill="#1e293b" fontSize="16" fontWeight="bold">B</text>
      <text 
        x={225 + 190 * Math.cos((angle1 * Math.PI) / 180)} 
        y={220 - 190 * Math.sin((angle1 * Math.PI) / 180)} 
        fill="#3b82f6" 
        fontSize="16" 
        fontWeight="bold"
      >
        C
      </text>
      <text x="220" y="245" fill="#1e293b" fontSize="14" fontWeight="bold">O</text>
    </svg>
  );

  const VerticallyOppositeDiagram = () => {
    const oppositeAngle = intersectAngle;
    const adjacentAngle = 180 - intersectAngle;
    
    return (
      <svg width="100%" height="350" viewBox="0 0 450 350" preserveAspectRatio="xMidYMid meet" className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg">
        <defs>
          <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#db2777', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="lineGrad4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background grid for reference */}
        <line x1="225" y1="0" x2="225" y2="350" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
        <line x1="0" y1="175" x2="450" y2="175" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
        
        {/* Intersecting lines with shadows */}
        <line x1="30" y1="175" x2="420" y2="175" stroke="#94a3b8" strokeWidth="2" opacity="0.3" />
        <line x1="30" y1="175" x2="420" y2="175" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        
        <line 
          x1={225 - 180 * Math.cos((oppositeAngle * Math.PI) / 180)} 
          y1={175 + 180 * Math.sin((oppositeAngle * Math.PI) / 180)} 
          x2={225 + 180 * Math.cos((oppositeAngle * Math.PI) / 180)} 
          y2={175 - 180 * Math.sin((oppositeAngle * Math.PI) / 180)} 
          stroke="#f9a8d4" 
          strokeWidth="2" 
          opacity="0.3"
        />
        <line 
          x1={225 - 180 * Math.cos((oppositeAngle * Math.PI) / 180)} 
          y1={175 + 180 * Math.sin((oppositeAngle * Math.PI) / 180)} 
          x2={225 + 180 * Math.cos((oppositeAngle * Math.PI) / 180)} 
          y2={175 - 180 * Math.sin((oppositeAngle * Math.PI) / 180)} 
          stroke="#ec4899"
          strokeWidth="4" 
          strokeLinecap="round"
        />
        <line 
          x1={225 - 180 * Math.cos((oppositeAngle * Math.PI) / 180)} 
          y1={175 + 180 * Math.sin((oppositeAngle * Math.PI) / 180)} 
          x2={225 + 180 * Math.cos((oppositeAngle * Math.PI) / 180)} 
          y2={175 - 180 * Math.sin((oppositeAngle * Math.PI) / 180)} 
          stroke="url(#lineGrad3)" 
          strokeWidth="4" 
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* Angle fills - Vertically opposite angles (equal) */}
        <path
          d={`M 225 175 L ${225 + 60 * Math.cos((0 * Math.PI) / 180)} ${175 - 60 * Math.sin((0 * Math.PI) / 180)} A 60 60 0 0 0 ${225 + 60 * Math.cos((oppositeAngle * Math.PI) / 180)} ${175 - 60 * Math.sin((oppositeAngle * Math.PI) / 180)} Z`}
          fill="#3b82f6"
          opacity="0.25"
        />
        <path
          d={`M 225 175 L ${225 + 60 * Math.cos((180 * Math.PI) / 180)} ${175 - 60 * Math.sin((180 * Math.PI) / 180)} A 60 60 0 0 0 ${225 + 60 * Math.cos((180 + oppositeAngle) * Math.PI) / 180} ${175 - 60 * Math.sin((180 + oppositeAngle) * Math.PI) / 180} Z`}
          fill="#3b82f6"
          opacity="0.25"
        />
        
        {/* Angle fills - Adjacent angles (supplementary) */}
        <path
          d={`M 225 175 L ${225 + 60 * Math.cos((oppositeAngle * Math.PI) / 180)} ${175 - 60 * Math.sin((oppositeAngle * Math.PI) / 180)} A 60 60 0 0 0 ${225 + 60 * Math.cos((180 * Math.PI) / 180)} ${175 - 60 * Math.sin((180 * Math.PI) / 180)} Z`}
          fill="#a855f7"
          opacity="0.2"
        />
        <path
          d={`M 225 175 L ${225 + 60 * Math.cos((180 + oppositeAngle) * Math.PI) / 180} ${175 - 60 * Math.sin((180 + oppositeAngle) * Math.PI) / 180} A 60 60 0 0 0 ${225 + 60 * Math.cos((360 * Math.PI) / 180)} ${175 - 60 * Math.sin((360 * Math.PI) / 180)} Z`}
          fill="#a855f7"
          opacity="0.2"
        />
        
        {/* Angle arcs - Vertically opposite angles */}
        {drawAngleArc(225, 175, 55, 0, oppositeAngle, '#3b82f6')}
        {drawAngleArc(225, 175, 55, 180, 180 + oppositeAngle, '#3b82f6')}
        
        {/* Angle arcs - Adjacent angles (in specific quadrants) */}
        {drawAngleArc(225, 175, 75, oppositeAngle, 180, '#a855f7')}
        {drawAngleArc(225, 175, 75, 180 + oppositeAngle, 360, '#a855f7')}
        
        {/* Labels with backgrounds - Vertically opposite angles (highlighted as equal) */}
        <g filter="url(#glow)">
          <rect 
            x={225 + 85 * Math.cos((oppositeAngle / 2 * Math.PI) / 180) - 30} 
            y={175 - 85 * Math.sin((oppositeAngle / 2 * Math.PI) / 180) - 20} 
            width="60" 
            height="32" 
            fill="#dbeafe" 
            stroke="#3b82f6"
            strokeWidth="2"
            rx="8" 
            opacity="0.95"
          />
          <text 
            x={225 + 85 * Math.cos((oppositeAngle / 2 * Math.PI) / 180)} 
            y={175 - 85 * Math.sin((oppositeAngle / 2 * Math.PI) / 180)} 
            fill="#3b82f6" 
            fontSize="24" 
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {oppositeAngle}°
          </text>
        </g>
        
        <g filter="url(#glow)">
          <rect 
            x={225 + 85 * Math.cos(((180 + oppositeAngle / 2) * Math.PI) / 180) - 30} 
            y={175 - 85 * Math.sin(((180 + oppositeAngle / 2) * Math.PI) / 180) - 20} 
            width="60" 
            height="32" 
            fill="#dbeafe" 
            stroke="#3b82f6"
            strokeWidth="2"
            rx="8" 
            opacity="0.95"
          />
          <text 
            x={225 + 85 * Math.cos(((180 + oppositeAngle / 2) * Math.PI) / 180)} 
            y={175 - 85 * Math.sin(((180 + oppositeAngle / 2) * Math.PI) / 180)} 
            fill="#3b82f6" 
            fontSize="24" 
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {oppositeAngle}°
          </text>
        </g>
        
        {/* Labels - Adjacent angles (positioned in specific quadrants) */}
        {/* Top-left quadrant label */}
        <g>
          <rect 
            x={225 + 110 * Math.cos((135 * Math.PI) / 180) - 30} 
            y={175 - 110 * Math.sin((135 * Math.PI) / 180) - 15} 
            width="60" 
            height="30" 
            fill="white" 
            rx="6" 
            opacity="0.9"
          />
          <text 
            x={225 + 110 * Math.cos((135 * Math.PI) / 180)} 
            y={175 - 110 * Math.sin((135 * Math.PI) / 180)} 
            fill="#a855f7" 
            fontSize="20" 
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {adjacentAngle}°
          </text>
        </g>
        
        {/* Bottom-right quadrant label */}
        <g>
          <rect 
            x={225 + 110 * Math.cos((315 * Math.PI) / 180) - 30} 
            y={175 - 110 * Math.sin((315 * Math.PI) / 180) - 15} 
            width="60" 
            height="30" 
            fill="white" 
            rx="6" 
            opacity="0.9"
          />
          <text 
            x={225 + 110 * Math.cos((315 * Math.PI) / 180)} 
            y={175 - 110 * Math.sin((315 * Math.PI) / 180)} 
            fill="#a855f7" 
            fontSize="20" 
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {adjacentAngle}°
          </text>
        </g>
        
        {/* Info box showing the equality - positioned at bottom to avoid overlap */}
        <rect x="90" y="295" width="270" height="45" fill="white" rx="22" stroke="#3b82f6" strokeWidth="3" opacity="0.95" />
        <text x="225" y="322" fill="#3b82f6" fontSize="18" fontWeight="bold" textAnchor="middle">
          Vertically Opposite: {oppositeAngle}° = {oppositeAngle}°
        </text>
        
        {/* Vertex point with highlight and label */}
        <circle cx="225" cy="175" r="8" fill="white" stroke="#1e293b" strokeWidth="3" />
        <circle cx="225" cy="175" r="4" fill="#1e293b" />
        <text x="225" y="200" fill="#1e293b" fontSize="16" fontWeight="bold" textAnchor="middle">O</text>
        
        {/* Ray labels */}
        <text x="410" y="185" fill="#1e293b" fontSize="16" fontWeight="bold">A</text>
        <text x="25" y="185" fill="#1e293b" fontSize="16" fontWeight="bold">B</text>
        <text 
          x={225 + 195 * Math.cos((oppositeAngle * Math.PI) / 180)} 
          y={175 - 195 * Math.sin((oppositeAngle * Math.PI) / 180) + 5} 
          fill="#ec4899" 
          fontSize="16" 
          fontWeight="bold"
        >
          C
        </text>
        <text 
          x={225 - 195 * Math.cos((oppositeAngle * Math.PI) / 180)} 
          y={175 + 195 * Math.sin((oppositeAngle * Math.PI) / 180) + 5} 
          fill="#ec4899" 
          fontSize="16" 
          fontWeight="bold"
        >
          D
        </text>
      </svg>
    );
  };

  const getTranslatedText = (item: any, field: string, lang: string) => {
    if (item.translations && item.translations[lang] && item.translations[lang][field]) {
      return item.translations[lang][field];
    }
    return item[field];
  };

  const handleSubmitAnswer = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return;

    let isCorrect = false;
    const answerStr = studentAnswer.trim();
    const correctStr = String(currentExercise.correctAnswer);

    if (correctStr.includes(',')) {
      const correctParts = correctStr.split(',').map(s => s.trim()).sort();
      const answerParts = answerStr.split(',').map(s => s.trim()).sort();
      isCorrect = correctParts.length === answerParts.length && 
                  correctParts.every((val, idx) => val === answerParts[idx]);
    } else {
      isCorrect = answerStr === correctStr || parseInt(answerStr) === parseInt(correctStr);
    }

    if (isCorrect) {
      setFeedback(t.correct);
      setExerciseStatus(prev => ({ ...prev, [currentExercise.id]: 'correct' }));
      
      setTimeout(() => {
        if (currentExerciseIndex < practiceExercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
        } else {
          setShowOverview(true);
        }
        setStudentAnswer('');
        setFeedback('');
        setShowHint(false);
      }, 1500);
    } else {
      setFeedback(t.incorrect);
      setExerciseStatus(prev => ({ ...prev, [currentExercise.id]: 'incorrect' }));
    }
  };

  const handleSkip = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return;

    setExerciseStatus(prev => ({ ...prev, [currentExercise.id]: 'skipped' }));

    if (currentExerciseIndex < practiceExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowOverview(true);
    }
    setStudentAnswer('');
    setFeedback('');
    setShowHint(false);
  };

  const renderDemonstrationMode = () => (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Topic Selection Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <button
          onClick={() => setActiveTab('linearPair')}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
            activeTab === 'linearPair' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ring-2 sm:ring-4 ring-blue-200' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
          }`}
        >
          {t.linearPair}
        </button>
        <button
          onClick={() => setActiveTab('verticallyOpposite')}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
            activeTab === 'verticallyOpposite' 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white ring-2 sm:ring-4 ring-purple-200' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
          }`}
        >
          {t.verticallyOpposite}
        </button>
      </div>

      {/* Content Display */}
      {activeTab === 'linearPair' && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full">
          {/* Definition */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <span className="text-2xl sm:text-3xl">📐</span>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">{t.linearPair}</h3>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">
                {t.linearPairDef}
              </p>
            </div>
          </div>
          
          {/* Key Properties Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✅</span>
                <h4 className="font-bold text-gray-800 text-base sm:text-lg">
                  {language === 'en' ? 'Key Properties' : language === 'hi' ? 'मुख्य गुण' : 'મુખ્ય ગુણધર્મો'}
                </h4>
              </div>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{language === 'en' ? 'Angles are adjacent (share a common side)' : language === 'hi' ? 'कोण आसन्न हैं (एक सामान्य भुजा साझा करते हैं)' : 'કોણ નજીકના છે (એક સામાન્ય બાજુ શેર કરે છે)'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{language === 'en' ? 'Sum is always 180°' : language === 'hi' ? 'योग हमेशा 180° होता है' : 'સરવાળો હંમેશા 180° હોય છે'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{language === 'en' ? 'Non-common sides form a straight line' : language === 'hi' ? 'असामान्य भुजाएं एक सीधी रेखा बनाती हैं' : 'અસામાન્ય બાજુઓ સીધી રેખા બનાવે છે'}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💡</span>
                <h4 className="font-bold text-gray-800 text-base sm:text-lg">
                  {language === 'en' ? 'Quick Formula' : language === 'hi' ? 'त्वरित सूत्र' : 'ઝડપી સૂત્ર'}
                </h4>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'en' ? 'If angles are ∠A and ∠B:' : language === 'hi' ? 'यदि कोण ∠A और ∠B हैं:' : 'જો કોણ ∠A અને ∠B છે:'}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">∠A + ∠B = 180°</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  {language === 'en' ? 'Supplementary Angles' : language === 'hi' ? 'संपूरक कोण' : 'સંપૂરક કોણ'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Interactive Diagram */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{t.interactiveDiagram}:</h4>
            <LinearPairDiagram />
          </div>
          
          {/* Controls */}
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <label className="text-gray-700 font-semibold text-sm sm:text-base min-w-[100px] sm:min-w-[120px]">{t.adjustAngle}:</label>
              <input type="range" min="40" max="140" value={angle1} onChange={(e) => setAngle1(Number(e.target.value))} className="flex-1 w-full sm:w-auto h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer" />
              <span className="text-blue-600 font-bold text-base sm:text-lg min-w-[50px] sm:min-w-[60px]">{angle1}°</span>
            </div>
            <button onClick={animateAngles} disabled={isAnimating} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm sm:text-base">
              <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              {t.animateAngles}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'verticallyOpposite' && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full">
          {/* Definition */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-purple-50 rounded-xl border-l-4 border-purple-500">
            <span className="text-2xl sm:text-3xl">✖️</span>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">{t.verticallyOpposite}</h3>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">
                {t.verticallyOppositeDef}
              </p>
            </div>
          </div>
          
          {/* Key Properties Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✅</span>
                <h4 className="font-bold text-gray-800 text-base sm:text-lg">
                  {language === 'en' ? 'Key Properties' : language === 'hi' ? 'मुख्य गुण' : 'મુખ્ય ગુણધર્મો'}
                </h4>
              </div>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{language === 'en' ? 'Formed when two lines intersect' : language === 'hi' ? 'दो रेखाओं के प्रतिच्छेदन से बनते हैं' : 'બે રેખાઓ છેદે ત્યારે રચાય છે'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{language === 'en' ? 'Opposite angles are always equal' : language === 'hi' ? 'विपरीत कोण हमेशा समान होते हैं' : 'વિરુદ્ધ કોણ હંમેશા સમાન હોય છે'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{language === 'en' ? 'Adjacent angles form linear pair' : language === 'hi' ? 'आसन्न कोण रैखिक युग्म बनाते हैं' : 'નજીકના કોણ રેખીય જોડ બનાવે છે'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{language === 'en' ? 'Four angles are formed in total' : language === 'hi' ? 'कुल चार कोण बनते हैं' : 'કુલ ચાર કોણ રચાય છે'}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 sm:p-5 border-2 border-indigo-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💡</span>
                <h4 className="font-bold text-gray-800 text-base sm:text-lg">
                  {language === 'en' ? 'Equality Rule' : language === 'hi' ? 'समानता नियम' : 'સમાનતા નિયમ'}
                </h4>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'en' ? 'When lines AB and CD intersect:' : language === 'hi' ? 'जब रेखाएं AB और CD प्रतिच्छेद करती हैं:' : 'જ્યારે રેખાઓ AB અને CD છેદે છે:'}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">∠1 = ∠3</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600">∠2 = ∠4</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  {language === 'en' ? 'Vertically Opposite Angles' : language === 'hi' ? 'शीर्षाभिमुख कोण' : 'ઊભી વિરુદ્ધ કોણ'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Interactive Diagram */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{t.interactiveDiagram}:</h4>
            <VerticallyOppositeDiagram />
          </div>
          
          {/* Controls */}
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <label className="text-gray-700 font-semibold text-sm sm:text-base min-w-[100px] sm:min-w-[120px]">{t.adjustAngle}:</label>
              <input type="range" min="30" max="150" value={intersectAngle} onChange={(e) => setIntersectAngle(Number(e.target.value))} className="flex-1 w-full sm:w-auto h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer" />
              <span className="text-purple-600 font-bold text-base sm:text-lg min-w-[50px] sm:min-w-[60px]">{intersectAngle}°</span>
            </div>
            <button onClick={animateAngles} disabled={isAnimating} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 text-sm sm:text-base">
              <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              {t.animateAngles}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderOverview = () => {
    const totalExercises = practiceExercises.length;
    const correctCount = Object.values(exerciseStatus).filter(s => s === 'correct').length;
    const incorrectCount = Object.values(exerciseStatus).filter(s => s === 'incorrect').length;
    const skippedCount = Object.values(exerciseStatus).filter(s => s === 'skipped').length;
    const score = totalExercises > 0 ? Math.round((correctCount / totalExercises) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-teal-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-2">{t.congratulations}</h2>
          <p className="text-xl">{t.practiceComplete}</p>
          <p className="text-lg mt-2 opacity-90">{t.youHaveCompleted}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t.overview}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 text-center">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-green-700 mt-2">{t.statusCorrect}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 text-center">
              <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-red-700 mt-2">{t.statusIncorrect}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200 text-center">
              <div className="text-3xl font-bold text-yellow-600">{skippedCount}</div>
              <div className="text-sm text-yellow-700 mt-2">{t.skipped}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-blue-700 mt-2">{t.score}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-teal-500 to-purple-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">{t.exerciseNumber}</th>
                  <th className="px-6 py-4 text-left">{t.question}</th>
                  <th className="px-6 py-4 text-center">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {practiceExercises.map((exercise, index) => {
                  const status = exerciseStatus[exercise.id] || 'notAttempted';
                  const statusColors = {
                    correct: 'bg-green-100 text-green-800 border-green-300',
                    incorrect: 'bg-red-100 text-red-800 border-red-300',
                    skipped: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    notAttempted: 'bg-gray-100 text-gray-600 border-gray-300'
                  };
                  const statusText = {
                    correct: t.statusCorrect,
                    incorrect: t.statusIncorrect,
                    skipped: t.skipped,
                    notAttempted: t.notAttempted
                  };
                  
                  return (
                    <tr key={exercise.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">{index + 1}</td>
                      <td className="px-6 py-4">
                        {getTranslatedText(exercise, 'question', language)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border-2 ${statusColors[status]}`}>
                          {statusText[status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => {
                setShowOverview(false);
                setCurrentExerciseIndex(0);
                setExerciseStatus({});
                setStudentAnswer('');
                setFeedback('');
                setShowHint(false);
              }}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-xl hover:from-teal-600 hover:to-purple-600 transition-all font-medium shadow-lg hover:scale-105 text-lg"
            >
              <RotateCcw className="w-5 h-5" />
              {t.restartPractice}
            </button>
            <button
              onClick={() => setCurrentMode('demonstration')}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-medium shadow-lg hover:scale-105 text-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.backToPractice}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPracticeMode = () => {
    if (showOverview) {
      return renderOverview();
    }

    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return null;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full">
          <div className="w-full">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border-2 border-orange-200 max-w-4xl mx-auto w-full overflow-x-hidden">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl md:text-5xl">📖</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-teal-purple">
                  {t.practiceExercises}
                </h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-orange-300">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">📋</span>
                    {t.question} {currentExerciseIndex + 1} / {practiceExercises.length}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 break-words">
                    {getTranslatedText(currentExercise, 'question', language)}
                  </p>
                  
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    currentExercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    currentExercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t[currentExercise.difficulty]}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-300">
                  <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-800 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">❓</span>
                    {t.yourAnswer}
                  </h4>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
                    <input
                      type="text"
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSubmitAnswer();
                        }
                      }}
                      placeholder={t.enterAnswer}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-lg sm:rounded-xl hover:bg-yellow-600 transition-colors font-medium text-sm sm:text-base shadow-lg hover:scale-105"
                    >
                      <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t.hint}
                    </button>
                  )}
                  
                  <button
                    onClick={handleSubmitAnswer}
                    className="flex items-center gap-1 sm:gap-2 px-5 sm:px-8 py-2 sm:py-3 bg-teal-500 text-white rounded-lg sm:rounded-xl hover:bg-teal-600 transition-colors font-medium text-sm sm:text-base shadow-lg hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.submit}
                  </button>

                  <button
                    onClick={handleSkip}
                    className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg sm:rounded-xl hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base shadow-lg hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.skip}
                  </button>
                </div>

                {showHint && (
                  <div className="hint-display p-4 sm:p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-xl sm:text-2xl">💡</div>
                      <div className="text-base sm:text-lg text-yellow-800 font-medium break-words">
                        {getTranslatedText(currentExercise, 'hint', language)}
                      </div>
                    </div>
                  </div>
                )}

                {feedback && (
                  <div className={`feedback p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center gap-2 sm:gap-4 ${
                    feedback === t.correct 
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {feedback === t.correct ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <div className="text-2xl sm:text-3xl">🎉</div>
                        <div className="text-lg sm:text-2xl font-bold">{feedback}</div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <div className="text-2xl sm:text-3xl">🤔</div>
                        <div className="text-lg sm:text-2xl font-bold">{feedback}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRealWorldApplications = () => (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">{t.realWorldApplications}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Scissors */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">✂️</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.scissors}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                {t.scissorsDesc}
              </p>
            </div>
          </div>

          {/* Clock Hands */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-teal-200">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🕐</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.clockHands}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                {t.clockHandsDesc}
              </p>
            </div>
          </div>

          {/* Street Intersection */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🚦</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.streetIntersection}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                {t.streetIntersectionDesc}
              </p>
            </div>
          </div>

          {/* Ladder */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-indigo-200">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🪜</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.ladder}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                {t.ladderDesc}
              </p>
            </div>
          </div>

          {/* Furniture */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-200">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🪑</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.furniture}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                {t.furnitureDesc}
              </p>
            </div>
          </div>

          {/* Bridges */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-pink-200">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🌉</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.bridges}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                {t.bridgesDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 overflow-x-hidden">
      <header className="bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              📐 {t.chapterTitle}
            </h1>
            
            <nav className="flex items-center gap-3">
              <button
                onClick={() => setCurrentMode('demonstration')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'demonstration'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                📚 {t.learning}
              </button>
              <button
                onClick={() => setCurrentMode('practice')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'practice'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                ✍️ {t.practice}
              </button>
              <button
                onClick={() => setCurrentMode('realworld')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'realworld'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🌍 Real World
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'hi' | 'gu')}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 overflow-x-hidden">
        <div className="main-content w-full">
          {currentMode === 'demonstration' && renderDemonstrationMode()}
          {currentMode === 'practice' && renderPracticeMode()}
          {currentMode === 'realworld' && renderRealWorldApplications()}
        </div>
      </main>
    </div>
  );
};

export default Chapter5Tool;

