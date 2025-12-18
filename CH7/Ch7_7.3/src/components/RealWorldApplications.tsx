import React, { useState } from 'react';
import { Globe, Home, Sun, Zap, Flame, Shirt, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode, getFontFamilyForLanguage } from '../i18n/radiationTranslations';

interface Application {
  id: number;
  title: string;
  category: 'nature' | 'home' | 'everyday' | 'technology' | 'clothing';
  description: string;
  howItWorks: string;
  scienceBehind: string;
  realExample: string;
  benefits: string[];
  difficulty: 'everyday' | 'nature' | 'technology';
  icon: string;
}

interface RadiationRealWorldProps {
  props?: {
    language?: LanguageCode;
  };
}

interface RealWorldTranslations {
  headerTitle: string;
  headerSubtitle: string;
  categories: {
    all: string;
    nature: string;
    home: string;
    everyday: string;
    technology: string;
    clothing: string;
  };
  showingCount: (count: number) => string;
  difficultyLabels: {
    everyday: string;
    nature: string;
    technology: string;
  };
  sectionTitles: {
    whatIsIt: string;
    howItWorks: string;
    scienceBehind: string;
    realExample: string;
    benefits: string;
  };
  summaryTitle: string;
  summaryCards: {
    noMediumTitle: string;
    noMediumBody: string;
    allObjectsTitle: string;
    allObjectsBody: string;
    emWavesTitle: string;
    emWavesBody: string;
  };
  applications: Application[];
}

interface Translations {
  en: RealWorldTranslations;
  hi: RealWorldTranslations;
  gu: RealWorldTranslations;
}

const translations: Translations = {
  en: {
    headerTitle: 'Radiation in the Real World',
    headerSubtitle: 'Discover How Radiation Works in Daily Life',
    categories: {
      all: 'All Applications',
      nature: 'Nature',
      home: 'Home',
      everyday: 'Everyday',
      technology: 'Technology',
      clothing: 'Clothing',
    },
    showingCount: (count) => `Showing ${count} application${count !== 1 ? 's' : ''}`,
    difficultyLabels: {
      everyday: 'Everyday Life',
      nature: 'Natural Process',
      technology: 'Technology',
    },
    sectionTitles: {
      whatIsIt: 'What Is It?',
      howItWorks: 'How It Works',
      scienceBehind: 'Science Behind It',
      realExample: 'Real Indian Example',
      benefits: 'Benefits & Importance',
    },
    summaryTitle: 'Key Insights About Radiation',
    summaryCards: {
      noMediumTitle: 'No Medium Needed',
      noMediumBody:
        'Radiation can travel through vacuum - unlike conduction and convection which require a medium with particles.',
      allObjectsTitle: 'All Objects Radiate',
      allObjectsBody:
        'Every object above absolute zero radiates heat. Hotter objects radiate more intensely than cooler ones.',
      emWavesTitle: 'Electromagnetic Waves',
      emWavesBody:
        'Heat radiation travels as infrared electromagnetic waves at the speed of light (300,000 km/s).',
    },
    applications: [
  {
    id: 1,
    title: "Feeling Warmth from Fireplace",
    category: 'home',
    description: "When Pema and Palden sat around the fireplace in Gangtok, they felt warm even without touching the fire. This warmth traveled directly from the fire to them through radiation - no medium needed!",
    howItWorks: "The fire emits heat radiation in all directions. This radiation travels through the air (but doesn't need the air!) and reaches people sitting nearby. When this radiation hits your skin, it transfers energy and you feel warm.",
    scienceBehind: "Radiation travels as electromagnetic waves (infrared). These waves don't require particles to travel - they can even go through vacuum! The hotter the fire (higher temperature), the more radiation it emits.",
    realExample: "Across India, from Himalayan regions using bukhari (traditional heaters) to coastal areas with bonfires, people experience radiation warmth. In Sikkim, families gather around fireplaces during winter, feeling the heat directly without any contact.",
    benefits: [
      "Can feel warmth from a distance without touching hot objects",
      "Works even when air is still (no convection needed)",
      "Provides instant warmth as soon as fire starts",
      "Can warm multiple people in different directions simultaneously"
    ],
    difficulty: 'everyday',
    icon: '🔥'
  },
  {
    id: 2,
    title: "Sun's Energy Reaching Earth",
    category: 'nature',
    description: "The Sun is 150 million kilometers away from Earth, with empty space (vacuum) in between. Yet we feel the Sun's warmth every day! This incredible journey happens entirely through radiation.",
    howItWorks: "The Sun emits enormous amounts of heat and light as radiation. This radiation travels through the complete vacuum of space - where there are NO particles at all - and reaches Earth in about 8 minutes, traveling at the speed of light (300,000 km/second).",
    scienceBehind: "Solar radiation includes visible light, infrared (heat), and ultraviolet rays. Unlike conduction (needs contact) and convection (needs particle movement), radiation requires NO medium. It's pure energy transfer through electromagnetic waves.",
    realExample: "Kerala receives intense solar radiation near the equator, making it warmer than Gangtok (as Palden noticed!). Solar radiation drives India's agriculture through photosynthesis, powers solar panels across Gujarat and Rajasthan, and causes the monsoon through differential heating.",
    benefits: [
      "Provides all energy for life on Earth through photosynthesis",
      "Drives weather patterns and water cycle (evaporation)",
      "Enables vitamin D production in human skin",
      "Source of clean solar energy for electricity"
    ],
    difficulty: 'nature',
    icon: '☀️'
  },
  {
    id: 3,
    title: "White vs Dark Clothes",
    category: 'clothing',
    description: "Why do we wear white clothes in summer and dark clothes in winter? It's all about how different colors interact with heat radiation - reflecting or absorbing it!",
    howItWorks: "Light colors (white, cream) REFLECT most incoming heat radiation back into the environment. Dark colors (black, navy) ABSORB most heat radiation and convert it to internal heat energy.",
    scienceBehind: "When radiation hits a surface, it can be reflected, absorbed, or transmitted. White surfaces reflect up to 80-90% of radiation, while black surfaces absorb 80-90%. Absorbed radiation becomes heat energy in the material.",
    realExample: "In Rajasthan's desert regions, people traditionally wear white clothing to stay cool under intense sun (45°C). In Ladakh's cold winters (-20°C), dark clothing helps absorb any available solar radiation for warmth. Indian cricket team wears whites in Test matches played during hot days!",
    benefits: [
      "White in summer: Stays 5-10°C cooler than dark clothes",
      "Dark in winter: Absorbs solar heat, providing natural warmth",
      "Simple, no-energy solution for thermal comfort",
      "Traditional Indian clothing follows this principle"
    ],
    difficulty: 'everyday',
    icon: '👕'
  },
  {
    id: 4,
    title: "Drying Clothes in Sunlight",
    category: 'everyday',
    description: "Wet clothes dry much faster on a sunny day compared to a cloudy day. The Sun's radiation heats the water in clothes, causing rapid evaporation - a daily example of radiation at work!",
    howItWorks: "Solar radiation travels through space and air to reach wet clothes. This radiation transfers energy to water molecules in the fabric, increasing their kinetic energy. Fast-moving water molecules escape as vapor (evaporation).",
    scienceBehind: "Evaporation rate depends on temperature. Solar radiation raises water temperature from ~25°C to 40-50°C on cloth surface. At higher temperatures, more water molecules have enough energy to break free and evaporate.",
    realExample: "Every Indian household practices this daily! Clothes hung in direct sunlight at noon (when solar radiation is strongest) dry in 2-3 hours, while in shade they may take 6-8 hours. In monsoon season (cloudy), clothes take even longer as radiation is blocked by clouds.",
    benefits: [
      "Saves electricity (no need for clothes dryers)",
      "Natural disinfection - UV rays in sunlight kill bacteria",
      "Free energy from the Sun",
      "Clothes smell fresh from outdoor drying"
    ],
    difficulty: 'everyday',
    icon: '👔'
  },
  {
    id: 5,
    title: "Solar Cookers",
    category: 'technology',
    description: "Solar cookers use mirrors to concentrate the Sun's radiation onto a cooking pot. Food gets cooked using only sunlight - no gas, no electricity, no smoke! Pure radiation cooking.",
    howItWorks: "Parabolic mirrors reflect and focus solar radiation onto a central point where the cooking pot is placed. This concentrated radiation can reach temperatures of 150-200°C, enough to cook rice, vegetables, and lentils.",
    scienceBehind: "Mirrors redirect radiation rays toward a focal point. When parallel radiation rays from the Sun hit a parabolic mirror, they all reflect to one spot. This concentration multiplies the radiation intensity by 50-100 times!",
    realExample: "Gujarat and Rajasthan have many solar cooker projects. Tulsi Chanrai Foundation provided solar cookers to villages in Gujarat. During summer, these cookers can prepare a full meal (dal, rice, vegetables) for a family of 4-5 in 2-3 hours using only sunlight!",
    benefits: [
      "Zero fuel cost - completely free cooking energy",
      "No smoke or indoor air pollution (unlike wood fires)",
      "Reduces deforestation (no need for firewood)",
      "Food retains more nutrients with slow solar cooking"
    ],
    difficulty: 'technology',
    icon: '🍳'
  },
  {
    id: 6,
    title: "Greenhouse Effect on Earth",
    category: 'nature',
    description: "Earth's atmosphere acts like a greenhouse, trapping heat radiation from the Sun. This natural process keeps our planet warm enough for life - without it, Earth would be frozen at -18°C!",
    howItWorks: "Solar radiation passes through the atmosphere and warms Earth's surface. Earth then radiates heat back as infrared radiation. Greenhouse gases (CO₂, water vapor, methane) trap some of this outgoing radiation, keeping Earth warm.",
    scienceBehind: "Visible light from Sun penetrates atmosphere easily. Earth absorbs it and re-emits as infrared (heat) radiation. Greenhouse gases are transparent to visible light but opaque to infrared - they trap the heat trying to escape.",
    realExample: "Natural greenhouse effect maintains India's livable temperatures. However, excessive CO₂ from vehicles and industry enhances this effect, causing global warming. This affects Indian monsoons and Himalayan glaciers like those near Gangtok.",
    benefits: [
      "Maintains Earth's average temperature at +15°C (instead of -18°C)",
      "Enables liquid water to exist on Earth's surface",
      "Makes agriculture and life possible",
      "Natural climate regulation system"
    ],
    difficulty: 'nature',
    icon: '🌍'
  },
  {
    id: 7,
    title: "Thermal Imaging Cameras",
    category: 'technology',
    description: "These special cameras can 'see' heat radiation that our eyes cannot detect. They create images based on infrared radiation emitted by objects, revealing temperature differences.",
    howItWorks: "All objects above absolute zero (-273°C) emit infrared radiation. Thermal cameras detect this radiation and convert it to visible images - hotter objects appear bright (red/white), cooler objects appear dark (blue/black).",
    scienceBehind: "Amount of infrared radiation emitted increases rapidly with temperature (Stefan-Boltzmann law: power ∝ T⁴). A surface at 37°C (body temperature) emits much more radiation than one at 27°C (room temperature).",
    realExample: "During COVID-19, thermal cameras detected fever at airports across India by sensing excess body heat radiation. Indian Army uses them at LOC for night surveillance. Firefighters in Mumbai use them to locate people in smoke-filled buildings - heat radiation passes through smoke!",
    benefits: [
      "Non-contact temperature measurement (important for COVID screening)",
      "Works in complete darkness (detects heat, not light)",
      "Can detect heat loss in buildings (energy audits)",
      "Medical diagnosis - detects inflammation and blood flow issues"
    ],
    difficulty: 'technology',
    icon: '📷'
  },
  {
    id: 8,
    title: "Heat Radiation from Hot Utensils",
    category: 'home',
    description: "A hot metal pot kept on the table (away from the stove) gradually cools down. Where does the heat go? It radiates away to the cooler surroundings - walls, air, table - through radiation!",
    howItWorks: "The hot utensil (say at 80°C) emits heat radiation in all directions. Cooler surroundings (at 25°C room temperature) absorb this radiation. The utensil keeps radiating until temperatures equalize.",
    scienceBehind: "ALL objects continuously radiate heat to surroundings. Hotter objects radiate more intensely. Net heat transfer occurs from hot to cold. A 80°C pot radiates about 16 times more power than a 25°C wall!",
    realExample: "After cooking, grandmother's hot kadhai gradually cools on the kitchen counter. You can feel heat radiating from it if you hold your hand nearby (without touching!). The metal emits infrared radiation that your skin senses as warmth.",
    benefits: [
      "Automatic cooling without any effort",
      "Radiation works alongside conduction and convection",
      "Can feel heat without direct contact (safety feature)",
      "Faster cooling for hot items due to radiation"
    ],
    difficulty: 'everyday',
    icon: '🍲'
  },
  {
    id: 9,
    title: "Night Vision Technology",
    category: 'technology',
    description: "Night vision devices let us 'see' in darkness by detecting infrared heat radiation from warm objects (humans, animals, vehicles) even when there's no visible light.",
    howItWorks: "Objects warmer than surroundings emit more infrared radiation. Night vision devices detect this invisible radiation, amplify the signal electronically, and display it as a green-tinted visible image.",
    scienceBehind: "Human body at 37°C emits peak radiation at wavelength 9.4 micrometers (infrared - invisible to eyes). Night vision detects wavelengths 0.7-14 micrometers, covering near and thermal infrared regions.",
    realExample: "Indian security forces use night vision at borders. Wildlife researchers in Jim Corbett National Park use thermal cameras to study nocturnal tigers without disturbing them. The cameras detect body heat radiation from tigers against cooler forest background.",
    benefits: [
      "Security and surveillance in complete darkness",
      "Wildlife observation without visible light disturbance",
      "Search and rescue operations at night",
      "Military operations and border patrol"
    ],
    difficulty: 'technology',
    icon: '🌙'
  },
  {
    id: 10,
    title: "Earth's Energy Balance",
    category: 'nature',
    description: "Earth receives radiation from the Sun and radiates heat back to space. These two radiation flows must balance, or Earth would keep heating up or cooling down continuously!",
    howItWorks: "Earth receives ~1360 W/m² solar radiation at top of atmosphere. About 30% is reflected back to space. Remaining 70% is absorbed, warms Earth, and is re-radiated as infrared radiation to space.",
    scienceBehind: "Incoming solar radiation (shortwave) = Outgoing terrestrial radiation (longwave) for stable temperature. Earth's average temperature adjusts until radiation out equals radiation in. Currently receiving ~240 W/m² net, radiating same amount back.",
    realExample: "This balance maintains Earth's climate. However, increasing greenhouse gases trap more outgoing radiation, causing warming. This affects Indian agriculture, water resources, and Himalayan ice. Scientists monitor this balance using satellites to understand climate change.",
    benefits: [
      "Maintains stable global average temperature (~15°C)",
      "Enables predictable seasons and climate patterns",
      "Allows life to adapt to stable conditions",
      "Understanding this helps predict climate change"
    ],
    difficulty: 'nature',
    icon: '⚖️'
      },
    ],
  },
  hi: {
    headerTitle: 'वास्तविक जीवन में विकिरण',
    headerSubtitle: 'देखिए विकिरण हमारे दैनिक जीवन में कैसे काम करता है',
    categories: {
      all: 'सभी उदाहरण',
      nature: 'प्रकृति',
      home: 'घर',
      everyday: 'दैनिक जीवन',
      technology: 'प्रौद्योगिकी',
      clothing: 'कपड़े',
    },
    showingCount: (count) => `कुल ${count} उदाहरण दिखाए जा रहे हैं`,
    difficultyLabels: {
      everyday: 'दैनिक जीवन',
      nature: 'प्राकृतिक प्रक्रिया',
      technology: 'प्रौद्योगिकी',
    },
    sectionTitles: {
      whatIsIt: 'क्या है यह?',
      howItWorks: 'यह कैसे काम करता है',
      scienceBehind: 'इसके पीछे का विज्ञान',
      realExample: 'भारतीय उदाहरण',
      benefits: 'महत्त्व और लाभ',
    },
    summaryTitle: 'विकिरण से जुड़ी मुख्य बातें',
    summaryCards: {
      noMediumTitle: 'कोई माध्यम आवश्यक नहीं',
      noMediumBody:
        'विकिरण निर्वात में भी यात्रा कर सकता है, जबकि चालन और संवहन के लिए कणों वाला माध्यम आवश्यक होता है।',
      allObjectsTitle: 'हर वस्तु विकिरण करती है',
      allObjectsBody:
        'पूर्ण शून्य से ऊपर तापमान वाली हर वस्तु ऊष्मा विकिरण करती है। जितनी अधिक गरम वस्तु होगी, उतना अधिक विकिरण करेगी।',
      emWavesTitle: 'विद्युत-चुंबकीय तरंगें',
      emWavesBody:
        'ऊष्मा विकिरण अवरक्त (इन्फ्रारेड) विद्युत-चुंबकीय तरंगों के रूप में प्रकाश की चाल (300,000 km/s) से चलता है।',
    },
    applications: [
      {
        id: 1,
        title: 'अंगीठी से गर्मी महसूस करना',
        category: 'home',
        description:
          'जब पेमा और पेल्डन गंगटोक में अंगीठी के चारों ओर बैठे थे, तो उन्हें आग को छुए बिना भी गर्मी महसूस हुई। यह गर्मी सीधे आग से विकिरण के माध्यम से उन तक पहुँची - किसी माध्यम की आवश्यकता नहीं!',
        howItWorks:
          'आग सभी दिशाओं में ऊष्मा विकिरण उत्सर्जित करती है। यह विकिरण हवा से होकर यात्रा करता है (लेकिन हवा की जरूरत नहीं!) और पास बैठे लोगों तक पहुँचता है। जब यह विकिरण आपकी त्वचा से टकराता है, तो यह ऊर्जा स्थानांतरित करता है और आपको गर्मी महसूस होती है।',
        scienceBehind:
          'विकिरण विद्युत-चुंबकीय तरंगों (अवरक्त) के रूप में यात्रा करता है। इन तरंगों को यात्रा करने के लिए कणों की आवश्यकता नहीं होती - वे निर्वात से भी गुजर सकती हैं! जितनी गर्म आग (उच्च तापमान), उतना अधिक विकिरण उत्सर्जित होता है।',
        realExample:
          'पूरे भारत में, हिमालयी क्षेत्रों में बुखारी (पारंपरिक हीटर) का उपयोग करने से लेकर तटीय क्षेत्रों में अलाव तक, लोग विकिरण गर्मी का अनुभव करते हैं। सिक्किम में, परिवार सर्दियों के दौरान अंगीठी के चारों ओर इकट्ठा होते हैं, बिना किसी संपर्क के सीधे गर्मी महसूस करते हैं।',
        benefits: [
          'गर्म वस्तुओं को छुए बिना दूर से गर्मी महसूस कर सकते हैं',
          'हवा शांत होने पर भी काम करता है (संवहन की आवश्यकता नहीं)',
          'आग शुरू होते ही तुरंत गर्मी प्रदान करता है',
          'एक साथ अलग-अलग दिशाओं में कई लोगों को गर्म कर सकता है',
        ],
        difficulty: 'everyday',
        icon: '🔥',
      },
      {
        id: 2,
        title: 'सूर्य की ऊर्जा पृथ्वी तक पहुँचना',
        category: 'nature',
        description:
          'सूर्य पृथ्वी से 150 मिलियन किलोमीटर दूर है, बीच में खाली स्थान (निर्वात) है। फिर भी हम हर दिन सूर्य की गर्मी महसूस करते हैं! यह अविश्वसनीय यात्रा पूरी तरह से विकिरण के माध्यम से होती है।',
        howItWorks:
          'सूर्य विकिरण के रूप में भारी मात्रा में ऊष्मा और प्रकाश उत्सर्जित करता है। यह विकिरण अंतरिक्ष के पूर्ण निर्वात से होकर यात्रा करता है - जहाँ कोई कण नहीं हैं - और लगभग 8 मिनट में प्रकाश की गति (300,000 km/सेकंड) से पृथ्वी तक पहुँचता है।',
        scienceBehind:
          'सौर विकिरण में दृश्य प्रकाश, अवरक्त (ऊष्मा), और पराबैंगनी किरणें शामिल हैं। चालन (संपर्क चाहिए) और संवहन (कण गति चाहिए) के विपरीत, विकिरण को कोई माध्यम नहीं चाहिए। यह विद्युत-चुंबकीय तरंगों के माध्यम से शुद्ध ऊर्जा स्थानांतरण है।',
        realExample:
          'केरल भूमध्य रेखा के पास तीव्र सौर विकिरण प्राप्त करता है, जिससे यह गंगटोक से अधिक गर्म होता है (जैसा कि पेल्डन ने देखा!)। सौर विकिरण प्रकाश संश्लेषण के माध्यम से भारत की कृषि को चलाता है, गुजरात और राजस्थान में सौर पैनलों को शक्ति प्रदान करता है, और अंतर ऊष्मीकरण के माध्यम से मानसून का कारण बनता है।',
        benefits: [
          'प्रकाश संश्लेषण के माध्यम से पृथ्वी पर जीवन के लिए सभी ऊर्जा प्रदान करता है',
          'मौसम के पैटर्न और जल चक्र (वाष्पीकरण) को चलाता है',
          'मानव त्वचा में विटामिन D उत्पादन को सक्षम बनाता है',
          'बिजली के लिए स्वच्छ सौर ऊर्जा का स्रोत',
        ],
        difficulty: 'nature',
        icon: '☀️',
      },
      {
        id: 3,
        title: 'सफेद बनाम गहरे कपड़े',
        category: 'clothing',
        description:
          'हम गर्मी में सफेद कपड़े और सर्दी में गहरे कपड़े क्यों पहनते हैं? यह सब इस बात पर निर्भर करता है कि अलग-अलग रंग ऊष्मा विकिरण के साथ कैसे बातचीत करते हैं - इसे परावर्तित या अवशोषित करते हैं!',
        howItWorks:
          'हल्के रंग (सफेद, क्रीम) अधिकांश आने वाले ऊष्मा विकिरण को पर्यावरण में वापस परावर्तित करते हैं। गहरे रंग (काला, नेवी) अधिकांश ऊष्मा विकिरण को अवशोषित करते हैं और इसे आंतरिक ऊष्मा ऊर्जा में परिवर्तित करते हैं।',
        scienceBehind:
          'जब विकिरण किसी सतह से टकराता है, तो यह परावर्तित, अवशोषित या संचरित हो सकता है। सफेद सतहें 80-90% विकिरण को परावर्तित करती हैं, जबकि काली सतहें 80-90% अवशोषित करती हैं। अवशोषित विकिरण सामग्री में ऊष्मा ऊर्जा बन जाता है।',
        realExample:
          'राजस्थान के रेगिस्तानी क्षेत्रों में, लोग पारंपरिक रूप से तीव्र धूप (45°C) में ठंडा रहने के लिए सफेद कपड़े पहनते हैं। लद्दाख की ठंडी सर्दियों (-20°C) में, गहरे कपड़े गर्मी के लिए उपलब्ध सौर विकिरण को अवशोषित करने में मदद करते हैं। भारतीय क्रिकेट टीम गर्म दिनों में खेले जाने वाले टेस्ट मैचों में सफेद पहनती है!',
        benefits: [
          'गर्मी में सफेद: गहरे कपड़ों की तुलना में 5-10°C ठंडा रहता है',
          'सर्दी में गहरा: सौर ऊष्मा को अवशोषित करता है, प्राकृतिक गर्मी प्रदान करता है',
          'थर्मल आराम के लिए सरल, बिना ऊर्जा का समाधान',
          'पारंपरिक भारतीय कपड़े इस सिद्धांत का पालन करते हैं',
        ],
        difficulty: 'everyday',
        icon: '👕',
      },
      {
        id: 4,
        title: 'धूप में कपड़े सुखाना',
        category: 'everyday',
        description:
          'गीले कपड़े बादल वाले दिन की तुलना में धूप वाले दिन में बहुत तेजी से सूखते हैं। सूर्य का विकिरण कपड़ों में पानी को गर्म करता है, जिससे तेजी से वाष्पीकरण होता है - विकिरण का दैनिक उदाहरण!',
        howItWorks:
          'सौर विकिरण अंतरिक्ष और हवा से होकर गीले कपड़ों तक पहुँचता है। यह विकिरण कपड़े में पानी के अणुओं में ऊर्जा स्थानांतरित करता है, उनकी गतिज ऊर्जा बढ़ाता है। तेजी से चलने वाले पानी के अणु वाष्प (वाष्पीकरण) के रूप में बच जाते हैं।',
        scienceBehind:
          'वाष्पीकरण दर तापमान पर निर्भर करती है। सौर विकिरण कपड़े की सतह पर पानी के तापमान को ~25°C से 40-50°C तक बढ़ाता है। उच्च तापमान पर, अधिक पानी के अणुओं के पास मुक्त होने और वाष्पित होने के लिए पर्याप्त ऊर्जा होती है।',
        realExample:
          'हर भारतीय घर में यह दैनिक अभ्यास होता है! दोपहर में सीधी धूप में लटकाए गए कपड़े (जब सौर विकिरण सबसे मजबूत होता है) 2-3 घंटे में सूख जाते हैं, जबकि छाया में उन्हें 6-8 घंटे लग सकते हैं। मानसून के मौसम (बादल) में, कपड़े और भी लंबे समय तक लेते हैं क्योंकि बादलों द्वारा विकिरण अवरुद्ध हो जाता है।',
        benefits: [
          'बिजली बचाता है (कपड़े सुखाने वाली मशीन की आवश्यकता नहीं)',
          'प्राकृतिक कीटाणुशोधन - सूर्य के प्रकाश में यूवी किरणें बैक्टीरिया को मारती हैं',
          'सूर्य से मुफ्त ऊर्जा',
          'बाहर सुखाने से कपड़े ताजा महकते हैं',
        ],
        difficulty: 'everyday',
        icon: '👔',
      },
      {
        id: 5,
        title: 'सौर कुकर',
        category: 'technology',
        description:
          "सौर कुकर सूर्य के विकिरण को केंद्रित करने के लिए दर्पण का उपयोग करते हैं। भोजन केवल सूर्य के प्रकाश का उपयोग करके पकाया जाता है - कोई गैस नहीं, कोई बिजली नहीं, कोई धुआँ नहीं! शुद्ध विकिरण खाना पकाना।",
        howItWorks:
          'परवलयिक दर्पण सौर विकिरण को एक केंद्रीय बिंदु पर परावर्तित और केंद्रित करते हैं जहाँ खाना पकाने का बर्तन रखा जाता है। यह केंद्रित विकिरण 150-200°C तक तापमान पहुँच सकता है, चावल, सब्जियाँ और दाल पकाने के लिए पर्याप्त।',
        scienceBehind:
          'दर्पण विकिरण किरणों को एक फोकल बिंदु की ओर पुनर्निर्देशित करते हैं। जब सूर्य से समानांतर विकिरण किरणें एक परवलयिक दर्पण से टकराती हैं, तो वे सभी एक स्थान पर परावर्तित होती हैं। यह एकाग्रता विकिरण की तीव्रता को 50-100 गुना बढ़ा देती है!',
        realExample:
          'गुजरात और राजस्थान में कई सौर कुकर परियोजनाएँ हैं। तुलसी चानराई फाउंडेशन ने गुजरात के गाँवों में सौर कुकर प्रदान किए। गर्मियों के दौरान, ये कुकर केवल सूर्य के प्रकाश का उपयोग करके 4-5 लोगों के परिवार के लिए 2-3 घंटे में पूरा भोजन (दाल, चावल, सब्जियाँ) तैयार कर सकते हैं!',
        benefits: [
          'शून्य ईंधन लागत - पूरी तरह से मुफ्त खाना पकाने की ऊर्जा',
          'कोई धुआँ या घरेलू वायु प्रदूषण नहीं (लकड़ी की आग के विपरीत)',
          'वनों की कटाई कम करता है (लकड़ी की आवश्यकता नहीं)',
          'धीमी सौर खाना पकाने से भोजन अधिक पोषक तत्व बनाए रखता है',
        ],
        difficulty: 'technology',
        icon: '🍳',
      },
      {
        id: 6,
        title: 'पृथ्वी पर ग्रीनहाउस प्रभाव',
        category: 'nature',
        description:
          "पृथ्वी का वायुमंडल एक ग्रीनहाउस की तरह काम करता है, सूर्य से ऊष्मा विकिरण को फँसाता है। यह प्राकृतिक प्रक्रिया हमारे ग्रह को जीवन के लिए पर्याप्त गर्म रखती है - इसके बिना, पृथ्वी -18°C पर जमी होगी!",
        howItWorks:
          'सौर विकिरण वायुमंडल से होकर गुजरता है और पृथ्वी की सतह को गर्म करता है। पृथ्वी फिर अवरक्त विकिरण के रूप में ऊष्मा वापस विकिरण करती है। ग्रीनहाउस गैसें (CO₂, जल वाष्प, मीथेन) इस बाहर जाने वाले विकिरण के कुछ हिस्से को फँसाती हैं, पृथ्वी को गर्म रखती हैं।',
        scienceBehind:
          'सूर्य से दृश्य प्रकाश वायुमंडल में आसानी से प्रवेश करता है। पृथ्वी इसे अवशोषित करती है और अवरक्त (ऊष्मा) विकिरण के रूप में पुनः उत्सर्जित करती है। ग्रीनहाउस गैसें दृश्य प्रकाश के लिए पारदर्शी होती हैं लेकिन अवरक्त के लिए अपारदर्शी - वे बचने की कोशिश कर रही ऊष्मा को फँसाती हैं।',
        realExample:
          "प्राकृतिक ग्रीनहाउस प्रभाव भारत के रहने योग्य तापमान को बनाए रखता है। हालाँकि, वाहनों और उद्योग से अत्यधिक CO₂ इस प्रभाव को बढ़ाता है, जिससे ग्लोबल वार्मिंग होती है। यह भारतीय मानसून और हिमालयी ग्लेशियरों को प्रभावित करता है जैसे गंगटोक के पास।",
        benefits: [
          'पृथ्वी के औसत तापमान को +15°C पर बनाए रखता है (-18°C के बजाय)',
          'पृथ्वी की सतह पर तरल पानी के अस्तित्व को सक्षम बनाता है',
          'कृषि और जीवन को संभव बनाता है',
          'प्राकृतिक जलवायु विनियमन प्रणाली',
        ],
        difficulty: 'nature',
        icon: '🌍',
      },
      {
        id: 7,
        title: 'थर्मल इमेजिंग कैमरे',
        category: 'technology',
        description:
          "ये विशेष कैमरे ऊष्मा विकिरण को 'देख' सकते हैं जिसे हमारी आँखें नहीं देख सकतीं। वे वस्तुओं द्वारा उत्सर्जित अवरक्त विकिरण के आधार पर छवियाँ बनाते हैं, तापमान अंतर को प्रकट करते हैं।",
        howItWorks:
          'पूर्ण शून्य (-273°C) से ऊपर की सभी वस्तुएँ अवरक्त विकिरण उत्सर्जित करती हैं। थर्मल कैमरे इस विकिरण का पता लगाते हैं और इसे दृश्य छवियों में परिवर्तित करते हैं - गर्म वस्तुएँ चमकीली (लाल/सफेद) दिखाई देती हैं, ठंडी वस्तुएँ अंधेरी (नीली/काली) दिखाई देती हैं।',
        scienceBehind:
          'उत्सर्जित अवरक्त विकिरण की मात्रा तापमान के साथ तेजी से बढ़ती है (स्टीफन-बोल्ट्जमैन नियम: शक्ति ∝ T⁴)। 37°C (शरीर का तापमान) पर एक सतह 27°C (कमरे का तापमान) वाली सतह की तुलना में बहुत अधिक विकिरण उत्सर्जित करती है।',
        realExample:
          'COVID-19 के दौरान, थर्मल कैमरों ने अत्यधिक शरीर की ऊष्मा विकिरण का पता लगाकर भारत भर के हवाई अड्डों पर बुखार का पता लगाया। भारतीय सेना LOC पर रात के निगरानी के लिए उनका उपयोग करती है। मुंबई के अग्निशामक धुएँ से भरे भवनों में लोगों का पता लगाने के लिए उनका उपयोग करते हैं - ऊष्मा विकिरण धुएँ से होकर गुजरता है!',
        benefits: [
          'गैर-संपर्क तापमान माप (COVID स्क्रीनिंग के लिए महत्वपूर्ण)',
          'पूर्ण अंधकार में काम करता है (ऊष्मा का पता लगाता है, प्रकाश नहीं)',
          'भवनों में ऊष्मा हानि का पता लगा सकता है (ऊर्जा ऑडिट)',
          'चिकित्सा निदान - सूजन और रक्त प्रवाह समस्याओं का पता लगाता है',
        ],
        difficulty: 'technology',
        icon: '📷',
      },
      {
        id: 8,
        title: 'गर्म बर्तनों से ऊष्मा विकिरण',
        category: 'home',
        description:
          'एक गर्म धातु का बर्तन मेज पर रखा गया (चूल्हे से दूर) धीरे-धीरे ठंडा हो जाता है। ऊष्मा कहाँ जाती है? यह विकिरण के माध्यम से ठंडे वातावरण - दीवारें, हवा, मेज - में विकिरण करती है!',
        howItWorks:
          'गर्म बर्तन (मान लें 80°C पर) सभी दिशाओं में ऊष्मा विकिरण उत्सर्जित करता है। ठंडा वातावरण (25°C कमरे के तापमान पर) इस विकिरण को अवशोषित करता है। बर्तन तब तक विकिरण करता रहता है जब तक तापमान समान नहीं हो जाता।',
        scienceBehind:
          'सभी वस्तुएँ लगातार अपने आस-पास में ऊष्मा का विकिरण करती हैं। गर्म वस्तुएँ अधिक तीव्रता से विकिरण करती हैं। शुद्ध ऊष्मा स्थानांतरण गर्म से ठंडे की ओर होता है। 80°C का बर्तन 25°C की दीवार की तुलना में लगभग 16 गुना अधिक शक्ति विकिरण करता है!',
        realExample:
          'खाना पकाने के बाद, दादी का गर्म कढ़ाई रसोई काउंटर पर धीरे-धीरे ठंडी हो जाती है। यदि आप अपना हाथ पास रखते हैं (बिना छुए!) तो आप इससे विकिरण होने वाली गर्मी महसूस कर सकते हैं। धातु अवरक्त विकिरण उत्सर्जित करती है जिसे आपकी त्वचा गर्मी के रूप में महसूस करती है।',
        benefits: [
          'बिना किसी प्रयास के स्वचालित ठंडा होना',
          'विकिरण चालन और संवहन के साथ काम करता है',
          'सीधे संपर्क के बिना गर्मी महसूस कर सकते हैं (सुरक्षा सुविधा)',
          'विकिरण के कारण गर्म वस्तुओं के लिए तेजी से ठंडा होना',
        ],
        difficulty: 'everyday',
        icon: '🍲',
      },
      {
        id: 9,
        title: 'रात्रि दृष्टि प्रौद्योगिकी',
        category: 'technology',
        description:
          'रात्रि दृष्टि उपकरण हमें अंधेरे में गर्म वस्तुओं (मनुष्य, जानवर, वाहन) से अवरक्त ऊष्मा विकिरण का पता लगाकर \'देखने\' देते हैं, भले ही दृश्य प्रकाश न हो।',
        howItWorks:
          'आस-पास की तुलना में गर्म वस्तुएँ अधिक अवरक्त विकिरण उत्सर्जित करती हैं। रात्रि दृष्टि उपकरण इस अदृश्य विकिरण का पता लगाते हैं, सिग्नल को इलेक्ट्रॉनिक रूप से प्रवर्धित करते हैं, और इसे हरे रंग की दृश्य छवि के रूप में प्रदर्शित करते हैं।',
        scienceBehind:
          '37°C पर मानव शरीर 9.4 माइक्रोमीटर तरंगदैर्ध्य पर शिखर विकिरण उत्सर्जित करता है (अवरक्त - आँखों के लिए अदृश्य)। रात्रि दृष्टि 0.7-14 माइक्रोमीटर तरंगदैर्ध्य का पता लगाती है, निकट और थर्मल अवरक्त क्षेत्रों को कवर करती है।',
        realExample:
          'भारतीय सुरक्षा बल सीमाओं पर रात्रि दृष्टि का उपयोग करते हैं। जिम कॉर्बेट राष्ट्रीय उद्यान में वन्यजीव शोधकर्ता रात्रिचर बाघों का अध्ययन करने के लिए थर्मल कैमरों का उपयोग करते हैं बिना उन्हें परेशान किए। कैमरे ठंडे जंगल की पृष्ठभूमि के खिलाफ बाघों से शरीर की ऊष्मा विकिरण का पता लगाते हैं।',
        benefits: [
          'पूर्ण अंधकार में सुरक्षा और निगरानी',
          'दृश्य प्रकाश व्यवधान के बिना वन्यजीव अवलोकन',
          'रात में खोज और बचाव अभियान',
          'सैन्य अभियान और सीमा गश्त',
        ],
        difficulty: 'technology',
        icon: '🌙',
      },
      {
        id: 10,
        title: 'पृथ्वी का ऊर्जा संतुलन',
        category: 'nature',
        description:
          'पृथ्वी सूर्य से विकिरण प्राप्त करती है और अंतरिक्ष में वापस ऊष्मा विकिरण करती है। इन दो विकिरण प्रवाहों को संतुलित होना चाहिए, अन्यथा पृथ्वी लगातार गर्म या ठंडी होती रहेगी!',
        howItWorks:
          'पृथ्वी वायुमंडल के शीर्ष पर ~1360 W/m² सौर विकिरण प्राप्त करती है। लगभग 30% अंतरिक्ष में वापस परावर्तित हो जाता है। शेष 70% अवशोषित होता है, पृथ्वी को गर्म करता है, और अंतरिक्ष में अवरक्त विकिरण के रूप में पुनः विकिरण होता है।',
        scienceBehind:
          'आने वाला सौर विकिरण (लघु तरंग) = बाहर जाने वाला स्थलीय विकिरण (दीर्घ तरंग) स्थिर तापमान के लिए। पृथ्वी का औसत तापमान तब तक समायोजित होता है जब तक बाहर जाने वाला विकिरण आने वाले विकिरण के बराबर नहीं हो जाता। वर्तमान में ~240 W/m² शुद्ध प्राप्त हो रहा है, उतनी ही मात्रा वापस विकिरण कर रहा है।',
        realExample:
          'यह संतुलन पृथ्वी की जलवायु को बनाए रखता है। हालाँकि, बढ़ती ग्रीनहाउस गैसें अधिक बाहर जाने वाले विकिरण को फँसाती हैं, जिससे वार्मिंग होती है। यह भारतीय कृषि, जल संसाधनों और हिमालयी बर्फ को प्रभावित करता है जैसे गंगटोक के पास। वैज्ञानिक जलवायु परिवर्तन को समझने के लिए उपग्रहों का उपयोग करके इस संतुलन की निगरानी करते हैं।',
        benefits: [
          'स्थिर वैश्विक औसत तापमान (~15°C) बनाए रखता है',
          'अनुमानित मौसम और जलवायु पैटर्न को सक्षम बनाता है',
          'जीवन को स्थिर स्थितियों के अनुकूल होने की अनुमति देता है',
          'इसे समझना जलवायु परिवर्तन की भविष्यवाणी करने में मदद करता है',
        ],
        difficulty: 'nature',
        icon: '⚖️',
      },
    ],
  },
  gu: {
    headerTitle: 'વાસ્તવિક જીવનમાં વિકિરણ',
    headerSubtitle: 'જોઈએ કે વિકિરણ આપણી રોજિંદી જિંદગીમાં કેવી રીતે કામ કરે છે',
    categories: {
      all: 'બધા ઉદાહરણો',
      nature: 'પ્રકૃતિ',
      home: 'ઘર',
      everyday: 'દૈનિક જીવન',
      technology: 'ટેક્નોલોજી',
      clothing: 'કપડા',
    },
    showingCount: (count) => `કુલ ${count} ઉદાહરણ દર્શાવવામાં આવ્યા છે`,
    difficultyLabels: {
      everyday: 'દૈનિક જીવન',
      nature: 'પ્રાકૃતિક પ્રક્રિયા',
      technology: 'ટેક્નોલોજી',
    },
    sectionTitles: {
      whatIsIt: 'આ શું છે?',
      howItWorks: 'આ કેવી રીતે કાર્ય કરે છે',
      scienceBehind: 'પાછળનો વિજ્ઞાન',
      realExample: 'ભારતીય ઉદાહરણ',
      benefits: 'મહત્ત્વ અને ફાયદા',
    },
    summaryTitle: 'વિકિરણ વિશેની મુખ્ય વાતો',
    summaryCards: {
      noMediumTitle: 'કોઈ માધ્યમ જરૂરી નથી',
      noMediumBody:
        'વિકિરણ શૂન્યાવકાશમાં પણ જઈ શકે છે, જ્યારે ચાલન અને સંવહન માટે કણો ધરાવતું માધ્યમ જરૂરી છે।',
      allObjectsTitle: 'બધા પદાર્થો વિકિરણ કરે છે',
      allObjectsBody:
        'સંપૂર્ણ શૂન્યથી વધુ તાપમાન ધરાવતા દરેક પદાર્થ ઉષ્મા વિકિરણ કરે છે। જેટલું વધુ તાપમાન, તેટલું વધુ વિકિરણ।',
      emWavesTitle: 'વિદ્યુત-ચુંબકીય તરંગો',
      emWavesBody:
        'ઉષ્મા વિકિરણ ઇન્ફ્રારેડ વિદ્યુત-ચુંબકીય તરંગોના રૂપમાં પ્રકાશની ગતિએ (300,000 km/s) પ્રવાસ કરે છે।',
    },
    applications: [
      {
        id: 1,
        title: 'ચૂલામાંથી ગરમી અનુભવવી',
        category: 'home',
        description:
          'જ્યારે પેમા અને પેલ્ડન ગંગટોકમાં ચૂલાની આસપાસ બેઠા હતા, ત્યારે તેઓએ આગને સ્પર્શ કર્યા વગર પણ ગરમી અનુભવી. આ ગરમી સીધી આગથી વિકિરણ દ્વારા તેમના સુધી પહોંચી - કોઈ માધ્યમની જરૂર નથી!',
        howItWorks:
          'આગ બધી દિશાઓમાં ઉષ્મા વિકિરણ ઉત્સર્જિત કરે છે. આ વિકિરણ હવામાંથી પસાર થાય છે (પરંતુ હવાની જરૂર નથી!) અને નજીક બેઠા લોકો સુધી પહોંચે છે. જ્યારે આ વિકિરણ તમારી ત્વચા સાથે ટકરાય છે, ત્યારે તે ઊર્જા સ્થાનાંતરિત કરે છે અને તમને ગરમી લાગે છે।',
        scienceBehind:
          'વિકિરણ વિદ્યુત-ચુંબકીય તરંગો (ઇન્ફ્રારેડ) તરીકે પ્રવાસ કરે છે। આ તરંગોને પ્રવાસ કરવા માટે કણોની જરૂર પડતી નથી - તેઓ શૂન્યાવકાશમાંથી પણ પસાર થઈ શકે છે! જેટલી ગરમ આગ (ઉચ્ચ તાપમાન), તેટલું વધુ વિકિરણ ઉત્સર્જિત થાય છે।',
        realExample:
          'ભારતભરમાં, હિમાલયન પ્રદેશોમાં બુખારી (પરંપરાગત હીટર) નો ઉપયોગ કરવાથી લઈને તટીય વિસ્તારોમાં અગ્નિ સુધી, લોકો વિકિરણ ગરમીનો અનુભવ કરે છે। સિક્કિમમાં, પરિવારો શિયાળા દરમિયાન ચૂલાની આસપાસ એકઠા થાય છે, કોઈ સંપર્ક વગર સીધી ગરમી અનુભવે છે।',
        benefits: [
          'ગરમ વસ્તુઓને સ્પર્શ કર્યા વગર અંતરથી ગરમી અનુભવી શકે છે',
          'હવા શાંત હોય ત્યારે પણ કામ કરે છે (સંવહનની જરૂર નથી)',
          'આગ શરૂ થતાં જ તરત જ ગરમી પ્રદાન કરે છે',
          'એક સાથે વિવિધ દિશાઓમાં બહુવિધ લોકોને ગરમ કરી શકે છે',
        ],
        difficulty: 'everyday',
        icon: '🔥',
      },
      {
        id: 2,
        title: 'સૂર્યની ઊર્જા પૃથ્વી સુધી પહોંચવી',
        category: 'nature',
        description:
          'સૂર્ય પૃથ્વીથી 150 મિલિયન કિલોમીટર દૂર છે, વચ્ચે ખાલી જગ્યા (શૂન્યાવકાશ) છે। છતાં આપણે દરરોજ સૂર્યની ગરમી અનુભવીએ છીએ! આ અવિશ્વસનીય પ્રવાસ સંપૂર્ણપણે વિકિરણ દ્વારા થાય છે।',
        howItWorks:
          'સૂર્ય વિકિરણના રૂપમાં ભારી માત્રામાં ઉષ્મા અને પ્રકાશ ઉત્સર્જિત કરે છે। આ વિકિરણ અવકાશના સંપૂર્ણ શૂન્યાવકાશમાંથી પસાર થાય છે - જ્યાં કોઈ કણ નથી - અને લગભગ 8 મિનિટમાં પ્રકાશની ગતિએ (300,000 km/સેકંડ) પૃથ્વી સુધી પહોંચે છે।',
        scienceBehind:
          'સૌર વિકિરણમાં દૃશ્યમાન પ્રકાશ, ઇન્ફ્રારેડ (ઉષ્મા), અને અલ્ટ્રાવાયોલેટ કિરણોનો સમાવેશ થાય છે. ચાલન (સંપર્ક જોઈએ) અને સંવહન (કણ ગતિ જોઈએ) કરતાં વિપરીત, વિકિરણને કોઈ માધ્યમ જોઈએ નથી. તે વિદ્યુત-ચુંબકીય તરંગો દ્વારા શુદ્ધ ઊર્જા સ્થાનાંતરણ છે।',
        realExample:
          'કેરળ ભૂમધ્યરેખાની નજીક તીવ્ર સૌર વિકિરણ પ્રાપ્ત કરે છે, જે તેને ગંગટોક કરતાં ગરમ બનાવે છે (જેમ કે પેલ્ડને જોયું!)। સૌર વિકિરણ પ્રકાશસંશ્લેષણ દ્વારા ભારતની કૃષિને ચલાવે છે, ગુજરાત અને રાજસ્થાનમાં સૌર પેનલોને શક્તિ આપે છે, અને વિભેદક ગરમી દ્વારા મોસમનું કારણ બને છે।',
        benefits: [
          'પ્રકાશસંશ્લેષણ દ્વારા પૃથ્વી પર જીવન માટે બધી ઊર્જા પ્રદાન કરે છે',
          'હવામાન પેટર્ન અને પાણી ચક્ર (બાષ્પીભવન) ચલાવે છે',
          'માનવ ત્વચામાં વિટામિન D ઉત્પાદનને સક્ષમ બનાવે છે',
          'વીજળી માટે સ્વચ્છ સૌર ઊર્જાનો સ્રોત',
        ],
        difficulty: 'nature',
        icon: '☀️',
      },
      {
        id: 3,
        title: 'સફેદ વિરુદ્ધ ગાઢ કપડાં',
        category: 'clothing',
        description:
          'આપણે ઉનાળામાં સફેદ કપડાં અને શિયાળામાં ગાઢ કપડાં કેમ પહેરીએ છીએ? તે બધું અલગ-અલગ રંગો ઉષ્મા વિકિરણ સાથે કેવી રીતે ક્રિયાપ્રતિક્રિયા કરે છે તેના પર આધારિત છે - તેને પરાવર્તિત અથવા શોષે છે!',
        howItWorks:
          'હળવા રંગો (સફેદ, ક્રીમ) મોટાભાગના આવતા ઉષ્મા વિકિરણને પર્યાવરણમાં પાછા પરાવર્તિત કરે છે। ગાઢ રંગો (કાળો, નેવી) મોટાભાગના ઉષ્મા વિકિરણને શોષે છે અને તેને આંતરિક ઉષ્મા ઊર્જામાં રૂપાંતરિત કરે છે।',
        scienceBehind:
          'જ્યારે વિકિરણ કોઈ સપાટી સાથે ટકરાય છે, ત્યારે તે પરાવર્તિત, શોષાય અથવા પ્રસારિત થઈ શકે છે। સફેદ સપાટીઓ 80-90% વિકિરણને પરાવર્તિત કરે છે, જ્યારે કાળી સપાટીઓ 80-90% શોષે છે। શોષાયેલ વિકિરણ સામગ્રીમાં ઉષ્મા ઊર્જા બની જાય છે।',
        realExample:
          'રાજસ્થાનના રણ પ્રદેશોમાં, લોકો પરંપરાગત રીતે તીવ્ર સૂર્ય (45°C) હેઠળ ઠંડુ રહેવા માટે સફેદ કપડાં પહેરે છે। લદાખની ઠંડી શિયાળામાં (-20°C), ગાઢ કપડાં ગરમી માટે ઉપલબ્ધ કોઈપણ સૌર વિકિરણને શોષવામાં મદદ કરે છે। ભારતીય ક્રિકેટ ટીમ ગરમ દિવસોમાં ખેલાયેલા ટેસ્ટ મેચોમાં સફેદ પહેરે છે!',
        benefits: [
          'ઉનાળામાં સફેદ: ગાઢ કપડાં કરતાં 5-10°C ઠંડુ રહે છે',
          'શિયાળામાં ગાઢ: સૌર ઉષ્માને શોષે છે, કુદરતી ગરમી પ્રદાન કરે છે',
          'થર્મલ આરામ માટે સરળ, બિન-ઊર્જા ઉકેલ',
          'પરંપરાગત ભારતીય કપડાં આ સિદ્ધાંતનું પાલન કરે છે',
        ],
        difficulty: 'everyday',
        icon: '👕',
      },
      {
        id: 4,
        title: 'સૂર્યપ્રકાશમાં કપડાં સુકાવવા',
        category: 'everyday',
        description:
          'ભીના કપડાં બાદળી દિવસની તુલનામાં સૂર્યપ્રકાશવાળા દિવસે ખૂબ ઝડપથી સૂકાય છે। સૂર્યનું વિકિરણ કપડાંમાં પાણીને ગરમ કરે છે, જેને કારણે ઝડપી બાષ્પીભવન થાય છે - કામ પર વિકિરણનું દૈનિક ઉદાહરણ!',
        howItWorks:
          'સૌર વિકિરણ અવકાશ અને હવામાંથી પસાર થઈ ભીના કપડાં સુધી પહોંચે છે। આ વિકિરણ કાપડમાં પાણીના અણુઓમાં ઊર્જા સ્થાનાંતરિત કરે છે, તેમની ગતિ ઊર્જા વધારે છે। ઝડપથી ફરતા પાણીના અણુઓ બાષ્પ (બાષ્પીભવન) તરીકે બચી જાય છે।',
        scienceBehind:
          'બાષ્પીભવન દર તાપમાન પર આધાર રાખે છે। સૌર વિકિરણ કાપડની સપાટી પર પાણીનું તાપમાન ~25°C થી 40-50°C સુધી વધારે છે। ઉચ્ચ તાપમાને, વધુ પાણીના અણુઓને મુક્ત થવા અને બાષ્પીભવન માટે પૂરતી ઊર્જા હોય છે।',
        realExample:
          'દરેક ભારતીય ઘરમાં આ દૈનિક પ્રથા છે! બપોરે સીધા સૂર્યપ્રકાશમાં લટકાવેલા કપડાં (જ્યારે સૌર વિકિરણ સૌથી મજબૂત હોય છે) 2-3 કલાકમાં સૂકાય છે, જ્યારે છાંયામાં તેમને 6-8 કલાક લાગી શકે છે। મોસમી સીઝન (બાદળી) માં, કપડાં વધુ સમય લે છે કારણ કે વિકિરણ બાદળો દ્વારા અવરોધિત થાય છે।',
        benefits: [
          'વીજળી બચાવે છે (કપડાં સુકાવનારની જરૂર નથી)',
          'કુદરતી જંતુનાશક - સૂર્યપ્રકાશમાં UV કિરણો બેક્ટેરિયાને મારે છે',
          'સૂર્યથી મફત ઊર્જા',
          'બહાર સુકાવવાથી કપડાં તાજા સુગંધ આવે છે',
        ],
        difficulty: 'everyday',
        icon: '👔',
      },
      {
        id: 5,
        title: 'સૌર કૂકર',
        category: 'technology',
        description:
          'સૌર કૂકર સૂર્યના વિકિરણને કેન્દ્રિત કરવા માટે અરીસાનો ઉપયોગ કરે છે। ખોરાક માત્ર સૂર્યપ્રકાશનો ઉપયોગ કરીને તૈયાર થાય છે - કોઈ ગેસ નથી, કોઈ વીજળી નથી, કોઈ ધુમાડો નથી! શુદ્ધ વિકિરણ રસોઈ।',
        howItWorks:
          'પેરાબોલિક અરીસા સૌર વિકિરણને કેન્દ્રીય બિંદુ પર પરાવર્તિત અને ફોકસ કરે છે જ્યાં રસોઈનું વાસણ મૂકવામાં આવે છે। આ કેન્દ્રિત વિકિરણ 150-200°C સુધી તાપમાન પહોંચી શકે છે, ચોખા, શાકભાજી અને દાળ તૈયાર કરવા માટે પૂરતું।',
        scienceBehind:
          'અરીસા વિકિરણ કિરણોને ફોકલ બિંદુ તરફ પુનઃનિર્દેશિત કરે છે। જ્યારે સૂર્યથી સમાંતર વિકિરણ કિરણો પેરાબોલિક અરીસા સાથે ટકરાય છે, ત્યારે તેઓ બધા એક જગ્યાએ પરાવર્તિત થાય છે। આ સાંદ્રતા વિકિરણની તીવ્રતાને 50-100 ગણી વધારે છે!',
        realExample:
          'ગુજરાત અને રાજસ્થાનમાં ઘણા સૌર કૂકર પ્રોજેક્ટ્સ છે। તુલસી ચાનરાઈ ફાઉન્ડેશને ગુજરાતના ગામોમાં સૌર કૂકર પ્રદાન કર્યા. ઉનાળા દરમિયાન, આ કૂકર માત્ર સૂર્યપ્રકાશનો ઉપયોગ કરીને 4-5 લોકોના પરિવાર માટે 2-3 કલાકમાં સંપૂર્ણ ભોજન (દાળ, ચોખા, શાકભાજી) તૈયાર કરી શકે છે!',
        benefits: [
          'શૂન્ય ઇંધણ ખર્ચ - સંપૂર્ણપણે મફત રસોઈ ઊર્જા',
          'કોઈ ધુમાડો અથવા ઘરની હવા પ્રદૂષણ નથી (લાકડાની આગથી વિપરીત)',
          'વનનાશ ઘટાડે છે (લાકડાની જરૂર નથી)',
          'ધીમી સૌર રસોઈ સાથે ખોરાક વધુ પોષક તત્વો જાળવી રાખે છે',
        ],
        difficulty: 'technology',
        icon: '🍳',
      },
      {
        id: 6,
        title: 'પૃથ્વી પર ગ્રીનહાઉસ અસર',
        category: 'nature',
        description:
          'પૃથ્વીનું વાતાવરણ ગ્રીનહાઉસની જેમ કાર્ય કરે છે, સૂર્યથી ઉષ્મા વિકિરણને ફસાવે છે। આ કુદરતી પ્રક્રિયા આપણા ગ્રહને જીવન માટે પૂરતું ગરમ રાખે છે - આ વગર, પૃથ્વી -18°C પર જડી હશે!',
        howItWorks:
          'સૌર વિકિરણ વાતાવરણમાંથી પસાર થાય છે અને પૃથ્વીની સપાટીને ગરમ કરે છે। પૃથ્વી પછી ઇન્ફ્રારેડ વિકિરણ તરીકે ઉષ્મા પાછી વિકિરણ કરે છે। ગ્રીનહાઉસ વાયુઓ (CO₂, પાણીની વરાળ, મિથેન) આ બહાર જતા વિકિરણના કેટલાક ભાગને ફસાવે છે, પૃથ્વીને ગરમ રાખે છે।',
        scienceBehind:
          'સૂર્યથી દૃશ્યમાન પ્રકાશ વાતાવરણમાં સરળતાથી પ્રવેશ કરે છે। પૃથ્વી તેને શોષે છે અને ઇન્ફ્રારેડ (ઉષ્મા) વિકિરણ તરીકે પુનઃ ઉત્સર્જિત કરે છે। ગ્રીનહાઉસ વાયુઓ દૃશ્યમાન પ્રકાશ માટે પારદર્શક હોય છે પરંતુ ઇન્ફ્રારેડ માટે અપારદર્શક - તેઓ બચવાનો પ્રયાસ કરતી ઉષ્માને ફસાવે છે।',
        realExample:
          'કુદરતી ગ્રીનહાઉસ અસર ભારતના રહેવાયોગ્ય તાપમાનને જાળવી રાખે છે। જો કે, વાહનો અને ઉદ્યોગમાંથી અતિશય CO₂ આ અસરને વધારે છે, જે વૈશ્વિક તાપમાન વધારાનું કારણ બને છે। આ ભારતીય મોસમ અને હિમાલયન હિમનદોને અસર કરે છે જેમ કે ગંગટોકની નજીક।',
        benefits: [
          'પૃથ્વીના સરેરાશ તાપમાનને +15°C પર જાળવી રાખે છે (-18°C ને બદલે)',
          'પૃથ્વીની સપાટી પર પ્રવાહી પાણીના અસ્તિત્વને સક્ષમ બનાવે છે',
          'કૃષિ અને જીવનને શક્ય બનાવે છે',
          'કુદરતી આબોહવા નિયમન પ્રણાલી',
        ],
        difficulty: 'nature',
        icon: '🌍',
      },
      {
        id: 7,
        title: 'થર્મલ ઇમેજિંગ કેમેરા',
        category: 'technology',
        description:
          'આ વિશેષ કેમેરા ઉષ્મા વિકિરણને \'જોઈ\' શકે છે જે આપણી આંખો શોધી શકતી નથી। તેઓ વસ્તુઓ દ્વારા ઉત્સર્જિત ઇન્ફ્રારેડ વિકિરણના આધારે છબીઓ બનાવે છે, તાપમાનના તફાવતોને ઉજાગર કરે છે।',
        howItWorks:
          'સંપૂર્ણ શૂન્ય (-273°C) થી ઉપરની બધી વસ્તુઓ ઇન્ફ્રારેડ વિકિરણ ઉત્સર્જિત કરે છે। થર્મલ કેમેરા આ વિકિરણનો પતો લગાવે છે અને તેને દૃશ્યમાન છબીઓમાં રૂપાંતરિત કરે છે - ગરમ વસ્તુઓ તેજસ્વી (લાલ/સફેદ) દેખાય છે, ઠંડી વસ્તુઓ ઘેરી (નીલી/કાળી) દેખાય છે।',
        scienceBehind:
          'ઉત્સર્જિત ઇન્ફ્રારેડ વિકિરણની માત્રા તાપમાન સાથે ઝડપથી વધે છે (સ્ટેફન-બોલ્ટ્ઝમેન કાયદો: શક્તિ ∝ T⁴)। 37°C (શરીરનું તાપમાન) પરની સપાટી 27°C (કોઠાનું તાપમાન) પરની સપાટી કરતાં ખૂબ વધુ વિકિરણ ઉત્સર્જિત કરે છે।',
        realExample:
          'COVID-19 દરમિયાન, થર્મલ કેમેરાઓએ અતિશય શરીરની ઉષ્મા વિકિરણની સંવેદના કરીને ભારતભરના હવાઈમથકો પર તાવનો પતો લગાવ્યો। ભારતીય સેના LOC પર રાત્રિ નિરીક્ષણ માટે તેમનો ઉપયોગ કરે છે। મુંબઈના અગ્નિશામક ધુમાડાથી ભરેલા ઇમારતોમાં લોકોનું સ્થાન નક્કી કરવા માટે તેમનો ઉપયોગ કરે છે - ઉષ્મા વિકિરણ ધુમાડામાંથી પસાર થાય છે!',
        benefits: [
          'બિન-સંપર્ક તાપમાન માપન (COVID સ્ક્રીનિંગ માટે મહત્વપૂર્ણ)',
          'સંપૂર્ણ અંધકારમાં કામ કરે છે (ઉષ્મા શોધે છે, પ્રકાશ નહીં)',
          'ઇમારતોમાં ઉષ્મા નુકસાન શોધી શકે છે (ઊર્જા ઓડિટ)',
          'તબીબી નિદાન - સોજો અને રક્ત પ્રવાહ સમસ્યાઓ શોધે છે',
        ],
        difficulty: 'technology',
        icon: '📷',
      },
      {
        id: 8,
        title: 'ગરમ વાસણોમાંથી ઉષ્મા વિકિરણ',
        category: 'home',
        description:
          'એક ગરમ ધાતુનું વાસણ ટેબલ પર મૂકવામાં આવ્યું છે (ચૂલાથી દૂર) ધીમે ધીમે ઠંડુ થાય છે। ઉષ્મા ક્યાં જાય છે? તે વિકિરણ દ્વારા ઠંડા વાતાવરણ - દિવાલો, હવા, ટેબલ - માં વિકિરણ કરે છે!',
        howItWorks:
          'ગરમ વાસણ (કહો કે 80°C પર) બધી દિશાઓમાં ઉષ્મા વિકિરણ ઉત્સર્જિત કરે છે। ઠંડું વાતાવરણ (25°C કોઠાના તાપમાન પર) આ વિકિરણને શોષે છે। વાસણ તાપમાન સમાન થાય ત્યાં સુધી વિકિરણ કરતું રહે છે।',
        scienceBehind:
          'બધી વસ્તુઓ સતત પોતાની આસપાસ ઉષ્માનો વિકિરણ કરે છે। ગરમ વસ્તુઓ વધુ તીવ્રતાથી વિકિરણ કરે છે। ચોખ્ખું ઉષ્મા સ્થાનાંતરણ ગરમથી ઠંડા તરફ થાય છે। 80°C નું વાસણ 25°C ની દિવાલ કરતાં લગભગ 16 ગણી વધુ શક્તિ વિકિરણ કરે છે!',
        realExample:
          'રસોઈ પછી, દાદીનું ગરમ કઢાઈ રસોઈ કાઉન્ટર પર ધીમે ધીમે ઠંડુ થાય છે। જો તમે તમારો હાથ નજીક રાખો છો (સ્પર્શ કર્યા વગર!) તો તમે તેમાંથી વિકિરણ થતી ગરમી અનુભવી શકો છો। ધાતુ ઇન્ફ્રારેડ વિકિરણ ઉત્સર્જિત કરે છે જે તમારી ત્વચા ગરમી તરીકે અનુભવે છે।',
        benefits: [
          'કોઈ પ્રયાસ વગર સ્વચાલિત ઠંડક',
          'વિકિરણ ચાલન અને સંવહન સાથે કામ કરે છે',
          'સીધા સંપર્ક વગર ગરમી અનુભવી શકે છે (સુરક્ષા સુવિધા)',
          'વિકિરણને કારણે ગરમ વસ્તુઓ માટે ઝડપી ઠંડક',
        ],
        difficulty: 'everyday',
        icon: '🍲',
      },
      {
        id: 9,
        title: 'રાત્રિ દ્રષ્ટિ ટેક્નોલોજી',
        category: 'technology',
        description:
          'રાત્રિ દ્રષ્ટિ ઉપકરણો અંધારામાં ગરમ વસ્તુઓ (મનુષ્યો, પશુઓ, વાહનો) થી ઇન્ફ્રારેડ ઉષ્મા વિકિરણનો પતો લગાવીને આપણને \'જોવા\' દે છે, ભલે દૃશ્યમાન પ્રકાશ ન હોય।',
        howItWorks:
          'આસપાસ કરતાં ગરમ વસ્તુઓ વધુ ઇન્ફ્રારેડ વિકિરણ ઉત્સર્જિત કરે છે। રાત્રિ દ્રષ્ટિ ઉપકરણો આ અદૃશ્ય વિકિરણનો પતો લગાવે છે, સિગ્નલને ઇલેક્ટ્રોનિક રીતે વિસ્તૃત કરે છે, અને તેને લીલા રંગની દૃશ્યમાન છબી તરીકે પ્રદર્શિત કરે છે।',
        scienceBehind:
          '37°C પર માનવ શરીર 9.4 માઇક્રોમીટર તરંગલંબાઈ પર પીક વિકિરણ ઉત્સર્જિત કરે છે (ઇન્ફ્રારેડ - આંખો માટે અદૃશ્ય)। રાત્રિ દ્રષ્ટિ 0.7-14 માઇક્રોમીટર તરંગલંબાઈ શોધે છે, નજીક અને થર્મલ ઇન્ફ્રારેડ પ્રદેશોને આવરી લે છે।',
        realExample:
          'ભારતીય સુરક્ષા દળો સીમાઓ પર રાત્રિ દ્રષ્ટિનો ઉપયોગ કરે છે। જીમ કોર્બેટ રાષ્ટ્રીય ઉદ્યાનમાં વન્યજીવન સંશોધકો રાત્રિચર વાઘોનો અભ્યાસ કરવા માટે થર્મલ કેમેરાનો ઉપયોગ કરે છે તેમને ખલેલ પહોંચાડ્યા વગર। કેમેરા ઠંડા જંગલની પૃષ્ઠભૂમિ સામે વાઘોમાંથી શરીરની ઉષ્મા વિકિરણનો પતો લગાવે છે।',
        benefits: [
          'સંપૂર્ણ અંધકારમાં સુરક્ષા અને નિરીક્ષણ',
          'દૃશ્યમાન પ્રકાશ વિક્ષેપ વગર વન્યજીવન અવલોકન',
          'રાત્રે શોધ અને બચાવ કામગીરી',
          'લશ્કરી કામગીરી અને સીમા પહેરો',
        ],
        difficulty: 'technology',
        icon: '🌙',
      },
      {
        id: 10,
        title: 'પૃથ્વીનું ઊર્જા સંતુલન',
        category: 'nature',
        description:
          'પૃથ્વી સૂર્યથી વિકિરણ પ્રાપ્ત કરે છે અને અવકાશમાં પાછી ઉષ્મા વિકિરણ કરે છે। આ બે વિકિરણ પ્રવાહો સંતુલિત હોવા જોઈએ, અન્યથા પૃથ્વી સતત ગરમ અથવા ઠંડી થતી રહેશે!',
        howItWorks:
          'પૃથ્વી વાતાવરણની ટોચ પર ~1360 W/m² સૌર વિકિરણ પ્રાપ્ત કરે છે। લગભગ 30% અવકાશમાં પાછું પરાવર્તિત થાય છે। બાકી 70% શોષાય છે, પૃથ્વીને ગરમ કરે છે, અને અવકાશમાં ઇન્ફ્રારેડ વિકિરણ તરીકે પુનઃ વિકિરણ થાય છે।',
        scienceBehind:
          'આવતું સૌર વિકિરણ (લઘુ તરંગ) = બહાર જતું સ્થળીય વિકિરણ (દીર્ઘ તરંગ) સ્થિર તાપમાન માટે। પૃથ્વીનું સરેરાશ તાપમાન ત્યાં સુધી સમાયોજિત થાય છે જ્યાં સુધી બહાર જતું વિકિરણ આવતા વિકિરણની બરાબર ન થાય। હાલમાં ~240 W/m² ચોખ્ખું પ્રાપ્ત થઈ રહ્યું છે, સમાન માત્રા પાછી વિકિરણ કરી રહ્યું છે।',
        realExample:
          'આ સંતુલન પૃથ્વીની આબોહવાને જાળવી રાખે છે। જો કે, વધતી ગ્રીનહાઉસ વાયુઓ વધુ બહાર જતા વિકિરણને ફસાવે છે, જે વાર્મિંગનું કારણ બને છે। આ ભારતીય કૃષિ, પાણી સંસાધનો અને હિમાલયન બરફને અસર કરે છે જેમ કે ગંગટોકની નજીક। વૈજ્ઞાનિકો આબોહવા પરિવર્તનને સમજવા માટે ઉપગ્રહોનો ઉપયોગ કરીને આ સંતુલનનું નિરીક્ષણ કરે છે।',
        benefits: [
          'સ્થિર વૈશ્વિક સરેરાશ તાપમાન (~15°C) જાળવી રાખે છે',
          'અનુમાનિત મોસમ અને આબોહવા પેટર્નને સક્ષમ બનાવે છે',
          'જીવનને સ્થિર પરિસ્થિતિઓ સાથે અનુકૂળ થવાની મંજૂરી આપે છે',
          'આને સમજવું આબોહવા પરિવર્તનની આગાહી કરવામાં મદદ કરે છે',
        ],
        difficulty: 'nature',
        icon: '⚖️',
      },
    ],
  },
};

const RadiationRealWorld: React.FC<RadiationRealWorldProps> = ({ props }) => {
  const { language: contextLanguage } = useLanguage();
  const language: LanguageCode = (props?.language || contextLanguage || 'en') as LanguageCode;
  const t = translations[language] || translations.en;
  const APPLICATIONS: Application[] =
    t.applications.length > 0 ? t.applications : translations.en.applications;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedApp, setExpandedApp] = useState<number | null>(null);

  const categories = [
    { value: 'all', label: t.categories.all, icon: Globe },
    { value: 'nature', label: t.categories.nature, icon: Sun },
    { value: 'home', label: t.categories.home, icon: Home },
    { value: 'everyday', label: t.categories.everyday, icon: Zap },
    { value: 'technology', label: t.categories.technology, icon: Flame },
    { value: 'clothing', label: t.categories.clothing, icon: Shirt },
  ];

  const filteredApplications = selectedCategory === 'all'
    ? APPLICATIONS
    : APPLICATIONS.filter(app => app.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      nature: 'border-green-300 bg-green-50',
      home: 'border-blue-300 bg-blue-50',
      everyday: 'border-purple-300 bg-purple-50',
      technology: 'border-red-300 bg-red-50',
      clothing: 'border-pink-300 bg-pink-50'
    };
    return colors[category] || 'border-gray-300 bg-gray-50';
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges: { [key: string]: { color: string; label: string } } = {
      everyday: { color: 'bg-green-100 text-green-800', label: t.difficultyLabels.everyday },
      nature: { color: 'bg-blue-100 text-blue-800', label: t.difficultyLabels.nature },
      technology: { color: 'bg-purple-100 text-purple-800', label: t.difficultyLabels.technology },
    };
    return badges[difficulty] || badges.everyday;
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mb-4">
          <Globe className="w-10 h-10" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t.headerTitle}</h1>
            <p className="text-orange-100 text-sm sm:text-base">{t.headerSubtitle}</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category.value
                    ? 'bg-white text-orange-600'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 sm:mt-4 text-orange-100 text-xs sm:text-sm">
          {t.showingCount(filteredApplications.length)}
        </div>
      </div>

      {/* Applications Grid */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="space-y-6">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className={`border-2 rounded-2xl overflow-hidden transition-all ${
                expandedApp === app.id ? 'shadow-xl' : 'shadow-md hover:shadow-lg'
              } ${getCategoryColor(app.category)}`}
            >
              {/* Application Header */}
              <button
                onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                className="w-full p-4 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-white hover:bg-opacity-50 transition text-left"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 text-left">
                  <div className="text-3xl sm:text-4xl">{app.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{app.title}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyBadge(app.difficulty).color}`}>
                        {getDifficultyBadge(app.difficulty).label}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 capitalize">• {app.category}</span>
                    </div>
                  </div>
                </div>
                {expandedApp === app.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedApp === app.id && (
                <div className="px-4 sm:px-6 pb-6 space-y-6 bg-white">
                  {/* Description */}
                  <div className="border-l-4 border-cyan-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-cyan-500">●</span> {t.sectionTitles.whatIsIt}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{app.description}</p>
                  </div>

                  {/* How It Works */}
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-purple-500">●</span> {t.sectionTitles.howItWorks}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{app.howItWorks}</p>
                  </div>

                  {/* Science Behind It */}
                  <div className="border-l-4 border-amber-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-amber-500">●</span> {t.sectionTitles.scienceBehind}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{app.scienceBehind}</p>
                  </div>

                  {/* Real Example */}
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-green-500">●</span> {t.sectionTitles.realExample}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{app.realExample}</p>
                  </div>

                  {/* Benefits */}
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-blue-500">●</span> {t.sectionTitles.benefits}
                    </h4>
                    <ul className="space-y-2">
                      {app.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-500 mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadiationRealWorld;