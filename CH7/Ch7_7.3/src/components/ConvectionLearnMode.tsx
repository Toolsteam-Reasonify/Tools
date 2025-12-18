import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Sun, Radio } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode, getFontFamilyForLanguage } from '../i18n/radiationTranslations';

interface RadiationLearnModeProps {
  props?: {
    width?: number;
    height?: number;
    data?: BaseDataInterface;
    steps?: StepDataInterface[];
    language?: LanguageCode;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface RadiationWave {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  maxRadius: number;
}

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
}

interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: 'intro' | 'explanation' | 'practice' | 'real_world';
  animationData?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface LearnStepText {
  id: number;
  title: string;
  description: string;
}

interface LearnTranslations {
  headerTitle: string;
  headerSubtitle: string;
  stepLabel: string;
  ofLabel: string;
  stepTypeLabels: {
    intro: string;
    explanation: string;
    practice: string;
    real_world: string;
  };
  practiceBadge: string;
  realWorldBadge: string;
  controls: {
    previous: string;
    next: string;
    play: string;
    pause: string;
    reset: string;
  };
  steps: LearnStepText[];
  canvas: {
    introHotObject: string;
    introPerson: string;
    introMainLabel: string;
    introSubLabel: string;
    fireplacePema: string;
    fireplacePalden: string;
    fireplaceLabel: string;
    sunSpace: string;
    sunVacuumNote: string;
    sunLabel: string;
    earthLabel: string;
    sunDistanceNote: string;
    utensilTitle: string;
    utensilLabel: string;
    colorSunLabel: string;
    colorWhiteCloth: string;
    colorReflects: string;
    colorStaysCool: string;
    colorBlackCloth: string;
    colorAbsorbs: string;
    colorBecomesHot: string;
    comparisonConduction: string;
    comparisonNeedsDirect: string;
    comparisonContact: string;
    comparisonSolidMedium: string;
    comparisonConvection: string;
    comparisonNeedsParticles: string;
    comparisonMovement: string;
    comparisonFluidMedium: string;
    comparisonRadiation: string;
    comparisonNoMedium: string;
    comparisonNeeded: string;
    comparisonWorksVacuum: string;
    defaultTitle: string;
  };
}

interface Translations {
  en: LearnTranslations;
  hi: LearnTranslations;
  gu: LearnTranslations;
}

const translations: Translations = {
  en: {
    headerTitle: 'Topic 7.3: Radiation',
    headerSubtitle: 'Heat Transfer Without Any Medium',
    stepLabel: 'Step',
    ofLabel: 'of',
    stepTypeLabels: {
      intro: 'INTRODUCTION',
      explanation: 'EXPLANATION',
      practice: 'PRACTICE',
      real_world: 'REAL WORLD',
    },
    practiceBadge: 'Interactive Practice Mode',
    realWorldBadge: 'Real-World Application',
    controls: {
      previous: 'Previous',
      next: 'Next',
      play: 'Play',
      pause: 'Pause',
      reset: 'Reset',
    },
    steps: [
      {
        id: 1,
        title: 'What is Radiation?',
        description:
          'Radiation is the process of heat transfer that does NOT require any medium (solid, liquid, or gas). Heat travels directly from a hot object through empty space to reach us. Unlike conduction and convection, radiation can travel through vacuum!',
      },
      {
        id: 2,
        title: 'Heat from the Fireplace',
        description:
          'Remember Pema and Palden sitting around the fireplace? They felt warm even though they were not touching the fire. The heat reached them directly through radiation - traveling through the air without needing the air to move!',
      },
      {
        id: 3,
        title: "The Sun's Heat",
        description:
          'The Sun is 150 million kilometers away in space (vacuum). Yet we feel its warmth on Earth! This is radiation at work. Heat from the Sun travels through the vacuum of space to reach us - no medium needed!',
      },
      {
        id: 4,
        title: 'All Objects Radiate Heat',
        description:
          'Every object radiates heat to its surroundings. A hot utensil kept away from flame gradually cools down by radiating heat to cooler surroundings. Hotter objects radiate more heat than cooler objects.',
      },
      {
        id: 5,
        title: 'Interactive: Light vs Dark Colors',
        description:
          'Light colors REFLECT heat radiation, keeping you cool in summer. Dark colors ABSORB heat radiation, keeping you warm in winter. This is why we wear white clothes in summer and dark clothes in winter!',
      },
      {
        id: 6,
        title: 'Comparing Heat Transfer Methods',
        description:
          'Conduction needs solid contact. Convection needs particle movement in fluids. Radiation needs NO medium - it can travel through vacuum! All three can happen together, like when heating water in a pan.',
      },
    ],
    canvas: {
      introHotObject: '🔥 Hot Object',
      introPerson: '👤 Person',
      introMainLabel: 'Heat Radiation ~~~>',
      introSubLabel: '(No medium needed!)',
      fireplacePema: 'Pema',
      fireplacePalden: 'Palden',
      fireplaceLabel: 'Heat radiates in all directions',
      sunSpace: 'SPACE',
      sunVacuumNote: '(Vacuum - No Air!)',
      sunLabel: '☀️ Sun',
      earthLabel: '🌍 Earth',
      sunDistanceNote: 'Heat radiation travels 150 million km!',
      utensilTitle: 'Hot Utensil',
      utensilLabel: 'Radiating heat to surroundings',
      colorSunLabel: '☀️ Sun Radiation',
      colorWhiteCloth: 'White Cloth',
      colorReflects: 'REFLECTS heat ❄️',
      colorStaysCool: 'Stays Cool',
      colorBlackCloth: 'Black Cloth',
      colorAbsorbs: 'ABSORBS heat 🔥',
      colorBecomesHot: 'Becomes Hot',
      comparisonConduction: 'CONDUCTION',
      comparisonNeedsDirect: 'Needs direct',
      comparisonContact: 'contact',
      comparisonSolidMedium: '(Solid medium)',
      comparisonConvection: 'CONVECTION',
      comparisonNeedsParticles: 'Needs particle',
      comparisonMovement: 'movement',
      comparisonFluidMedium: '(Fluid medium)',
      comparisonRadiation: 'RADIATION',
      comparisonNoMedium: 'NO medium',
      comparisonNeeded: 'needed!',
      comparisonWorksVacuum: '(Works in vacuum)',
      defaultTitle: 'Radiation Animation',
    },
  },
  hi: {
    headerTitle: 'विषय 7.3: विकिरण',
    headerSubtitle: 'कोई माध्यम बिना ऊष्मा का स्थानांतरण',
    stepLabel: 'चरण',
    ofLabel: 'में से',
    stepTypeLabels: {
      intro: 'परिचय',
      explanation: 'व्याख्या',
      practice: 'अभ्यास',
      real_world: 'वास्तविक जीवन',
    },
    practiceBadge: 'इंटरैक्टिव अभ्यास मोड',
    realWorldBadge: 'वास्तविक जीवन में उपयोग',
    controls: {
      previous: 'पिछला',
      next: 'अगला',
      play: 'चलाएँ',
      pause: 'रोकें',
      reset: 'रीसेट करें',
    },
    steps: [
      {
        id: 1,
        title: 'विकिरण क्या है?',
        description:
          'विकिरण ऊष्मा स्थानांतरण की वह प्रक्रिया है जिसे किसी माध्यम (ठोस, तरल या गैस) की आवश्यकता नहीं होती। ऊष्मा सीधे एक गर्म वस्तु से खाली स्थान के माध्यम से हम तक पहुँचती है। चालन और संवहन के विपरीत, विकिरण निर्वात से होकर यात्रा कर सकता है!',
      },
      {
        id: 2,
        title: 'अंगीठी से ऊष्मा',
        description:
          'क्या आपको याद है पेमा और पेल्डन अंगीठी के चारों ओर बैठे थे? उन्हें गर्मी महसूस हुई भले ही वे आग को छू नहीं रहे थे। ऊष्मा सीधे विकिरण के माध्यम से उन तक पहुँची - हवा से होकर यात्रा करते हुए बिना हवा को हिलाने की आवश्यकता के!',
      },
      {
        id: 3,
        title: 'सूर्य की ऊष्मा',
        description:
          'सूर्य अंतरिक्ष में 150 मिलियन किलोमीटर दूर है (निर्वात)। फिर भी हम पृथ्वी पर इसकी गर्मी महसूस करते हैं! यह विकिरण का काम है। सूर्य से ऊष्मा निर्वात अंतरिक्ष से होकर हम तक पहुँचती है - किसी माध्यम की आवश्यकता नहीं!',
      },
      {
        id: 4,
        title: 'सभी वस्तुएँ ऊष्मा का विकिरण करती हैं',
        description:
          'हर वस्तु अपने आस-पास में ऊष्मा का विकिरण करती है। आग से दूर रखा गया गर्म बर्तन धीरे-धीरे ठंडा होता है, अपने आस-पास के ठंडे वातावरण में ऊष्मा का विकिरण करके। गर्म वस्तुएँ ठंडी वस्तुओं की तुलना में अधिक ऊष्मा का विकिरण करती हैं।',
      },
      {
        id: 5,
        title: 'इंटरैक्टिव: हल्के बनाम गहरे रंग',
        description:
          'हल्के रंग ऊष्मा विकिरण को परावर्तित करते हैं, गर्मी में आपको ठंडा रखते हैं। गहरे रंग ऊष्मा विकिरण को अवशोषित करते हैं, सर्दी में आपको गर्म रखते हैं। इसीलिए हम गर्मी में सफेद कपड़े और सर्दी में गहरे कपड़े पहनते हैं!',
      },
      {
        id: 6,
        title: 'ऊष्मा स्थानांतरण विधियों की तुलना',
        description:
          'चालन को ठोस संपर्क चाहिए। संवहन को तरल पदार्थों में कणों की गति चाहिए। विकिरण को कोई माध्यम नहीं चाहिए - यह निर्वात से होकर यात्रा कर सकता है! तीनों एक साथ हो सकते हैं, जैसे कि पैन में पानी गर्म करते समय।',
      },
    ],
    canvas: {
      introHotObject: '🔥 गर्म वस्तु',
      introPerson: '👤 व्यक्ति',
      introMainLabel: 'ऊष्मा विकिरण ~~~>',
      introSubLabel: '(किसी माध्यम की आवश्यकता नहीं!)',
      fireplacePema: 'पेमा',
      fireplacePalden: 'पेल्डन',
      fireplaceLabel: 'ऊष्मा चारों दिशाओं में फैलती है',
      sunSpace: 'अंतरिक्ष',
      sunVacuumNote: '(निर्वात - कोई वायु नहीं!)',
      sunLabel: '☀️ सूर्य',
      earthLabel: '🌍 पृथ्वी',
      sunDistanceNote: 'ऊष्मा विकिरण 150 मिलियन km की दूरी तय करता है!',
      utensilTitle: 'गर्म बर्तन',
      utensilLabel: 'आस-पास में ऊष्मा का विकिरण',
      colorSunLabel: '☀️ सूर्य का विकिरण',
      colorWhiteCloth: 'सफेद कपड़ा',
      colorReflects: 'ऊष्मा परावर्तित करता है ❄️',
      colorStaysCool: 'ठंडा रहता है',
      colorBlackCloth: 'काला कपड़ा',
      colorAbsorbs: 'ऊष्मा अवशोषित करता है 🔥',
      colorBecomesHot: 'गरम हो जाता है',
      comparisonConduction: 'चालन',
      comparisonNeedsDirect: 'सीधे संपर्क',
      comparisonContact: 'की आवश्यकता',
      comparisonSolidMedium: '(ठोस माध्यम)',
      comparisonConvection: 'संवहन',
      comparisonNeedsParticles: 'कणों की',
      comparisonMovement: 'गति चाहिए',
      comparisonFluidMedium: '(तरल / गैस माध्यम)',
      comparisonRadiation: 'विकिरण',
      comparisonNoMedium: 'कोई माध्यम',
      comparisonNeeded: 'नहीं चाहिए!',
      comparisonWorksVacuum: '(निर्वात में भी काम करता है)',
      defaultTitle: 'विकिरण एनीमेशन',
    },
  },
  gu: {
    headerTitle: 'વિષય 7.3: વિકિરણ',
    headerSubtitle: 'માધ્યમ વિના ઉષ્મા સ્થાનાંતરણ',
    stepLabel: 'પગલું',
    ofLabel: 'માંથી',
    stepTypeLabels: {
      intro: 'પરિચય',
      explanation: 'સમજાણ',
      practice: 'અભ્યાસ',
      real_world: 'વાસ્તવિક જીવન',
    },
    practiceBadge: 'ઇન્ટરેક્ટિવ અભ્યાસ મોડ',
    realWorldBadge: 'વાસ્તવિક જીવનમાં ઉપયોગ',
    controls: {
      previous: 'પાછલું',
      next: 'આગલું',
      play: 'ચાલુ કરો',
      pause: 'રોકો',
      reset: 'રીસેટ કરો',
    },
    steps: [
      {
        id: 1,
        title: 'વિકિરણ શું છે?',
        description:
          'વિકિરણ એ ઉષ્મા સ્થાનાંતરણની પ્રક્રિયા છે જેને કોઈ માધ્યમ (ઘન, પ્રવાહી અથવા વાયુ) ની જરૂર પડતી નથી. ઉષ્મા સીધી ગરમ વસ્તુથી ખાલી જગ્યામાંથી આપણા સુધી પહોંચે છે. ચાલન અને સંવહનથી વિપરીત, વિકિરણ શૂન્યાવકાશમાંથી પસાર થઈ શકે છે!',
      },
      {
        id: 2,
        title: 'ચૂલામાંથી ઉષ્મા',
        description:
          'યાદ છે પેમા અને પેલ્ડન ચૂલાની આસપાસ બેઠા હતા? તેમને ગરમી લાગી હતી ભલે તેઓ આગને સ્પર્શ ન કરતા હોય. ઉષ્મા સીધી વિકિરણ દ્વારા તેમના સુધી પહોંચી - હવામાંથી પસાર થતી બિના હવાને ખસેડવાની જરૂર પડ્યા વગર!',
      },
      {
        id: 3,
        title: 'સૂર્યની ઉષ્મા',
        description:
          'સૂર્ય અવકાશમાં 150 મિલિયન કિલોમીટર દૂર છે (શૂન્યાવકાશ). છતાં આપણે પૃથ્વી પર તેની ગરમી અનુભવીએ છીએ! આ વિકિરણનું કામ છે. સૂર્યની ઉષ્મા શૂન્યાવકાશ અવકાશમાંથી પસાર થઈ આપણા સુધી પહોંચે છે - કોઈ માધ્યમની જરૂર નથી!',
      },
      {
        id: 4,
        title: 'બધી વસ્તુઓ ઉષ્માનો વિકિરણ કરે છે',
        description:
          'દરેક વસ્તુ પોતાની આસપાસ ઉષ્માનો વિકિરણ કરે છે. આગથી દૂર રાખેલું ગરમ વાસણ ધીમે ધીમે ઠંડું થાય છે, પોતાની આસપાસના ઠંડા વાતાવરણમાં ઉષ્માનો વિકિરણ કરીને. ગરમ વસ્તુઓ ઠંડી વસ્તુઓ કરતાં વધુ ઉષ્માનો વિકિરણ કરે છે.',
      },
      {
        id: 5,
        title: 'ઇન્ટરેક્ટિવ: હળવા વિરુદ્ધ ગાઢ રંગો',
        description:
          'હળવા રંગો ઉષ્મા વિકિરણને પરાવર્તિત કરે છે, ઉનાળામાં તમને ઠંડક આપે છે. ગાઢ રંગો ઉષ્મા વિકિરણને શોષે છે, શિયાળામાં તમને ગરમી આપે છે. તેથી જ આપણે ઉનાળામાં સફેદ કપડાં અને શિયાળામાં ગાઢ કપડાં પહેરીએ છીએ!',
      },
      {
        id: 6,
        title: 'ઉષ્મા સ્થાનાંતરણ પદ્ધતિઓની તુલના',
        description:
          'ચાલનને ઘન સંપર્ક જોઈએ. સંવહનને પ્રવાહીમાં કણોની ગતિ જોઈએ. વિકિરણને કોઈ માધ્યમ જોઈએ નથી - તે શૂન્યાવકાશમાંથી પસાર થઈ શકે છે! ત્રણેય એક સાથે થઈ શકે છે, જેમ કે પાનમાં પાણી ગરમ કરતી વખતે.',
      },
    ],
    canvas: {
      introHotObject: '🔥 ગરમ વસ્તુ',
      introPerson: '👤 વ્યક્તિ',
      introMainLabel: 'ઉષ્મા વિકિરણ ~~~>',
      introSubLabel: '(કોઈ માધ્યમની જરૂર નથી!)',
      fireplacePema: 'પેમા',
      fireplacePalden: 'પેલ્ડન',
      fireplaceLabel: 'ઉષ્મા ચારેય દિશામાં ફેલાય છે',
      sunSpace: 'અવકાશ',
      sunVacuumNote: '(શૂન્યાવકાશ - હવા નથી!)',
      sunLabel: '☀️ સૂર્ય',
      earthLabel: '🌍 પૃથ્વી',
      sunDistanceNote: 'ઉષ્મા વિકિરણ 150 મિલિયન km સુધી પહોંચે છે!',
      utensilTitle: 'ગરમ વાસણ',
      utensilLabel: 'આસપાસ ઉષ્મા છૂટે છે',
      colorSunLabel: '☀️ સૂર્યનું વિકિરણ',
      colorWhiteCloth: 'સફેદ કપડું',
      colorReflects: 'ઉષ્મા પરાવર્તિત કરે છે ❄️',
      colorStaysCool: 'ઠંડુ રહે છે',
      colorBlackCloth: 'કાળું કપડું',
      colorAbsorbs: 'ઉષ્મા શોષે છે 🔥',
      colorBecomesHot: 'ગરમ बनी જાય છે',
      comparisonConduction: 'ચાલન',
      comparisonNeedsDirect: 'સિધો સંપર્ક',
      comparisonContact: 'જરૂરી છે',
      comparisonSolidMedium: '(ઠોસ માધ્યમ)',
      comparisonConvection: 'સંવહન',
      comparisonNeedsParticles: 'કણોની',
      comparisonMovement: 'ચળવળ જોઈએ',
      comparisonFluidMedium: '(દ્રવ / વાયુ માધ્યમ)',
      comparisonRadiation: 'વિકિરણ',
      comparisonNoMedium: 'કોઈ માધ્યમ',
      comparisonNeeded: 'જરૂર નથી!',
      comparisonWorksVacuum: '(શૂન્યાવકાશમાં પણ કામ કરે છે)',
      defaultTitle: 'વિકિરણ એનિમેશન',
    },
  },
};

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "What is Radiation?",
    description: "Radiation is the process of heat transfer that does NOT require any medium (solid, liquid, or gas). Heat travels directly from a hot object through empty space to reach us. Unlike conduction and convection, radiation can travel through vacuum!",
    type: 'intro',
    animationData: { experiment: 'intro' }
  },
  {
    id: 2,
    title: "Heat from the Fireplace",
    description: "Remember Pema and Palden sitting around the fireplace? They felt warm even though they weren't touching the fire. The heat reached them directly through radiation - traveling through the air without needing the air to move!",
    type: 'explanation',
    animationData: { experiment: 'fireplace' }
  },
  {
    id: 3,
    title: "The Sun's Heat",
    description: "The Sun is 150 million kilometers away in space (vacuum). Yet we feel its warmth on Earth! This is radiation at work. Heat from the Sun travels through the vacuum of space to reach us - no medium needed!",
    type: 'explanation',
    animationData: { experiment: 'sun_heat' }
  },
  {
    id: 4,
    title: "All Objects Radiate Heat",
    description: "Every object radiates heat to its surroundings. A hot utensil kept away from flame gradually cools down by radiating heat to cooler surroundings. Hotter objects radiate more heat than cooler objects.",
    type: 'explanation',
    animationData: { experiment: 'utensil_cooling' }
  },
  {
    id: 5,
    title: "Interactive: Light vs Dark Colors",
    description: "Light colors REFLECT heat radiation, keeping you cool in summer. Dark colors ABSORB heat radiation, keeping you warm in winter. This is why we wear white clothes in summer and dark clothes in winter!",
    type: 'practice',
    animationData: { experiment: 'color_absorption' }
  },
  {
    id: 6,
    title: "Comparing Heat Transfer Methods",
    description: "Conduction needs solid contact. Convection needs particle movement in fluids. Radiation needs NO medium - it can travel through vacuum! All three can happen together, like when heating water in a pan.",
    type: 'explanation',
    animationData: { experiment: 'comparison' }
  }
];

const RadiationLearnMode: React.FC<RadiationLearnModeProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext
}) => {
  const { language: contextLanguage } = useLanguage();
  const language: LanguageCode = (props.language || contextLanguage || 'en') as LanguageCode;
  const t = translations[language] || translations.en;
  const width = props.width || 800;
  const height = props.height || 500;
  const steps = props.steps || DEFAULT_STEPS;
  const stepTexts: LearnStepText[] =
    t.steps.length === DEFAULT_STEPS.length ? t.steps : translations.en.steps;
  const canvasFontFamily =
    language === 'hi'
      ? 'Noto Sans Devanagari'
      : language === 'gu'
      ? 'Noto Sans Gujarati'
      : 'Inter';

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [, setAnimationFrame] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [radiationWaves, setRadiationWaves] = useState<RadiationWave[]>([]);
  const [time, setTime] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(Date.now());

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: steps.length,
        isPaused: !isPlaying
      });
    }
  }, [currentStepIndex, steps.length, isPlaying, setStepDetails]);

  useEffect(() => {
    if (!isPlaying || stopAutoNext) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, props.data?.autoPlayDuration || 8000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, stopAutoNext, steps.length, props.data?.autoPlayDuration]);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastFrameTime.current) / 1000; // Convert to seconds
      lastFrameTime.current = now;

      setTime(prev => prev + deltaTime);
      setAnimationFrame(prev => prev + 1);
      
      // Update particles
      updateParticles(deltaTime);
      updateRadiationWaves(deltaTime);
      
      drawAnimation();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      lastFrameTime.current = Date.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, particles, radiationWaves]);

  // Initialize particles for different animations
  const createFireParticles = () => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: width / 2 + (Math.random() - 0.5) * 40,
        y: height - 100,
        vx: (Math.random() - 0.5) * 1,
        vy: -2 - Math.random() * 2,
        size: 3 + Math.random() * 5,
        opacity: 1,
        color: Math.random() > 0.5 ? '#FF6347' : '#FFA500',
        life: 0,
        maxLife: 1 + Math.random() * 2
      });
    }
    return newParticles;
  };

  const updateParticles = (deltaTime: number) => {
    setParticles(prev => {
      const updated = prev.map(p => ({
        ...p,
        x: p.x + p.vx * deltaTime * 60,
        y: p.y + p.vy * deltaTime * 60,
        life: p.life + deltaTime,
        opacity: Math.max(0, 1 - (p.life / p.maxLife))
      })).filter(p => p.life < p.maxLife && p.opacity > 0.01);

      // Add new particles for continuous effects
      if (currentStep.animationData?.experiment === 'fireplace' && updated.length < 30) {
        const newP = createFireParticles().slice(0, 2);
        return [...updated, ...newP];
      }

      return updated;
    });
  };

  const updateRadiationWaves = (deltaTime: number) => {
    setRadiationWaves(prev => {
      const updated = prev.map(w => ({
        ...w,
        radius: w.radius + w.speed * deltaTime,
        opacity: Math.max(0, w.opacity - deltaTime * 0.4)
      })).filter(w => w.radius < w.maxRadius && w.opacity > 0.01);

      return updated;
    });
  };

  // Initialize particles when step changes
  useEffect(() => {
    setParticles([]);
    setRadiationWaves([]);
    setTime(0);
    
    if (currentStep.animationData?.experiment === 'fireplace') {
      setParticles(createFireParticles());
    }
  }, [currentStepIndex]);

  const drawAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    switch (currentStep.animationData?.experiment) {
      case 'intro':
        drawIntroAnimation(ctx);
        break;
      case 'fireplace':
        drawFireplaceAnimation(ctx);
        break;
      case 'sun_heat':
        drawSunHeatAnimation(ctx);
        break;
      case 'utensil_cooling':
        drawUtensilCooling(ctx);
        break;
      case 'color_absorption':
        drawColorAbsorption(ctx);
        break;
      case 'comparison':
        drawComparison(ctx);
        break;
      default:
        drawDefaultAnimation(ctx);
    }
  };

  const drawIntroAnimation = (ctx: CanvasRenderingContext2D) => {
    // Hot object on left with pulsing glow
    const pulseScale = 1 + Math.sin(time * 2) * 0.1;
    
    // Outer glow
    const outerGlow = ctx.createRadialGradient(150, height / 2, 20, 150, height / 2, 100 * pulseScale);
    outerGlow.addColorStop(0, 'rgba(255, 200, 0, 0.4)');
    outerGlow.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)');
    outerGlow.addColorStop(1, 'rgba(255, 69, 0, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(150, height / 2, 100 * pulseScale, 0, Math.PI * 2);
    ctx.fill();
    
    // Hot object
    const objectGradient = ctx.createRadialGradient(150, height / 2, 0, 150, height / 2, 60);
    objectGradient.addColorStop(0, '#FFD700');
    objectGradient.addColorStop(0.5, '#FF8C00');
    objectGradient.addColorStop(1, '#FF4500');
    ctx.fillStyle = objectGradient;
    ctx.beginPath();
    ctx.arc(150, height / 2, 60, 0, Math.PI * 2);
    ctx.fill();

    // Smooth radiation waves with sine wave pattern moving FROM hot object TO person
    const totalDistance = width - 300; // Distance from hot object (150) to person (width-150)
    
    for (let i = 0; i < 8; i++) {
      const waveSpeed = 150; // pixels per second
      const spacing = 60; // spacing between waves
      const offset = (time * waveSpeed + i * spacing) % (totalDistance + 100);
      const progress = offset / (totalDistance + 100);
      const alpha = Math.sin(progress * Math.PI) * 0.7;
      
      if (offset > totalDistance) continue; // Don't draw waves past the person
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `rgb(255, ${100 + progress * 100}, 0)`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 100, 0, 0.5)';
      
      ctx.beginPath();
      
      // Smooth sine wave moving from left (hot object) to right (person)
      const waveStartX = 150 + 70; // Start from edge of hot object
      const waveLength = 80; // Length of each wave segment
      
      for (let x = 0; x < waveLength && (waveStartX + offset + x) < width - 150; x += 3) {
        const currentX = waveStartX + offset + x;
        const localProgress = x / waveLength;
        const amplitude = 25 * (1 - progress * 0.3) * Math.sin(localProgress * Math.PI);
        const frequency = 0.15;
        const y = height / 2 + Math.sin((x + time * 100) * frequency) * amplitude;
        
        if (x === 0) {
          ctx.moveTo(currentX, y);
        } else {
          ctx.lineTo(currentX, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Person on right with subtle animation
    const personBob = Math.sin(time * 1.5) * 3;
    drawPerson(ctx, width - 150, height / 2 + 50 + personBob);

    // Heat effect particles around person
    for (let i = 0; i < 5; i++) {
      const angle = (time + i * 1.2) * 2;
      const radius = 70 + Math.sin(time * 3 + i) * 10;
      const px = width - 150 + Math.cos(angle) * radius;
      const py = height / 2 + 50 + personBob + Math.sin(angle) * radius;
      
      ctx.fillStyle = `rgba(255, 150, 0, ${0.3 * Math.sin(time * 2 + i)})`;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels with subtle animation
    const labelBob = Math.sin(time * 2) * 2;
    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.introHotObject, 150, height - 50 + labelBob);
    ctx.fillText(t.canvas.introPerson, width - 150, height - 50 - labelBob);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#FF4500';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    const arrowAlpha = 0.5 + Math.sin(time * 3) * 0.3;
    ctx.globalAlpha = arrowAlpha;
    ctx.fillText(t.canvas.introMainLabel, width / 2, 50);
    ctx.globalAlpha = 1;
    ctx.fillText(t.canvas.introSubLabel, width / 2, 75);
  };

  const drawFireplaceAnimation = (ctx: CanvasRenderingContext2D) => {
    // Fireplace
    const brickGradient = ctx.createLinearGradient(width / 2 - 80, height - 150, width / 2 + 80, height - 150);
    brickGradient.addColorStop(0, '#8B4513');
    brickGradient.addColorStop(0.5, '#A0522D');
    brickGradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = brickGradient;
    ctx.fillRect(width / 2 - 80, height - 150, 160, 150);
    
    // Fire with dynamic flames
    ctx.save();
    const fireGradient = ctx.createLinearGradient(width / 2, height - 150, width / 2, height - 60);
    fireGradient.addColorStop(0, '#FFD700');
    fireGradient.addColorStop(0.3, '#FFA500');
    fireGradient.addColorStop(0.6, '#FF6347');
    fireGradient.addColorStop(1, '#FF4500');
    ctx.fillStyle = fireGradient;
    
    // Multiple flame layers for depth
    for (let layer = 0; layer < 3; layer++) {
      ctx.globalAlpha = 0.7 - layer * 0.2;
      ctx.beginPath();
      
      for (let i = -40; i <= 40; i += 10) {
        const baseY = height - 150;
        const flameHeight = 70 + Math.sin(time * 3 + i * 0.1 + layer) * 20;
        const flickerX = Math.sin(time * 4 + i * 0.2 + layer * 2) * 5;
        const flickerY = Math.cos(time * 5 + i * 0.15 + layer * 1.5) * 8;
        
        if (i === -40) {
          ctx.moveTo(width / 2 + i, baseY);
        }
        
        // Create flame shape with bezier curves
        const controlPointHeight = flameHeight * (0.7 + layer * 0.1);
        ctx.quadraticCurveTo(
          width / 2 + i + flickerX,
          baseY - controlPointHeight + flickerY,
          width / 2 + i + 10,
          baseY
        );
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Fire particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      const particleGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      particleGradient.addColorStop(0, p.color);
      particleGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Radiation waves emanating in ALL directions (smoother with multiple frequencies)
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 18) {
      for (let i = 0; i < 6; i++) {
        const waveTime = time * 100 + i * 40;
        const offset = waveTime % 180;
        const progress = offset / 180;
        const alpha = Math.sin(progress * Math.PI) * 0.6;
        const distance = 100 + offset;
        
        const startX = width / 2;
        const startY = height - 100;
        const endX = startX + Math.cos(angle) * distance;
        const endY = startY + Math.sin(angle) * distance;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `hsl(${20 + progress * 40}, 100%, 50%)`;
        ctx.lineWidth = 4 * (1 - progress);
        ctx.lineCap = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 100, 0, 0.4)';
        
        // Draw curved radiation path
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        const controlX = startX + Math.cos(angle) * distance * 0.5;
        const controlY = startY - distance * 0.3;
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Two people sitting with subtle breathing animation
    const breathScale1 = 1 + Math.sin(time * 1.2) * 0.02;
    const breathScale2 = 1 + Math.sin(time * 1.2 + 1) * 0.02;
    
    ctx.save();
    ctx.translate(width / 2 - 150, height - 50);
    ctx.scale(breathScale1, breathScale1);
    ctx.translate(-(width / 2 - 150), -(height - 50));
    drawPerson(ctx, width / 2 - 150, height - 50);
    ctx.restore();
    
    ctx.save();
    ctx.translate(width / 2 + 150, height - 50);
    ctx.scale(breathScale2, breathScale2);
    ctx.translate(-(width / 2 + 150), -(height - 50));
    drawPerson(ctx, width / 2 + 150, height - 50);
    ctx.restore();

    // Heat shimmer effect
    for (let x = width / 2 - 100; x < width / 2 + 100; x += 20) {
      for (let y = height - 150; y > height - 300; y -= 30) {
        const shimmer = Math.sin(time * 5 + x * 0.1 + y * 0.05) * 2;
        ctx.fillStyle = `rgba(255, 200, 100, ${0.1 * (1 - (height - 150 - y) / 150)})`;
        ctx.fillRect(x + shimmer, y, 15, 25);
      }
    }

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(t.canvas.fireplacePema, width / 2 - 150, height - 20);
    ctx.fillText(t.canvas.fireplacePalden, width / 2 + 150, height - 20);
    ctx.shadowBlur = 0;
    
    const glow = 0.7 + Math.sin(time * 2) * 0.3;
    ctx.fillStyle = `rgba(255, 69, 0, ${glow})`;
    ctx.fillText(t.canvas.fireplaceLabel, width / 2, 40);
  };

  const drawSunHeatAnimation = (ctx: CanvasRenderingContext2D) => {
    // Space (black/blue) background with twinkling stars across the whole canvas
    const spaceGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      Math.max(width, height)
    );
    spaceGradient.addColorStop(0, '#020617');
    spaceGradient.addColorStop(0.5, '#020617');
    spaceGradient.addColorStop(1, '#000000');
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, width, height);

    // Twinkling stars over entire background
    for (let i = 0; i < 80; i++) {
      const starX = (i * 73) % width;
      const starY = (i * 59) % height;
      const twinkle = 0.3 + Math.abs(Math.sin(time * 2 + i * 0.5)) * 0.7;
      
      ctx.save();
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = '#FFF';
      ctx.shadowBlur = 3;
      ctx.shadowColor = '#FFF';
      ctx.beginPath();
      ctx.arc(starX, starY, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Animated sun glow (draw on top of space/stars)
    const glowPulse = 1 + Math.sin(time * 2) * 0.15;
    // Shifted sun slightly downward (y: 100 -> 140)
    const sunCenterY = 140;
    const sunGlow = ctx.createRadialGradient(150, sunCenterY, 20, 150, sunCenterY, 80 * glowPulse);
    sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
    sunGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
    sunGlow.addColorStop(1, 'rgba(255, 165, 0, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(150, sunCenterY, 80 * glowPulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun core
    const sunGradient = ctx.createRadialGradient(150, sunCenterY, 0, 150, sunCenterY, 50);
    sunGradient.addColorStop(0, '#FFFACD');
    sunGradient.addColorStop(0.5, '#FFD700');
    sunGradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(150, sunCenterY, 50, 0, Math.PI * 2);
    ctx.fill();

    // Animated sun rays with rotation
    const rayRotation = time * 0.5;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + rayRotation;
      const rayLength = 75 + Math.sin(time * 3 + i) * 5;
      const rayWidth = 4 + Math.sin(time * 4 + i * 0.5) * 1.5;
      
      ctx.save();
      ctx.strokeStyle = `rgba(255, 165, 0, ${0.8 + Math.sin(time * 2 + i) * 0.2})`;
      ctx.lineWidth = rayWidth;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 200, 0, 0.5)';
      ctx.beginPath();
      ctx.moveTo(150 + Math.cos(angle) * 55, sunCenterY + Math.sin(angle) * 55);
      ctx.lineTo(150 + Math.cos(angle) * rayLength, sunCenterY + Math.sin(angle) * rayLength);
      ctx.stroke();
      ctx.restore();
    }

    // Centered SPACE / vacuum text (shifted slightly down)
    ctx.fillStyle = '#FFF';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(t.canvas.sunSpace, width / 2, 140);
    ctx.fillText(t.canvas.sunVacuumNote, width / 2, 160);
    ctx.shadowBlur = 0;

    // Smooth radiation beams traveling through space
    const beamCount = 12;
    for (let i = 0; i < beamCount; i++) {
      const baseOffset = (time * 200 + i * 50) % (width - 350);
      const beamX = 200 + baseOffset;
      const beamProgress = baseOffset / (width - 350);
      
      // Beam head (bright)
      const headAlpha = Math.sin(beamProgress * Math.PI) * 0.9;
      // Shift beams down (y: 125 -> 145)
      const beamGradient = ctx.createLinearGradient(beamX - 30, 145, beamX + 30, 145);
      beamGradient.addColorStop(0, 'rgba(255, 200, 0, 0)');
      beamGradient.addColorStop(0.4, `rgba(255, 220, 0, ${headAlpha})`);
      beamGradient.addColorStop(0.6, `rgba(255, 180, 0, ${headAlpha})`);
      beamGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
      
      ctx.fillStyle = beamGradient;
      ctx.fillRect(beamX - 30, 140, 60, 10);
      
      // Beam glow
      ctx.save();
      ctx.globalAlpha = headAlpha * 0.3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 200, 0, 0.8)';
      ctx.fillStyle = 'rgba(255, 200, 0, 0.5)';
      ctx.fillRect(beamX - 20, 142, 40, 6);
      ctx.restore();
    }

    // Earth with atmosphere
    const earthX = width - 150;
    // Shift Earth down to align with lowered sun/beams (y: 125 -> 165)
    const earthY = 165;
    
    // Atmosphere glow
    const atmosphereGlow = ctx.createRadialGradient(earthX, earthY, 50, earthX, earthY, 75);
    atmosphereGlow.addColorStop(0, 'rgba(100, 150, 255, 0)');
    atmosphereGlow.addColorStop(0.7, 'rgba(100, 150, 255, 0.2)');
    atmosphereGlow.addColorStop(1, 'rgba(100, 150, 255, 0)');
    ctx.fillStyle = atmosphereGlow;
    ctx.beginPath();
    ctx.arc(earthX, earthY, 75, 0, Math.PI * 2);
    ctx.fill();
    
    // Earth with rotation effect
    const earthGradient = ctx.createRadialGradient(
      earthX - 15, earthY - 15, 10,
      earthX, earthY, 60
    );
    earthGradient.addColorStop(0, '#87CEEB');
    earthGradient.addColorStop(0.3, '#4169E1');
    earthGradient.addColorStop(0.6, '#228B22');
    earthGradient.addColorStop(0.8, '#1E90FF');
    earthGradient.addColorStop(1, '#000080');
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Clouds on Earth
    for (let i = 0; i < 5; i++) {
      const cloudAngle = (time * 0.2 + i * 1.2) % (Math.PI * 2);
      const cloudRadius = 45 + (i % 2) * 10;
      const cloudX = earthX + Math.cos(cloudAngle) * cloudRadius;
      const cloudY = earthY + Math.sin(cloudAngle) * cloudRadius;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels with subtle glow
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255, 200, 0, 0.8)';
    // Shifted labels down to stay close to moved objects
    ctx.fillText(t.canvas.sunLabel, 150, 220);
    ctx.shadowColor = 'rgba(0, 150, 255, 0.8)';
    ctx.fillText(t.canvas.earthLabel, earthX, 250);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#FF8C00';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    const textPulse = 0.8 + Math.sin(time * 2) * 0.2;
    ctx.globalAlpha = textPulse;
    ctx.fillText(t.canvas.sunDistanceNote, width / 2, height - 30);
    ctx.globalAlpha = 1;
  };

  const drawUtensilCooling = (ctx: CanvasRenderingContext2D) => {
    // Hot utensil with metallic sheen
    const metalGradient = ctx.createLinearGradient(width / 2 - 60, height / 2 - 40, width / 2 + 60, height / 2 + 40);
    metalGradient.addColorStop(0, '#E8E8E8');
    metalGradient.addColorStop(0.3, '#C0C0C0');
    metalGradient.addColorStop(0.5, '#A9A9A9');
    metalGradient.addColorStop(0.7, '#C0C0C0');
    metalGradient.addColorStop(1, '#D3D3D3');
    ctx.fillStyle = metalGradient;
    ctx.fillRect(width / 2 - 60, height / 2 - 40, 120, 80);
    
    // Inner pot
    const innerGradient = ctx.createLinearGradient(width / 2, height / 2 - 30, width / 2, height / 2 + 30);
    innerGradient.addColorStop(0, '#A9A9A9');
    innerGradient.addColorStop(0.5, '#808080');
    innerGradient.addColorStop(1, '#696969');
    ctx.fillStyle = innerGradient;
    ctx.fillRect(width / 2 - 50, height / 2 - 30, 100, 60);

    // Smooth temperature decay
    const coolingRate = 0.15; // Temperature drops by this per second
    const maxTemp = 100;
    const minTemp = 25;
    const temp = Math.max(minTemp, maxTemp - time * coolingRate * 10);
    const glowIntensity = (temp - minTemp) / (maxTemp - minTemp);
    
    // Multi-layered heat glow with smooth falloff
    for (let layer = 0; layer < 3; layer++) {
      const layerRadius = 80 + layer * 40;
      const layerIntensity = glowIntensity * (1 - layer * 0.25);
      const pulse = 1 + Math.sin(time * 2 + layer) * 0.1;
      
      const glowGradient = ctx.createRadialGradient(
        width / 2, height / 2, 30,
        width / 2, height / 2, layerRadius * pulse
      );
      glowGradient.addColorStop(0, `rgba(255, ${100 + layerIntensity * 100}, 0, ${layerIntensity * 0.4})`);
      glowGradient.addColorStop(0.5, `rgba(255, ${100 + layerIntensity * 50}, 0, ${layerIntensity * 0.2})`);
      glowGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Smooth expanding radiation waves
    if (glowIntensity > 0.1) {
      for (let i = 0; i < 8; i++) {
        const waveTime = time * 80 + i * 30;
        const waveRadius = (waveTime % 250) + 50;
        const waveProgress = ((waveTime % 250) / 250);
        const waveAlpha = Math.sin(waveProgress * Math.PI) * glowIntensity * 0.5;
        
        ctx.save();
        ctx.globalAlpha = waveAlpha;
        ctx.strokeStyle = `hsl(${20 - waveProgress * 20}, 100%, ${50 + waveProgress * 20}%)`;
        ctx.lineWidth = 3 * (1 - waveProgress);
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 100, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Heat shimmer particles rising
    if (glowIntensity > 0.2) {
      for (let i = 0; i < 10; i++) {
        const shimmerX = width / 2 + (Math.sin(time * 2 + i) * 40);
        const shimmerY = height / 2 - ((time * 30 + i * 20) % 100);
        const shimmerAlpha = glowIntensity * (1 - ((time * 30 + i * 20) % 100) / 100);
        
        ctx.save();
        ctx.globalAlpha = shimmerAlpha * 0.4;
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(shimmerX, shimmerY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Temperature display with smooth number animation
    const displayTemp = Math.round(temp);
    const tempColor = temp > 60 ? '#FF4500' : temp > 40 ? '#FF8C00' : '#000';
    
    ctx.save();
    ctx.fillStyle = tempColor;
    ctx.font = `bold 32px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 8;
    ctx.shadowColor = temp > 50 ? 'rgba(255, 100, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(`${displayTemp}°C`, width / 2, height / 2 + 15);
    ctx.restore();

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.utensilTitle, width / 2, 50);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#FF4500';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    const labelPulse = 0.7 + Math.sin(time * 2) * 0.3;
    ctx.globalAlpha = labelPulse * glowIntensity;
    ctx.fillText(t.canvas.utensilLabel, width / 2, height - 30);
    ctx.globalAlpha = 1;
  };

  const drawColorAbsorption = (ctx: CanvasRenderingContext2D) => {
    // Animated sun with corona
    const coronaPulse = 1 + Math.sin(time * 1.5) * 0.1;
    const coronaGlow = ctx.createRadialGradient(width / 2, 80, 20, width / 2, 80, 60 * coronaPulse);
    coronaGlow.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
    coronaGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
    coronaGlow.addColorStop(1, 'rgba(255, 165, 0, 0)');
    ctx.fillStyle = coronaGlow;
    ctx.beginPath();
    ctx.arc(width / 2, 80, 60 * coronaPulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun
    const sunGradient = ctx.createRadialGradient(width / 2, 80, 0, width / 2, 80, 40);
    sunGradient.addColorStop(0, '#FFFACD');
    sunGradient.addColorStop(0.6, '#FFD700');
    sunGradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(width / 2, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    // Animated sun rays
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + time * 0.3;
      const rayPulse = Math.sin(time * 3 + i) * 0.3 + 0.7;
      
      ctx.save();
      ctx.globalAlpha = rayPulse;
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 165, 0, 0.4)';
      ctx.beginPath();
      ctx.moveTo(width / 2 + Math.cos(angle) * 45, 80 + Math.sin(angle) * 45);
      ctx.lineTo(width / 2 + Math.cos(angle) * 65, 80 + Math.sin(angle) * 65);
      ctx.stroke();
      ctx.restore();
    }

    // Smooth radiation beams coming down to white cloth
    for (let i = 0; i < 15; i++) {
      const x = 100 + i * 14;
      const beamPhase = (time * 60 + i * 10) % 160;
      const beamY = 140 + beamPhase;
      const beamProgress = beamPhase / 160;
      const beamAlpha = Math.sin(beamProgress * Math.PI) * 0.7;
      
      ctx.save();
      ctx.globalAlpha = beamAlpha;
      const beamGradient = ctx.createLinearGradient(x, beamY - 15, x, beamY + 15);
      beamGradient.addColorStop(0, 'rgba(255, 220, 0, 0)');
      beamGradient.addColorStop(0.5, 'rgba(255, 200, 0, 1)');
      beamGradient.addColorStop(1, 'rgba(255, 220, 0, 0)');
      ctx.strokeStyle = beamGradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, beamY - 15);
      ctx.lineTo(x, beamY + 15);
      ctx.stroke();
      ctx.restore();
    }

    // White cloth with fabric texture
    const whiteGradient = ctx.createLinearGradient(100, 300, 300, 450);
    whiteGradient.addColorStop(0, '#FFFFFF');
    whiteGradient.addColorStop(0.5, '#F5F5F5');
    whiteGradient.addColorStop(1, '#EBEBEB');
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(100, 300, 200, 150);
    
    // Cloth border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 300, 200, 150);

    // Reflection arrows from white cloth (smooth animation)
    for (let i = 0; i < 5; i++) {
      const x = 130 + i * 40;
      const reflectPhase = (time * 70 + i * 20) % 100;
      const reflectY = 300 - reflectPhase;
      const reflectProgress = reflectPhase / 100;
      const reflectAlpha = Math.sin(reflectProgress * Math.PI) * 0.8;
      
      ctx.save();
      ctx.globalAlpha = reflectAlpha;
      const reflectGradient = ctx.createLinearGradient(x, reflectY + 20, x, reflectY - 20);
      reflectGradient.addColorStop(0, 'rgba(255, 220, 0, 0)');
      reflectGradient.addColorStop(0.5, 'rgba(255, 200, 100, 1)');
      reflectGradient.addColorStop(1, 'rgba(255, 220, 0, 0)');
      ctx.strokeStyle = reflectGradient;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 200, 0, 0.5)';
      
      ctx.beginPath();
      ctx.moveTo(x, reflectY + 20);
      ctx.lineTo(x, reflectY - 20);
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = reflectGradient;
      ctx.beginPath();
      ctx.moveTo(x, reflectY - 20);
      ctx.lineTo(x - 6, reflectY - 10);
      ctx.lineTo(x + 6, reflectY - 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Radiation beams to black cloth
    for (let i = 0; i < 15; i++) {
      const x = width - 300 + i * 14;
      const beamPhase = (time * 60 + i * 10) % 160;
      const beamY = 140 + beamPhase;
      const beamProgress = beamPhase / 160;
      const beamAlpha = Math.sin(beamProgress * Math.PI) * 0.7;
      
      ctx.save();
      ctx.globalAlpha = beamAlpha;
      const beamGradient = ctx.createLinearGradient(x, beamY - 15, x, beamY + 15);
      beamGradient.addColorStop(0, 'rgba(255, 220, 0, 0)');
      beamGradient.addColorStop(0.5, 'rgba(255, 200, 0, 1)');
      beamGradient.addColorStop(1, 'rgba(255, 220, 0, 0)');
      ctx.strokeStyle = beamGradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, beamY - 15);
      ctx.lineTo(x, beamY + 15);
      ctx.stroke();
      ctx.restore();
    }

    // Black cloth with fabric texture
    const blackGradient = ctx.createLinearGradient(width - 300, 300, width - 100, 450);
    blackGradient.addColorStop(0, '#1A1A1A');
    blackGradient.addColorStop(0.5, '#000000');
    blackGradient.addColorStop(1, '#0A0A0A');
    ctx.fillStyle = blackGradient;
    ctx.fillRect(width - 300, 300, 200, 150);
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.strokeRect(width - 300, 300, 200, 150);

    // Heat absorption glow from black (pulsing)
    const absorbPulse = 0.8 + Math.sin(time * 2) * 0.2;
    const absorbGradient = ctx.createRadialGradient(
      width - 200, 375, 40,
      width - 200, 375, 140 * absorbPulse
    );
    absorbGradient.addColorStop(0, 'rgba(255, 100, 0, 0.5)');
    absorbGradient.addColorStop(0.5, 'rgba(255, 80, 0, 0.3)');
    absorbGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = absorbGradient;
    ctx.beginPath();
    ctx.arc(width - 200, 375, 140 * absorbPulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Heat shimmer above black cloth
    for (let i = 0; i < 8; i++) {
      const shimmerX = width - 250 + i * 20 + Math.sin(time * 3 + i) * 10;
      const shimmerY = 290 - ((time * 40 + i * 15) % 80);
      const shimmerAlpha = 1 - ((time * 40 + i * 15) % 80) / 80;
      
      ctx.save();
      ctx.globalAlpha = shimmerAlpha * 0.6;
      ctx.fillStyle = '#FF6347';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 100, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(shimmerX, shimmerY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = `bold 20px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255, 200, 0, 0.4)';
    ctx.fillText(t.canvas.colorSunLabel, width / 2, 30);
    ctx.shadowBlur = 0;
    
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.colorWhiteCloth, 200, 270);
    ctx.font = `15px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.colorReflects, 200, 470);
    ctx.fillText(t.canvas.colorStaysCool, 200, 490);
   
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.fillStyle = '#FFF';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(t.canvas.colorBlackCloth, width - 200, 270);
    ctx.font = `15px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.colorAbsorbs, width - 200, 470);
    ctx.fillText(t.canvas.colorBecomesHot, width - 200, 490);
    ctx.shadowBlur = 0;
  };

  const drawComparison = (ctx: CanvasRenderingContext2D) => {
    const boxWidth = width / 3 - 40;
    const boxHeight = height - 100;

    // CONDUCTION BOX
    ctx.fillStyle = '#FFE4E1';
    ctx.fillRect(20, 50, boxWidth, boxHeight);
    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 50, boxWidth, boxHeight);

    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.comparisonConduction, 20 + boxWidth / 2, 80);
    ctx.shadowBlur = 0;
    
    // Animated particles with heat transfer
    const particleCount = 6;
    for (let i = 0; i < particleCount; i++) {
      const baseX = 30 + i * (boxWidth - 20) / (particleCount - 1);
      const baseY = 150;
      
      // Heat intensity decreases along the chain
      const heatIntensity = Math.max(0, 1 - i / particleCount);
      const vibration = Math.sin(time * 10 + i * 0.5) * 3 * heatIntensity;
      
      const particleGradient = ctx.createRadialGradient(baseX, baseY, 0, baseX, baseY, 18);
      if (i < 2) {
        particleGradient.addColorStop(0, '#FFD700');
        particleGradient.addColorStop(0.5, '#FF6347');
        particleGradient.addColorStop(1, '#FF4500');
      } else {
        particleGradient.addColorStop(0, '#87CEEB');
        particleGradient.addColorStop(0.7, '#4682B4');
        particleGradient.addColorStop(1, '#1E90FF');
      }
      
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(baseX, baseY + vibration, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Connection lines showing contact
      if (i < particleCount - 1) {
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseX + 15, baseY + vibration);
        const nextVib = Math.sin(time * 10 + (i + 1) * 0.5) * 3 * Math.max(0, 1 - (i + 1) / particleCount);
        ctx.lineTo(baseX + (boxWidth - 20) / (particleCount - 1) - 15, baseY + nextVib);
        ctx.stroke();
      }
      
      // Heat transfer animation
      if (i < particleCount - 1) {
        const transferPhase = (time * 2 + i * 0.3) % 1;
        const transferX = baseX + 15 + transferPhase * ((boxWidth - 20) / (particleCount - 1) - 30);
        ctx.save();
        ctx.globalAlpha = Math.sin(transferPhase * Math.PI) * heatIntensity;
        ctx.fillStyle = '#FF8C00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 140, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(transferX, baseY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    ctx.fillStyle = '#333';
    ctx.font = `13px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.comparisonNeedsDirect, 20 + boxWidth / 2, 210);
    ctx.fillText(t.canvas.comparisonContact, 20 + boxWidth / 2, 230);
    ctx.fillText(t.canvas.comparisonSolidMedium, 20 + boxWidth / 2, 250);

    // CONVECTION BOX
    ctx.fillStyle = '#E0F2F7';
    ctx.fillRect(width / 3 + 10, 50, boxWidth, boxHeight);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 3 + 10, 50, boxWidth, boxHeight);

    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.comparisonConvection, width / 3 + 10 + boxWidth / 2, 80);
    ctx.shadowBlur = 0;
    
    // Circular convection current animation
    const centerX = width / 3 + 10 + boxWidth / 2;
    const centerY = 150;
    const radius = 50;
    
    // Draw flowing particles in circular path
    for (let i = 0; i < 8; i++) {
      const angle = (time * 1.5 + i * Math.PI / 4) % (Math.PI * 2);
      const particleX = centerX + Math.cos(angle) * radius;
      const particleY = centerY + Math.sin(angle) * radius * 0.6; // Elliptical path
      
      const isHot = angle < Math.PI; // Top half is hot
      const particleGradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 8);
      
      if (isHot) {
        particleGradient.addColorStop(0, '#FF6347');
        particleGradient.addColorStop(1, 'rgba(255, 99, 71, 0)');
      } else {
        particleGradient.addColorStop(0, '#4682B4');
        particleGradient.addColorStop(1, 'rgba(70, 130, 180, 0)');
      }
      
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Convection current path
    ctx.strokeStyle = 'rgba(33, 150, 243, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Direction arrows
    drawArrowHead(ctx, centerX, centerY - radius * 0.6, 0, '#FF6347');
    drawArrowHead(ctx, centerX + radius, centerY, Math.PI / 2, '#4682B4');
    drawArrowHead(ctx, centerX, centerY + radius * 0.6, Math.PI, '#4682B4');
    drawArrowHead(ctx, centerX - radius, centerY, -Math.PI / 2, '#FF6347');

    ctx.fillStyle = '#333';
    ctx.font = `13px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.comparisonNeedsParticles, centerX, 220);
    ctx.fillText(t.canvas.comparisonMovement, centerX, 240);
    ctx.fillText(t.canvas.comparisonFluidMedium, centerX, 260);

    // RADIATION BOX
    ctx.fillStyle = '#FFF9E6';
    ctx.fillRect(width * 2/3, 50, boxWidth, boxHeight);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 3;
    ctx.strokeRect(width * 2/3, 50, boxWidth, boxHeight);

    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.comparisonRadiation, width * 2/3 + boxWidth / 2, 80);
    ctx.shadowBlur = 0;
    
    // Hot source on left
    const sourceX = width * 2/3 + 30;
    const sourceY = 150;
    
    const sourceGradient = ctx.createRadialGradient(sourceX, sourceY, 5, sourceX, sourceY, 20);
    sourceGradient.addColorStop(0, '#FFD700');
    sourceGradient.addColorStop(0.7, '#FF8C00');
    sourceGradient.addColorStop(1, '#FF6347');
    ctx.fillStyle = sourceGradient;
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Smooth wavy radiation lines traveling
    for (let i = 0; i < 6; i++) {
      const wavePhase = (time * 100 + i * 25) % (boxWidth - 80);
      const waveProgress = wavePhase / (boxWidth - 80);
      const waveAlpha = Math.sin(waveProgress * Math.PI) * 0.8;
      
      ctx.save();
      ctx.globalAlpha = waveAlpha;
      ctx.strokeStyle = `hsl(${30 + waveProgress * 30}, 100%, ${50 + waveProgress * 20}%)`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 152, 0, 0.3)';
      
      ctx.beginPath();
      const startX = sourceX + 25;
      for (let x = 0; x < wavePhase; x += 3) {
        const waveY = sourceY + Math.sin((x + time * 50) * 0.1) * 10;
        if (x === 0) {
          ctx.moveTo(startX + x, waveY);
        } else {
          ctx.lineTo(startX + x, waveY);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = '#333';
    ctx.font = `13px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.comparisonNoMedium, width * 2/3 + boxWidth / 2, 230);
    ctx.fillText(t.canvas.comparisonNeeded, width * 2/3 + boxWidth / 2, 250);
    ctx.fillText(t.canvas.comparisonWorksVacuum, width * 2/3 + boxWidth / 2, 270);
  };

  const drawDefaultAnimation = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000';
    ctx.font = `bold 24px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(t.canvas.defaultTitle, width / 2, height / 2);
  };

  const drawPerson = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Head
    ctx.fillStyle = '#FFD7A6';
    ctx.beginPath();
    ctx.arc(x, y - 40, 20, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y + 20);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x + 20, y);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x - 15, y + 50);
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + 15, y + 50);
    ctx.stroke();
  };

  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8 * Math.cos(angle - Math.PI / 6), y - 8 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x - 8 * Math.cos(angle + Math.PI / 6), y - 8 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setAnimationFrame(0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setAnimationFrame(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (setStopAutoNext) {
      setStopAutoNext(isPlaying);
    }
  };

  const reset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setAnimationFrame(0);
    if (setStopAutoNext) {
      setStopAutoNext(false);
    }
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Radio className="w-8 h-8" />
              <h1 className="text-2xl sm:text-3xl font-bold">{t.headerTitle}</h1>
            </div>
            <p className="text-orange-100 text-sm sm:text-base">{t.headerSubtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm opacity-90">
              {t.stepLabel} {currentStepIndex + 1} {t.ofLabel} {steps.length}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {t.stepTypeLabels[currentStep.type]}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-white rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
          {stepTexts[currentStepIndex]?.title}
        </h2>

        <div
          className={`mb-6 rounded-xl p-4 border-2 border-orange-200 ${
            currentStep.animationData?.experiment === 'sun_heat'
              ? 'bg-[radial-gradient(circle_at_top,_#111827,_#020617)]'
              : 'bg-gradient-to-br from-orange-50 to-red-50'
          }`}
        >
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`w-full rounded-lg shadow-md ${
              currentStep.animationData?.experiment === 'sun_heat'
                ? 'bg-transparent'
                : 'bg-white'
            }`}
          />
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-xl border-l-4 border-orange-500">
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            {stepTexts[currentStepIndex]?.description}
          </p>
        </div>

        {currentStep.type === 'real_world' && (
          <div className="mt-4 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl">
            <div className="flex items-center gap-2 text-purple-800 font-semibold">
              <Sun className="w-5 h-5" />
              {t.realWorldBadge}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            {t.controls.previous}
          </button>

          <div className="flex gap-3 justify-center">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? t.controls.pause : t.controls.play}
            </button>

            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              <RotateCcw className="w-5 h-5" />
              {t.controls.reset}
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-700 hover:to-red-700 transition"
          >
            {t.controls.next}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadiationLearnMode;