import React, { useState } from 'react';
import { CheckCircle, XCircle, Award, RotateCcw, ChevronRight, ChevronLeft, Trophy, AlertCircle } from 'lucide-react';
import { useLanguage } from './RadiationLearning';
import { LanguageCode, getFontFamilyForLanguage } from '../i18n/radiationTranslations';

interface Question {
  id: number;
  question: string;
  type: 'mcq' | 'true_false' | 'match' | 'sequence';
  options?: string[];
  correctAnswer: string | string[] | { [key: string]: string };
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface RadiationPracticeModeProps {
  props?: {
    language?: LanguageCode;
  };
}

interface PracticeTranslations {
  headerTitle: string;
  headerSubtitle: string;
  pointsLabel: string;
  progressLabel: (answered: number, total: number) => string;
  questionLabel: (id: number) => string;
  submitAnswer: string;
  next: string;
  previous: string;
  restartQuiz: string;
  finalTitle: string;
  finalSubtitle: string;
  totalPoints: string;
  scoreLabel: string;
  correctLabel: string;
   gradeLabel: string;
  keyRemindersTitle: string;
  keyReminders: string[];
  correctFeedback: string;
  incorrectFeedback: string;
  arrangeSequenceHint: string;
  selectAnswerPlaceholder: string;
  gradeExcellent: string;
  gradeGood: string;
  gradeKeepPracticing: string;
  difficultyLabels?: {
    easy: string;
    medium: string;
    hard: string;
  };
  questions: Question[];
}

interface Translations {
  en: PracticeTranslations;
  hi: PracticeTranslations;
  gu: PracticeTranslations;
}

const translations: Translations = {
  en: {
    headerTitle: 'Radiation Practice Quiz',
    headerSubtitle: 'Test Your Understanding',
    pointsLabel: 'points',
    progressLabel: (answered, total) => `${answered} of ${total} questions answered`,
    questionLabel: (id) => `Q${id}`,
    submitAnswer: 'Submit Answer',
    next: 'Next',
    previous: 'Previous',
    restartQuiz: 'Restart Quiz',
    finalTitle: 'Quiz Complete! 🎉',
    finalSubtitle: 'Great job completing the radiation quiz!',
    totalPoints: 'Total Points',
    scoreLabel: 'Score',
    correctLabel: 'Correct',
    gradeLabel: 'Grade',
    keyRemindersTitle: '📚 Key Reminders:',
    keyReminders: [
      'Radiation does NOT need any medium - works in vacuum!',
      "Sun's heat reaches Earth through radiation across 150 million km",
      'Light colors reflect heat, dark colors absorb heat',
      'All objects radiate heat to their surroundings',
      "Conduction and convection need a medium, radiation doesn't",
    ],
    correctFeedback: '✓ Correct!',
    incorrectFeedback: '✗ Incorrect',
    arrangeSequenceHint: 'Use the arrows to arrange these steps in the correct order',
    selectAnswerPlaceholder: 'Select answer...',
    gradeExcellent: 'Excellent! 🌟',
    gradeGood: 'Good Job! 👍',
    gradeKeepPracticing: 'Keep Practicing! 📚',
    difficultyLabels: {
      easy: 'EASY',
      medium: 'MEDIUM',
      hard: 'HARD',
    },
    questions: [
      {
        id: 1,
        question: 'What is radiation?',
        type: 'mcq',
        options: [
          'Heat transfer through direct contact between particles',
          'Heat transfer through movement of particles in fluids',
          'Heat transfer without requiring any medium',
          'Heat transfer only in solids',
        ],
        correctAnswer: 'Heat transfer without requiring any medium',
        explanation:
          'Radiation is the process of heat transfer that does NOT require any medium (solid, liquid, or gas). Heat travels directly from a hot object through empty space.',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 2,
        question: 'Radiation can travel through vacuum (empty space).',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          "TRUE! This is what makes radiation unique. The Sun's heat reaches Earth by traveling through 150 million km of vacuum space. No medium is needed!",
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 3,
        question: 'How does heat from the Sun reach Earth?',
        type: 'mcq',
        options: [
          'Through conduction in the atmosphere',
          'Through convection currents in space',
          'Through radiation across vacuum',
          'Through air particles in space',
        ],
        correctAnswer: 'Through radiation across vacuum',
        explanation:
          "The Sun's heat reaches Earth through radiation. It travels 150 million kilometers through the vacuum of space where there are no particles to conduct or convect heat!",
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 4,
        question: 'Why do we wear white clothes in summer and dark clothes in winter?',
        type: 'mcq',
        options: [
          'White clothes absorb heat, dark clothes reflect heat',
          'White clothes reflect heat, dark clothes absorb heat',
          'Color has no effect on heat',
          'White clothes conduct heat better',
        ],
        correctAnswer: 'White clothes reflect heat, dark clothes absorb heat',
        explanation:
          'Light colors REFLECT most heat radiation (keeping us cool in summer), while dark colors ABSORB more heat radiation (keeping us warm in winter).',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 5,
        question: 'All objects radiate heat to their surroundings.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'TRUE! Every object radiates heat. A hot utensil kept away from flame gradually cools down by radiating heat to cooler surroundings. Hotter objects radiate more heat.',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 6,
        question:
          'Pema and Palden felt warm sitting near the fireplace even without touching the fire. This warmth was due to:',
        type: 'mcq',
        options: [
          'Conduction through the air',
          'Convection currents in the room',
          'Radiation from the fire',
          'Reflected heat from walls',
        ],
        correctAnswer: 'Radiation from the fire',
        explanation:
          'The warmth they felt was due to RADIATION - heat traveling directly from the fire to them through the air without needing the air particles to move.',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 7,
        question: 'Which statement about radiation is INCORRECT?',
        type: 'mcq',
        options: [
          'Radiation requires a medium to travel',
          'Radiation can travel through vacuum',
          'All objects radiate heat',
          "The Sun's heat reaches Earth by radiation",
        ],
        correctAnswer: 'Radiation requires a medium to travel',
        explanation:
          'This is INCORRECT! Radiation does NOT require any medium. This is what makes it different from conduction and convection, which both need a medium.',
        difficulty: 'hard',
        points: 20,
      },
      {
        id: 8,
        question:
          'A hot metal pot is kept on a table (not on a stove). It gradually cools down. What process causes this cooling?',
        type: 'mcq',
        options: [
          'Conduction to the table only',
          'Convection in the air only',
          'Radiation to surroundings only',
          'All three: conduction, convection, and radiation',
        ],
        correctAnswer: 'All three: conduction, convection, and radiation',
        explanation:
          'The pot cools through ALL THREE processes: conduction to the table, convection to air around it, and radiation to all surroundings. But the textbook emphasizes radiation!',
        difficulty: 'hard',
        points: 20,
      },
      {
        id: 9,
        question: 'Wet clothes dry faster in sunlight because:',
        type: 'mcq',
        options: [
          'Wind blows the water away',
          "Sun's radiation heats water molecules causing faster evaporation",
          'Air conducts heat to clothes',
          'Sunlight absorbs the water',
        ],
        correctAnswer: "Sun's radiation heats water molecules causing faster evaporation",
        explanation:
          "The Sun's RADIATION heats the water in clothes, making water molecules move faster and evaporate more quickly. The heat travels through space and air via radiation!",
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 10,
        question: 'Heat transfer methods can work together at the same time.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'TRUE! When heating water in a pan: conduction transfers heat from flame to pan, convection heats the water, and radiation makes you feel warmth near the flame. All three work together!',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 11,
        question: 'Match each heat transfer process with its key characteristic:',
        type: 'match',
        options: [
          'Conduction|Particles pass heat to neighbors without moving position',
          'Convection|Particles physically move carrying heat with them',
          'Radiation|No medium needed, works in vacuum',
          'All three|Require a temperature difference',
        ],
        correctAnswer: {
          Conduction: 'Particles pass heat to neighbors without moving position',
          Convection: 'Particles physically move carrying heat with them',
          Radiation: 'No medium needed, works in vacuum',
          'All three': 'Require a temperature difference',
        },
        explanation:
          "Each heat transfer method has unique characteristics. Radiation's ability to work without any medium makes it special - that's how the Sun's energy reaches us!",
        difficulty: 'hard',
        points: 25,
      },
      {
        id: 12,
        question: 'Arrange these statements about solar cookers in the correct order from start to finish:',
        type: 'sequence',
        options: [
          'Sunlight reaches Earth through radiation across space',
          'Mirrors reflect and concentrate sunlight',
          'Concentrated radiation heats the cooking pot',
          'Food in the pot gets cooked',
          'All this happens without any medium for heat transfer!',
        ],
        correctAnswer: [
          'Sunlight reaches Earth through radiation across space',
          'Mirrors reflect and concentrate sunlight',
          'Concentrated radiation heats the cooking pot',
          'Food in the pot gets cooked',
          'All this happens without any medium for heat transfer!',
        ],
        explanation:
          "Solar cookers demonstrate radiation perfectly: the Sun's energy travels through vacuum, gets concentrated by mirrors, and heats food - all through radiation without needing particles to carry the heat!",
        difficulty: 'hard',
        points: 25,
      },
    ],
  },
  hi: {
    headerTitle: 'विकिरण अभ्यास क्विज',
    headerSubtitle: 'अपनी समझ की जाँच करें',
    pointsLabel: 'अंक',
    progressLabel: (answered, total) => `${answered} में से ${total} प्रश्न हल किए गए`,
    questionLabel: (id) => `प्रश्न ${id}`,
    submitAnswer: 'उत्तर जमा करें',
    next: 'अगला',
    previous: 'पिछला',
    restartQuiz: 'क्विज़ फिर से शुरू करें',
    finalTitle: 'क्विज़ पूरा! 🎉',
    finalSubtitle: 'विकिरण पर क्विज़ पूरा करने के लिए शाबाश!',
    totalPoints: 'कुल अंक',
    scoreLabel: 'स्कोर',
    correctLabel: 'सही उत्तर',
    gradeLabel: 'ग्रेड',
    keyRemindersTitle: '📚 मुख्य बातें:',
    keyReminders: [
      'विकिरण को किसी भी माध्यम की आवश्यकता नहीं होती - निर्वात में भी काम करता है!',
      'सूर्य की ऊष्मा 150 मिलियन km दूर से विकिरण के द्वारा पृथ्वी तक पहुँचती है',
      'हल्के रंग ऊष्मा को परावर्तित करते हैं, गहरे रंग ऊष्मा को अधिक अवशोषित करते हैं',
      'सभी वस्तुएँ अपने आस-पास में ऊष्मा का विकिरण करती हैं',
      'चालन और संवहन को माध्यम चाहिए, विकिरण को नहीं',
    ],
    correctFeedback: '✓ सही उत्तर!',
    incorrectFeedback: '✗ गलत उत्तर',
    arrangeSequenceHint: 'कृपया तीरों का उपयोग करके इन चरणों को सही क्रम में लगाएँ',
    selectAnswerPlaceholder: 'उत्तर चुनें...',
    gradeExcellent: 'उत्कृष्ट! 🌟',
    gradeGood: 'अच्छा काम! 👍',
    gradeKeepPracticing: 'लगातार अभ्यास करते रहें! 📚',
    difficultyLabels: {
      easy: 'आसान',
      medium: 'मध्यम',
      hard: 'कठिन',
    },
    questions: [
      {
        id: 1,
        question: 'विकिरण क्या है?',
        type: 'mcq',
        options: [
          'कणों के सीधे संपर्क से ऊष्मा का स्थानांतरण',
          'द्रवों / गैसों में कणों की गति से ऊष्मा का स्थानांतरण',
          'ऊष्मा का बिना किसी माध्यम के स्थानांतरण',
          'केवल ठोसों में ऊष्मा का स्थानांतरण',
        ],
        correctAnswer: 'ऊष्मा का बिना किसी माध्यम के स्थानांतरण',
        explanation:
          'विकिरण वह प्रक्रिया है जिसमें ऊष्मा का स्थानांतरण किसी भी माध्यम (ठोस, द्रव या गैस) के बिना होता है। ऊष्मा सीधे गर्म वस्तु से खाली स्थान के माध्यम से हमारे पास पहुँचती है।',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 2,
        question: 'विकिरण निर्वात (खाली स्थान) में भी यात्रा कर सकता है।',
        type: 'true_false',
        options: ['सही', 'गलत'],
        correctAnswer: 'सही',
        explanation:
          'सही! यही बात विकिरण को विशेष बनाती है। सूर्य की ऊष्मा 150 मिलियन km के निर्वात से होकर पृथ्वी तक पहुँचती है। इसके लिए किसी माध्यम की आवश्यकता नहीं होती।',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 3,
        question: 'सूर्य की ऊष्मा पृथ्वी तक कैसे पहुँचती है?',
        type: 'mcq',
        options: [
          'वायुमंडल में चालन के द्वारा',
          'अंतरिक्ष में संवहन धाराओं के द्वारा',
          'निर्वात में विकिरण के द्वारा',
          'अंतरिक्ष में वायु कणों के द्वारा',
        ],
        correctAnswer: 'निर्वात में विकिरण के द्वारा',
        explanation:
          'सूर्य की ऊष्मा पृथ्वी तक विकिरण के द्वारा पहुँचती है। यह 150 मिलियन km दूर अंतरिक्ष के निर्वात से होकर आती है, जहाँ चालन या संवहन के लिए कोई कण नहीं होते।',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 4,
        question: 'हम गर्मियों में सफेद कपड़े और सर्दियों में गहरे रंग के कपड़े क्यों पहनते हैं?',
        type: 'mcq',
        options: [
          'सफेद कपड़े ऊष्मा अवशोषित करते हैं, गहरे कपड़े ऊष्मा परावर्तित करते हैं',
          'सफेद कपड़े ऊष्मा परावर्तित करते हैं, गहरे कपड़े ऊष्मा अवशोषित करते हैं',
          'रंग का ऊष्मा से कोई संबंध नहीं है',
          'सफेद कपड़े ऊष्मा को बेहतर चलित करते हैं',
        ],
        correctAnswer: 'सफेद कपड़े ऊष्मा परावर्तित करते हैं, गहरे कपड़े ऊष्मा अवशोषित करते हैं',
        explanation:
          'हल्के रंग (जैसे सफेद) अधिकांश ऊष्मा विकिरण को परावर्तित कर देते हैं, इसलिए गर्मियों में हमें ठंडा रखते हैं। गहरे रंग अधिक ऊष्मा विकिरण को अवशोषित करते हैं, इसलिए सर्दियों में हमें गरम रखते हैं।',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 5,
        question: 'सभी वस्तुएँ अपने आस-पास की ओर ऊष्मा का विकिरण करती हैं।',
        type: 'true_false',
        options: ['सही', 'गलत'],
        correctAnswer: 'सही',
        explanation:
          'सही! हर वस्तु ऊष्मा का कुछ न कुछ विकिरण करती है। चूल्हे से हटाया गया गरम बर्तन धीरे-धीरे ठंडा हो जाता है क्योंकि वह अपने आसपास की ठंडी वस्तुओं की ओर ऊष्मा विकिरित करता है। तापमान जितना अधिक, विकिरण उतना अधिक।',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 6,
        question:
          'पेमा और पेल्डन आग के पास बैठे थे और बिना छुए ही उन्हें गरमी महसूस हुई। यह गरमी किस कारण से थी?',
        type: 'mcq',
        options: [
          'वायु के द्वारा चालन',
          'कक्ष में संवहन धाराओं के कारण',
          'आग से आने वाले विकिरण के कारण',
          'दीवारों से परावर्तित ऊष्मा के कारण',
        ],
        correctAnswer: 'आग से आने वाले विकिरण के कारण',
        explanation:
          'उन्हें महसूस हुई गरमी विकिरण के कारण थी। ऊष्मा सीधे आग से उनके शरीर तक हवा के माध्यम से पहुँची, बिना इस के कि हवा के कणों को बहुत अधिक हिलना-डुलना पड़े।',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 7,
        question: 'विकिरण के बारे में कौन-सा कथन गलत है?',
        type: 'mcq',
        options: [
          'विकिरण के लिए माध्यम आवश्यक है',
          'विकिरण निर्वात में भी यात्रा कर सकता है',
          'सभी वस्तुएँ ऊष्मा का विकिरण करती हैं',
          'सूर्य की ऊष्मा पृथ्वी तक विकिरण से पहुँचती है',
        ],
        correctAnswer: 'विकिरण के लिए माध्यम आवश्यक है',
        explanation:
          'यह कथन गलत है। विकिरण को किसी भी माध्यम की आवश्यकता नहीं होती। यही बात इसे चालन और संवहन से अलग बनाती है, जिन्हें माध्यम चाहिए।',
        difficulty: 'hard',
        points: 20,
      },
      {
        id: 8,
        question:
          'एक गरम धातु का बर्तन मेज पर रखा है (चूल्हे पर नहीं)। वह धीरे-धीरे ठंडा हो जाता है। यह ठंडा होना किस प्रक्रिया के कारण होता है?',
        type: 'mcq',
        options: [
          'केवल मेज की ओर चालन',
          'केवल वायु में संवहन',
          'केवल आसपास की ओर विकिरण',
          'तीनों: चालन, संवहन और विकिरण',
        ],
        correctAnswer: 'तीनों: चालन, संवहन और विकिरण',
        explanation:
          'बर्तन तीनों तरीकों से ऊष्मा खोता है: मेज की ओर चालन, आसपास की वायु की ओर संवहन और चारों ओर की वस्तुओं की ओर विकिरण। पाठ्यपुस्तक विशेष रूप से विकिरण पर जोर देती है।',
        difficulty: 'hard',
        points: 20,
      },
      {
        id: 9,
        question: 'गीले कपड़े धूप में अधिक जल्दी सूख जाते हैं क्योंकि:',
        type: 'mcq',
        options: [
          'हवा पानी को उड़ा ले जाती है',
          'सूर्य का विकिरण पानी के कणों को गरम कर तेज वाष्पीकरण कराता है',
          'हवा ऊष्मा का चालन करके कपड़ों को गरम करती है',
          'सूर्य का प्रकाश पानी को सोख लेता है',
        ],
        correctAnswer: 'सूर्य का विकिरण पानी के कणों को गरम कर तेज वाष्पीकरण कराता है',
        explanation:
          'सूर्य का विकिरण कपड़ों में मौजूद पानी को गरम करता है, जिससे जल-अणु तेज़ गति से हिलने लगते हैं और जल्दी वाष्पित हो जाते हैं। ऊष्मा अंतरिक्ष और वायु से होकर विकिरण द्वारा कपड़ों तक पहुँचती है।',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 10,
        question: 'ऊष्मा के विभिन्न स्थानांतरण के तरीके एक साथ काम कर सकते हैं।',
        type: 'true_false',
        options: ['सही', 'गलत'],
        correctAnswer: 'सही',
        explanation:
          'सही! जब हम पतीले में पानी गरम करते हैं: चालन से ऊष्मा चूल्हे से पतीले तक जाती है, संवहन से पानी गरम होता है और विकिरण से हमें ज्वाला के पास ऊष्मा महसूस होती है। तीनों तरीके एक साथ काम करते हैं।',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 11,
        question: 'प्रत्येक ऊष्मा स्थानांतरण प्रक्रिया का उसके मुख्य गुण के साथ मिलान कीजिए:',
        type: 'match',
        options: [
          'चालन|कण अपनी जगह से बिना हिले पड़ोसी कणों को ऊष्मा देते हैं',
          'संवहन|कण स्वयं चलकर ऊष्मा को साथ ले जाते हैं',
          'विकिरण|बिना किसी माध्यम के, निर्वात में भी कार्य करता है',
          'सभी|तापांतर (तापमान का अंतर) आवश्यक है',
        ],
        correctAnswer: {
          चालन: 'कण अपनी जगह से बिना हिले पड़ोसी कणों को ऊष्मा देते हैं',
          संवहन: 'कण स्वयं चलकर ऊष्मा को साथ ले जाते हैं',
          विकिरण: 'बिना किसी माध्यम के, निर्वात में भी कार्य करता है',
          सभी: 'तापांतर (तापमान का अंतर) आवश्यक है',
        },
        explanation:
          'प्रत्येक ऊष्मा स्थानांतरण विधि की अपनी विशेषता होती है। विकिरण की यह विशेषता कि उसे किसी माध्यम की आवश्यकता नहीं होती, उसे खास बनाती है – इसी से सूर्य की ऊर्जा हम तक पहुँचती है।',
        difficulty: 'hard',
        points: 25,
      },
      {
        id: 12,
        question: 'सौर कुकर के बारे में इन कथनों को सही क्रम में लगाएँ (आरंभ से अंत तक):',
        type: 'sequence',
        options: [
          'सूर्य का प्रकाश विकिरण के रूप में अंतरिक्ष से पृथ्वी तक पहुँचता है',
          'दर्पण सूर्य के प्रकाश को परावर्तित और केंद्रित करते हैं',
          'केंद्रित विकिरण से पकाने वाला बर्तन गरम हो जाता है',
          'बर्तन में रखा भोजन पक जाता है',
          'यह सब बिना किसी माध्यम के ऊष्मा स्थानांतरण के होता है!',
        ],
        correctAnswer: [
          'सूर्य का प्रकाश विकिरण के रूप में अंतरिक्ष से पृथ्वी तक पहुँचता है',
          'दर्पण सूर्य के प्रकाश को परावर्तित और केंद्रित करते हैं',
          'केंद्रित विकिरण से पकाने वाला बर्तन गरम हो जाता है',
          'बर्तन में रखा भोजन पक जाता है',
          'यह सब बिना किसी माध्यम के ऊष्मा स्थानांतरण के होता है!',
        ],
        explanation:
          'सौर कुकर विकिरण का एक अच्छा उदाहरण हैं: सूर्य की ऊर्जा निर्वात से होकर आती है, दर्पणों द्वारा केंद्रित की जाती है और बर्तन को गरम कर भोजन पकाती है – यह सब केवल विकिरण के द्वारा होता है।',
        difficulty: 'hard',
        points: 25,
      },
    ],
  },
  gu: {
    headerTitle: 'વિકિરણ પ્રેક્ટિસ ક્વિઝ',
    headerSubtitle: 'તમારી સમજ તપાસો',
    pointsLabel: 'અંકો',
    progressLabel: (answered, total) => `${total}માંથી ${answered} પ્રશ્નોના જવાબ આપ્યા`,
    questionLabel: (id) => `પ્રશ્ન ${id}`,
    submitAnswer: 'જવાબ મોકલો',
    next: 'આગળ',
    previous: 'પાછળ',
    restartQuiz: 'ક્વિઝ ફરી શરૂ કરો',
    finalTitle: 'ક્વિઝ પૂર્ણ! 🎉',
    finalSubtitle: 'વિકિરણ વિષય પર ક્વિઝ પૂર્ણ કરવા બદલ ખૂબ સારું!',
    totalPoints: 'કુલ અંકો',
    scoreLabel: 'સ્કોર',
    correctLabel: 'સાચા જવાબ',
    gradeLabel: 'ગ્રેડ',
    keyRemindersTitle: '📚 મહત્વના મુદ્દા:',
    keyReminders: [
      'વિકિરણને કોઈ માધ્યમની જરૂર પડતી નથી - ખાલી જગ્યામાં પણ કામ કરે છે!',
      'સૂર્યની ઉષ્મા 150 મિલિયન km દૂરથી વિકિરણ દ્વારા પૃથ્વી સુધી પહોંચે છે',
      'હળવા રંગો ઉષ્મા પરાવર્તિત કરે છે, ગાઢ રંગો વધુ ઉષ્મા શોષે છે',
      'બધી વસ્તુઓ પોતાની આસપાસ ઉષ્માનો વિકિરણ કરે છે',
      'ચાલન અને સંવહનને માધ્યમ જોઈએ, વિકિરણને નહિ',
    ],
    correctFeedback: '✓ સાચો જવાબ!',
    incorrectFeedback: '✗ ખોટો જવાબ',
    arrangeSequenceHint: 'તીર બટનોનો ઉપયોગ કરીને પગથિયાંને યોગ્ય ક્રમમાં મૂકો',
    selectAnswerPlaceholder: 'જવાબ પસંદ કરો...',
    gradeExcellent: 'ઉત્તમ! 🌟',
    gradeGood: 'સારો પ્રયાસ! 👍',
    gradeKeepPracticing: 'અભ્યાસ ચાલુ રાખો! 📚',
    difficultyLabels: {
      easy: 'સરળ',
      medium: 'મધ્યમ',
      hard: 'કઠિન',
    },
    questions: [
      {
        id: 1,
        question: 'વિકિરણ શું છે?',
        type: 'mcq',
        options: [
          'કણોના સીધા સંપર્કથી ઉષ્મા સ્થાનાંતરણ',
          'દ્રવ / વાયુમાં કણોની ચાલથી ઉષ્મા સ્થાનાંતરણ',
          'કોઈ માધ્યમ વગર ઉષ્મા સ્થાનાંતરણ',
          'ફક્ત ઠોસમાં ઉષ્મા સ્થાનાંતરણ',
        ],
        correctAnswer: 'કોઈ માધ્યમ વગર ઉષ્મા સ્થાનાંતરણ',
        explanation:
          'વિકિરણ એ એવી પ્રક્રિયા છે જેમાં ઉષ્માનું સ્થાનાંતરણ કોઈ પણ માધ્યમ (ઠોસ, દ્રવ કે વાયુ) વગર થાય છે। ગરમ પદાર્થમાંથી ઉષ્મા ખાલી જગ્યા મારફતે સીધી અમારી પાસે પહોંચે છે।',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 2,
        question: 'વિકિરણ શૂન્યાવકાશ (ખાલી જગ્યા)માં પણ ફેલાઈ શકે છે.',
        type: 'true_false',
        options: ['સાચું', 'ખોટું'],
        correctAnswer: 'સાચું',
        explanation:
          'સાચું! આ જ વિકિરણની ખાસિયત છે। સૂર્યની ઉષ્મા 150 મિલિયન km લાંબા શૂન્યાવકાશમાંથી પસાર થઈને પૃથ્વી સુધી પહોંચે છે। તેને કોઈ માધ્યમની જરૂર પડતી નથી।',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 3,
        question: 'સૂર્યની ઉષ્મા પૃથ્વી સુધી કેવી રીતે પહોંચે છે?',
        type: 'mcq',
        options: [
          'વાયુમંડળમાં ચालन દ્વારા',
          'અવકાશમાં સંવહન પ્રવાહોથી',
          'શૂન્યાવકાશમાં વિકિરણ દ્વારા',
          'અવકાશમાં હવાના કણોથી',
        ],
        correctAnswer: 'શૂન્યાવકાશમાં વિકિરણ દ્વારા',
        explanation:
          'સૂર્યની ઉષ્મા પૃથ્વી સુધી વિકિરણ દ્વારા આવે છે। તે 150 મિલિયન km દૂરના શૂન્યાવકાશમાંથી પસાર થાય છે, જ્યાં ચालन કે સંવહન માટે કોઈ કણ હાજર નથી।',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 4,
        question: 'અમે ઉનાળામાં સફેદ કપડાં અને શિયાળામાં ગાઢ રંગના કપડાં શા માટે પહેરીએ છીએ?',
        type: 'mcq',
        options: [
          'સફેદ કપડાં ઉષ્મા શોષે છે, ગાઢ કપડાં ઉષ્મા પરાવર્તિત કરે છે',
          'સફેદ કપડાં ઉષ્મા પરાવર્તિત કરે છે, ગાઢ કપડાં ઉષ્મા શોષે છે',
          'રંગનો ઉષ્મા સાથે કોઈ સંબંધ નથી',
          'સફેદ કપડાં ઉષ્મા સારી રીતે ચલિત કરે છે',
        ],
        correctAnswer: 'સફેદ કપડાં ઉષ્મા પરાવર્તિત કરે છે, ગાઢ કપડાં ઉષ્મા શોષે છે',
        explanation:
          'હળવા રંગો (જેમ કે સફેદ) મોટા ભાગનું ઉષ્મા વિકિરણ પરાવર્તિત કરે છે, તેથી ઉનાળામાં આપણને ઠંડું રાખે છે। ગાઢ રંગો વધુ ઉષ્મા વિકિરણ શોષે છે, તેથી શિયાળામાં આપણને ગરમ રાખે છે।',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 5,
        question: 'બધા પદાર્થો પોતાની આસપાસની તરફ ઉષ્મા વિકિરણ કરે છે.',
        type: 'true_false',
        options: ['સાચું', 'ખોટું'],
        correctAnswer: 'સાચું',
        explanation:
          'સાચું! દરેક પદાર્થ કંઈક ઉષ્મા વિકિરણ કરે છે। ચુલ્હાથી દૂર મૂકેલું ગરમ વાસણ ધીમે ધીમે ઠંડુ થઈ જાય છે કારણ કે તે આસપાસના ઠંડા પદાર્થોની તરફ ઉષ્મા વિકિરણ કરે છે। ગરમ પદાર્થ વધુ વિકિરણ કરે છે।',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 6,
        question:
          'પેમા અને પેલ્ડન અગ્નિ પાસે બેઠા હતા અને વગર સ્પર્શ્યા પણ તેમને ગરમી લાગી। આ ગરમી કઈ પ્રક્રિયાના કારણે હતી?',
        type: 'mcq',
        options: [
          'હવાના દ્વારા ચालन',
          'ખંડમાં સંવહન પ્રવાહોના કારણે',
          'અગ્નિ તરફથી આવતું વિકિરણ',
          'ભીંતોથી પરાવર્તિત ઉષ્મા',
        ],
        correctAnswer: 'અગ્નિ તરફથી આવતું વિકિરણ',
        explanation:
          'તેમને લાગેલી ગરમી વિકિરણના કારણે હતી। ઉષ્મા સીધી જ અગ્નિમાંથી તેમના શરીર સુધી હવામાંથી આવી, હવાના કણોને વધુ હલનચલનની જરૂર વગર।',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 7,
        question: 'વિકિરણ વિશે નીચેનું કયું નિવેદન ખોટું છે?',
        type: 'mcq',
        options: [
          'વિકિરણ માટે માધ્યમ જરૂરી છે',
          'વિકિરણ શૂન્યાવકાશમાં પણ જઈ શકે છે',
          'બધા પદાર્થો ઉષ્મા વિકિરણ કરે છે',
          'સૂર્યની ઉષ્મા પૃથ્વી સુધી વિકિરણ દ્વારા આવે છે',
        ],
        correctAnswer: 'વિકિરણ માટે માધ્યમ જરૂરી છે',
        explanation:
          'આ નિવેદન ખોટું છે। વિકિરણને કોઈ માધ્યમની જરૂર નથી। આ જ તેને ચાલન અને સંવહનથી અલગ બનાવે છે, જેને માધ્યમની જરૂર પડે છે।',
        difficulty: 'hard',
        points: 20,
      },
      {
        id: 8,
        question:
          'એક ગરમ ધાતુનું વાસણ ટેબલ પર મૂકેલું છે (ચુલ્હા પર નથી)। તે ધીમે ધીમે ઠંડુ થાય છે। આ ઠંડુ થવું કઈ પ્રક્રિયા/પ્રક્રિયાઓના કારણે છે?',
        type: 'mcq',
        options: [
          'ફક્ત ટેબલ તરફ ચાલન',
          'ફક્ત હવામાં સંવહન',
          'ફક્ત આસપાસની તરફ વિકિરણ',
          'ત્રણેય: ચાલન, સંવહન અને વિકિરણ',
        ],
        correctAnswer: 'ત્રણેય: ચાલન, સંવહન અને વિકિરણ',
        explanation:
          'વાસણથી ઉષ્મા ત્રણેય રીતે બહાર જાય છે: ટેબલ તરફ ચલન દ્વારા, આસપાસની હવા તરફ સંવહનથી અને ચારે તરફના પદાર્થોની તરફ વિકિરણથી। પાઠ્યપુસ્તક ખાસ કરીને વિકિરણ પર ભાર મૂકે છે।',
        difficulty: 'hard',
        points: 20,
      },
      {
        id: 9,
        question: 'ધુપમાં કપડાં વધારે ઝડપથી પણા (સૂખા) થઈ જાય છે કારણ કે:',
        type: 'mcq',
        options: [
          'પવન પાણી ઉડાવી નાખે છે',
          'સૂર્યનું વિકિરણ પાણીના કણોને ગરમ કરીને ઝડપી બાષ્પીભવન કરાવે છે',
          'હવા ઉષ્મા ચલીત કરી કપડાંને ગરમ કરે છે',
          'સૂર્યપ્રકાશ પાણી શોષી લે છે',
        ],
        correctAnswer: 'સૂર્યનું વિકિરણ પાણીના કણોને ગરમ કરીને ઝડપી બાષ્પીભવન કરાવે છે',
        explanation:
          'સૂર્યનું વિકિરણ કપડાંમાં રહેલા પાણીને ગરમ કરે છે, જેના કારણે જલકણો ઝડપથી હલવા લાગે છે અને વધુ ઝડપથી બાષ્પીભવન થાય છે। ઉષ્મા અવકાશ અને હવામાંથી પસાર થઈ વિકિરણ દ્વારા કપડાં સુધી પહોંચે છે।',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: 10,
        question: 'ઉષ્મા સ્થાનાંતરણની અલગ અલગ રીતો એક સાથે કામ કરી શકે છે।',
        type: 'true_false',
        options: ['સાચું', 'ખોટું'],
        correctAnswer: 'સાચું',
        explanation:
          'સાચું! જ્યારે આપણે વાસણમાં પાણી ગરમ કરીએ ત્યારે: ચાલનથી ઉષ્મા ચુલ્હાથી વાસણ સુધી જાય છે, સંવહનથી પાણી ગરમ થાય છે અને વિકિરણથી આપણને જ્વાળા પાસેઊષ્મા અનુભવાય છે। ત્રણેય રીતો એકસાથે કાર્ય કરે છે।',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: 11,
        question: 'દરેક ઉષ્મા સ્થાનાંતરણ પ્રક્રિયાને તેના મુખ્ય લક્ષણ સાથે જોડો:',
        type: 'match',
        options: [
          'ચાલન|કણો પોતાની જગ્યા છોડ્યા વગર પડોશી કણોને ઉષ્મા આપે છે',
          'સંવહન|કણો સ્વયં ચાલીને ઉષ્માને સાથે લઈ જાય છે',
          'વિકિરણ|કોઈ માધ્યમ વગર, શૂન્યાવકાશમાં પણ કાર્ય કરે છે',
          'બધા|તાપમાનમાં તફાવત (તાપાંત્ર) જરૂરી છે',
        ],
        correctAnswer: {
          ચાલન: 'કણો પોતાની જગ્યા છોડ્યા વગર પડોશી કણોને ઉષ્મા આપે છે',
          સંવહન: 'કણો સ્વયં ચાલીને ઉષ્માને સાથે લઈ જાય છે',
          વિકિરણ: 'કોઈ માધ્યમ વગર, શૂન્યાવકાશમાં પણ કાર્ય કરે છે',
          બધા: 'તાપમાનમાં તફાવત (તાપાંત્ર) જરૂરી છે',
        },
        explanation:
          'દરેક ઉષ્મા સ્થાનાંતરણ પ્રક્રીયાની પોતાની ખાસિયત હોય છે। વિકિરણની સૌથી મોટી ખાસિયત એ છે કે તેને કોઈ માધ્યમની જરૂર નથી – આ કારણે જ સૂર્યની ઊર્જા અમારાં સુધી પહોંચી શકે છે।',
        difficulty: 'hard',
        points: 25,
      },
      {
        id: 12,
        question: 'સોલાર કુકર વિશે આવેલા આ નિવેદનોને યોગ્ય ક્રમમાં મૂકો (શરૂઆતથી અંત સુધી):',
        type: 'sequence',
        options: [
          'સૂર્યપ્રકાશ વિકિરણ સ્વરૂપે અવકાશમાંથી પૃથ્વી સુધી પહોંચે છે',
          'આઈના / પ્રતિબિંબ દર્પણો સૂર્યપ્રકાશને પરાવર્તિત અને એકત્રિત કરે છે',
          'એકત્રિત થયેલ વિકિરણથી રસોઈનું વાસણ ગરમ થાય છે',
          'વાસણમાં રહેલું ખોરાક તૈયાર થઈ જાય છે',
          'આ બધું ઉષ્મા સ્થાનાંતરણ માટે કોઈ માધ્યમ વગર થાય છે!',
        ],
        correctAnswer: [
          'સૂર્યપ્રકાશ વિકિરણ સ્વરૂપે અવકાશમાંથી પૃથ્વી સુધી પહોંચે છે',
          'આઈના / પ્રતિબિંબ દર્પણો સૂર્યપ્રકાશને પરાવર્તિત અને એકત્રિત કરે છે',
          'એકત્રિત થયેલ વિકિરણથી રસોઈનું વાસણ ગરમ થાય છે',
          'વાસણમાં રહેલું ખોરાક તૈયાર થઈ જાય છે',
          'આ બધું ઉષ્મા સ્થાનાંતરણ માટે કોઈ માધ્યમ વગર થાય છે!',
        ],
        explanation:
          'સોલાર કુકર વિકિરણનું ઉત્તમ ઉદાહરણ છે: સૂર્યની ઊર્જા શૂન્યાવકાશમાંથી આવી, દર્પણોથી એકત્રિત થાય છે અને વાસણને ગરમ કરીને ખોરાક રાંધે છે – આ બધું ફક્ત વિકિરણ દ્વારા જ થાય છે।',
        difficulty: 'hard',
        points: 25,
      },
    ],
  },
};

const RadiationPracticeMode: React.FC<RadiationPracticeModeProps> = ({ props }) => {
  const { language: contextLanguage } = useLanguage();
  const language: LanguageCode = (props?.language || contextLanguage || 'en') as LanguageCode;
  const t = translations[language] || translations.en;
  const QUESTIONS: Question[] =
    t.questions.length > 0 ? t.questions : translations.en.questions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [matchPairs, setMatchPairs] = useState<{ [key: string]: string }>({});
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isAnswered = answeredQuestions.has(currentQuestion.id);
  const isCorrect = correctAnswers.has(currentQuestion.id);

  const checkAnswer = () => {
    let correct = false;

    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false') {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'match') {
      const correctMatch = currentQuestion.correctAnswer as { [key: string]: string };
      correct = Object.keys(correctMatch).every(key => matchPairs[key] === correctMatch[key]);
    } else if (currentQuestion.type === 'sequence') {
      const correctSeq = currentQuestion.correctAnswer as string[];
      correct = sequenceOrder.length === correctSeq.length && 
                sequenceOrder.every((item, index) => item === correctSeq[index]);
    }

    if (correct && !answeredQuestions.has(currentQuestion.id)) {
      setScore(score + currentQuestion.points);
      setCorrectAnswers(new Set([...correctAnswers, currentQuestion.id]));
    }

    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.id]));
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestion();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer('');
    setMatchPairs({});
    setSequenceOrder([]);
    setShowFeedback(false);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setScore(0);
    resetQuestion();
  };

  const moveSequenceItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sequenceOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      setSequenceOrder(newOrder);
    }
  };

  const totalPoints = QUESTIONS.reduce((sum, q) => sum + q.points, 0);
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const allQuestionsAnswered = answeredQuestions.size === QUESTIONS.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (t.difficultyLabels) {
      return t.difficultyLabels[difficulty];
    }
    return difficulty.toUpperCase();
  };

  const getGrade = () => {
    if (percentage >= 80) return { grade: 'A', message: t.gradeExcellent, color: 'text-green-600' };
    if (percentage >= 60) return { grade: 'B', message: t.gradeGood, color: 'text-blue-600' };
    return { grade: 'C', message: t.gradeKeepPracticing, color: 'text-orange-600' };
  };

  React.useEffect(() => {
    if (currentQuestion.type === 'sequence' && sequenceOrder.length === 0 && currentQuestion.options) {
      setSequenceOrder([...currentQuestion.options]);
    }
  }, [currentQuestion, sequenceOrder.length]);

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{t.headerTitle}</h1>
              <p className="text-orange-100 text-xs sm:text-sm">{t.headerSubtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold">{score}</div>
            <div className="text-xs sm:text-sm text-orange-100">{t.pointsLabel}</div>
          </div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-full h-2 sm:h-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${(answeredQuestions.size / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <div className="text-xs sm:text-sm text-orange-100 mt-2 text-center sm:text-left">
          {t.progressLabel(answeredQuestions.size, QUESTIONS.length)}
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4 sm:p-6 md:p-8">
        {!allQuestionsAnswered ? (
          <>
            <div className="mb-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-xl sm:text-2xl font-bold text-orange-600">
                    {t.questionLabel(currentQuestion.id)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {getDifficultyLabel(currentQuestion.difficulty)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
                    {currentQuestion.points} {t.pointsLabel}
                  </span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                {currentQuestion.question}
              </h2>

              {/* MCQ and True/False */}
              {(currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false') && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !isAnswered && setSelectedAnswer(option)}
                      disabled={isAnswered}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        selectedAnswer === option
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      } ${isAnswered ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === option ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                        }`}>
                          {selectedAnswer === option && <div className="w-3 h-3 bg-white rounded-full" />}
                        </div>
                        <span className="font-medium text-gray-700">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Match */}
              {currentQuestion.type === 'match' && (
                <div className="space-y-4">
                  {currentQuestion.options?.map((pair, index) => {
                    const [left] = pair.split('|');
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1 p-3 bg-orange-50 rounded-lg border border-orange-200 font-medium text-gray-700">
                          {left}
                        </div>
                        <div className="text-orange-500 font-bold">→</div>
                        <select
                          value={matchPairs[left] || ''}
                          onChange={(e) => setMatchPairs({ ...matchPairs, [left]: e.target.value })}
                          disabled={isAnswered}
                          className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          <option value="">{t.selectAnswerPlaceholder}</option>
                          {currentQuestion.options?.map((p, i) => (
                            <option key={i} value={p.split('|')[1]}>
                              {p.split('|')[1]}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sequence */}
              {currentQuestion.type === 'sequence' && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <AlertCircle className="inline w-4 h-4 mr-2" />
                    {t.arrangeSequenceHint}
                  </div>
                  {sequenceOrder.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveSequenceItem(index, 'up')}
                          disabled={index === 0 || isAnswered}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveSequenceItem(index, 'down')}
                          disabled={index === sequenceOrder.length - 1 || isAnswered}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ▼
                        </button>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 font-medium text-gray-700">{item}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`mb-6 p-6 rounded-xl border-2 ${
                isCorrect
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <div className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? t.correctFeedback : t.incorrectFeedback}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition text-sm sm:text-base"
              >
                <ChevronLeft className="w-5 h-5" />
                {t.previous}
              </button>

              {!showFeedback ? (
                <button
                  onClick={checkAnswer}
                  disabled={
                    (currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false') && !selectedAnswer ||
                    currentQuestion.type === 'match' && Object.keys(matchPairs).length < (currentQuestion.options?.length || 0) ||
                    isAnswered
                  }
                  className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-700 hover:to-red-700 transition text-sm sm:text-base"
                >
                  {t.submitAnswer}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === QUESTIONS.length - 1}
                  className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-700 hover:to-red-700 transition text-sm sm:text-base"
                >
                  {t.next}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        ) : (
          /* Final Summary */
          <div className="text-center py-8">
            <div className="mb-6">
              <Award className="w-24 h-24 mx-auto text-orange-500 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.finalTitle}</h2>
              <p className="text-gray-600">{t.finalSubtitle}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8 border-2 border-orange-200">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-4xl font-bold text-orange-600">{score}</div>
                  <div className="text-sm text-gray-600">{t.totalPoints}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">{percentage}%</div>
                  <div className="text-sm text-gray-600">{t.scoreLabel}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600">{correctAnswers.size}/{QUESTIONS.length}</div>
                  <div className="text-sm text-gray-600">{t.correctLabel}</div>
                </div>
              </div>

              <div className={`text-2xl font-bold ${getGrade().color}`}>
                {t.gradeLabel}: {getGrade().grade} - {getGrade().message}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg text-blue-900 mb-3">{t.keyRemindersTitle}</h3>
              <ul className="text-left text-gray-700 space-y-2">
                {t.keyReminders.map((reminder, index) => (
                  <li key={index}>✓ {reminder}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 px-8 py-4 mx-auto bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              {t.restartQuiz}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadiationPracticeMode;
