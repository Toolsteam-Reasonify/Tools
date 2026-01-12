import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { 
  Droplets
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// Type declaration for Chrome extension APIs (to suppress runtime.lastError warnings)
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        lastError?: { message?: string } | undefined;
        sendMessage?: (...args: any[]) => void;
      };
    };
  }
}

// Suppress Chrome extension runtime.lastError warnings
if (typeof window !== 'undefined') {
  // Override console.error to filter out Chrome extension errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args[0]?.toString() || '';
    // Filter out Chrome extension runtime.lastError messages
    if (errorMessage.includes('runtime.lastError') || 
        errorMessage.includes('message port closed') ||
        errorMessage.includes('Unchecked runtime.lastError') ||
        errorMessage.includes('The message port closed')) {
      return; // Suppress these errors
    }
    originalError.apply(console, args);
  };

  // Handle Chrome extension errors globally
  if (window.chrome?.runtime) {
    // Clear any existing lastError to prevent warnings
    try {
      if (window.chrome.runtime.lastError) {
        window.chrome.runtime.lastError = undefined;
      }
    } catch {
      // Ignore errors when clearing
    }

    // Wrap sendMessage to handle errors gracefully
    const originalSendMessage = window.chrome.runtime.sendMessage;
    if (originalSendMessage) {
      window.chrome.runtime.sendMessage = function(...args: any[]) {
        try {
          return originalSendMessage.apply(this, args);
        } catch (error) {
          // Silently handle Chrome extension message errors
          if (error && typeof error === 'object' && 'message' in error) {
            const errorMsg = String(error.message || '');
            if (errorMsg.includes('message port closed') || 
                errorMsg.includes('runtime.lastError')) {
              return; // Suppress these errors
            }
          }
          throw error;
        }
      };
    }
  }

  // Add global error handler to catch Chrome extension errors
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    const errorMessage = String(message || '');
    // Suppress Chrome extension errors
    if (errorMessage.includes('runtime.lastError') || 
        errorMessage.includes('message port closed') ||
        errorMessage.includes('Unchecked runtime.lastError')) {
      return true; // Suppress the error
    }
    // Call original error handler for other errors
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && typeof reason === 'object' && 'message' in reason) {
      const errorMsg = String(reason.message || '');
      if (errorMsg.includes('runtime.lastError') || 
          errorMsg.includes('message port closed') ||
          errorMsg.includes('Unchecked runtime.lastError')) {
        event.preventDefault(); // Suppress the error
      }
    }
  });
}

// ============================================================================
// Type Definitions
// ============================================================================
export type Language = 'en' | 'hi' | 'gu';
export type LanguageCode = Language; // Alias for compatibility

export interface LanguageSelector {
  en: string;
  hi: string;
  gu: string;
  selectorLabel: string;
}

export interface NavTranslations {
  logo: string;
  tabs: {
    learn: string;
    practice: string;
    applications: string;
  };
}

export interface BaseTranslations {
  language: LanguageSelector;
  nav: NavTranslations;
  learn: {
    title: string;
    subtitle: string;
    whatIsIt: string;
    realLifeExample: string;
    previous: string;
    autoPlay: string;
    pause: string;
    next: string;
    startOver: string;
    phases: {
      evaporation: {
        title: string;
        simple: string[];
        example: string[];
      };
      condensation: {
        title: string;
        simple: string[];
        example: string[];
      };
      precipitation: {
        title: string;
        simple: string[];
        example: string[];
      };
      collection: {
        title: string;
        simple: string[];
        example: string[];
      };
    };
  };
  practice: {
    question: string;
    of: string;
    score: string;
    submitAnswer: string;
    nextQuestion: string;
    viewResults: string;
    explanation: string;
    quizCompleted: string;
    yourScore: string;
    perfect: string;
    excellent: string;
    goodJob: string;
    keepPracticing: string;
    tryAgain: string;
    questions: Array<{
      question: string;
      options: string[];
      explanation: string;
    }>;
  };
  realWorld: {
    title: string;
    subtitle: string;
    overview: string;
    keyFeatures: string;
    impact: string;
    location: string;
    realWorldImpact: string;
    connection: string;
    examples: Array<{
      title: string;
      location: string;
      description: string;
      category: string;
      impact: string;
      keyFeatures: string[];
      connection: string;
    }>;
  };
}

// Basic translations data
const translationsData: { [key: string]: BaseTranslations } = {
  en: {
    language: {
      en: "English",
      hi: "Hindi",
      gu: "Gujarati",
      selectorLabel: "Choose language",
    },
    nav: {
      logo: "Water Cycle",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        applications: "Real World",
      },
    },
    learn: {
      title: "The Water Cycle",
      subtitle: "Learn how water moves around our planet in a continuous cycle!",
      whatIsIt: "What is it?",
      realLifeExample: "Real-Life Example",
      previous: "Previous",
      autoPlay: "Auto Play",
      pause: "Pause",
      next: "Next",
      startOver: "Start Over",
      phases: {
        evaporation: {
          title: "Evaporation & Transpiration",
          simple: [
            "The Sun heats up water in oceans, rivers, and lakes.",
            "It turns into invisible water vapor (like steam) that rises into the air.",
            "Plants also release water vapor through tiny holes in their leaves called stomata."
          ],
          example: [
            "Think about a puddle after it rains.",
            "On a sunny day, the puddle gets smaller until it disappears.",
            "The water turned into vapor and went up into the sky!",
            "Trees also \"breathe out\" water vapor through their leaves."
          ]
        },
        condensation: {
          title: "Condensation",
          simple: [
            "Water vapor rises high into the sky where it's very cold.",
            "It cools down and turns back into tiny water droplets.",
            "These millions of tiny droplets cluster together to form clouds."
          ],
          example: [
            "Breathe on a cold window.",
            "You see water droplets form on the glass.",
            "That's condensation!",
            "Your warm breath (water vapor) hits the cold surface and turns back into liquid water."
          ]
        },
        precipitation: {
          title: "Precipitation",
          simple: [
            "Clouds get too heavy with water droplets.",
            "Gravity pulls the water back down to Earth.",
            "It falls as rain, snow, sleet, or hail depending on temperature."
          ],
          example: [
            "Clouds are like giant sponges floating in the sky.",
            "When the sponge gets too full, the water falls down.",
            "Warm weather = rain. Cold weather = snow!"
          ]
        },
        collection: {
          title: "Collection & Infiltration",
          simple: [
            "Rainwater flows downhill into rivers, streams, lakes, and oceans.",
            "Some water soaks into the ground through soil and rocks.",
            "This is called infiltration."
          ],
          example: [
            "After rain, water flows down streets into drains.",
            "It travels to rivers, then lakes or ocean.",
            "Some rainwater soaks into soil where plants drink it."
          ]
        }
      }
    },
    practice: {
      question: "Question",
      of: "of",
      score: "Score",
      submitAnswer: "Submit Answer",
      nextQuestion: "Next Question",
      viewResults: "View Results",
      explanation: "Explanation",
      quizCompleted: "Quiz Completed!",
      yourScore: "Your Score",
      perfect: "Perfect! You're a Water Cycle expert!",
      excellent: "Excellent work! You understand the water cycle well!",
      goodJob: "Good job! Keep learning about the water cycle!",
      keepPracticing: "Keep practicing! Review the water cycle concepts.",
      tryAgain: "Try Again",
      questions: [
        {
          question: "In which three states does water exist in nature?",
          options: [
            "Liquid, Solid, Plasma",
            "Liquid, Solid, Gas",
            "Solid, Gas, Plasma",
            "Liquid, Gas, Plasma"
          ],
          explanation: "Water exists as liquid (oceans, rivers, lakes), solid (snow, ice, glaciers), and gas (water vapour in the atmosphere)."
        },
        {
          question: "What is the process called when water vapour rises up, cools down and forms clouds?",
          options: [
            "Evaporation",
            "Precipitation",
            "Condensation",
            "Transpiration"
          ],
          explanation: "Condensation is the process where water vapour cools down and changes back into liquid water, forming clouds."
        },
        {
          question: "Through which material does water seep the fastest?",
          options: [
            "Clay",
            "Sand",
            "Gravel",
            "Rock"
          ],
          explanation: "Water seeps fastest through gravel because the spaces between gravel particles are wider compared to sand and clay."
        },
        {
          question: "What are the underground layers of sediments and rocks that store water called?",
          options: [
            "Reservoirs",
            "Aquifers",
            "Water tables",
            "Underground lakes"
          ],
          explanation: "Aquifers are underground layers of sediments and rocks that store water in their pore spaces, which we access through wells."
        },
        {
          question: "What is the process of surface water seeping through soil and rocks called?",
          options: [
            "Percolation",
            "Evaporation",
            "Infiltration",
            "Precipitation"
          ],
          explanation: "Infiltration is the process where surface water seeps through soil and rocks beneath Earth's surface to form groundwater."
        }
      ]
    },
    realWorld: {
      title: "Real World",
      subtitle: "Discover how heat transfer and water cycle concepts are applied in real life",
      overview: "Overview",
      keyFeatures: "Key Features",
      impact: "Impact",
      location: "Location",
      realWorldImpact: "Real-World Impact",
      connection: "Connection to Water Cycle & Heat Transfer",
      examples: [
        {
          title: "Ice Stupa - Ladakh",
          location: "Ladakh, India",
          description: "An innovative water conservation technique where mountain stream water is channeled through underground pipes and sprayed into cold air during winters. The water freezes layer by layer, creating tall cone-shaped ice structures that melt slowly in spring, providing water for farming throughout summer.",
          category: "Water Conservation",
          impact: "Provides water supply during water-scarce spring season when snow hasn't melted enough",
          keyFeatures: [
            "Built during extreme winters",
            "Uses natural freezing temperatures",
            "Melts slowly to provide sustained water supply",
            "Supports agriculture in arid regions"
          ],
          connection: "Ice Stupa utilizes the water cycle by storing water in solid form (ice) during winter, which then melts and evaporates, completing the cycle while providing agricultural water."
        },
        {
          title: "Rainwater Harvesting Systems",
          location: "Urban Areas, India",
          description: "Systems that collect and store rainwater from rooftops and other surfaces. The collected water is filtered and directed into underground storage tanks or used to recharge groundwater through recharge pits, helping replenish depleting aquifers.",
          category: "Groundwater Recharge",
          impact: "Reduces dependency on municipal water supply and recharges groundwater levels",
          keyFeatures: [
            "Collects rainwater from rooftops",
            "Filters and stores water",
            "Recharges underground aquifers",
            "Reduces urban flooding"
          ],
          connection: "Rainwater harvesting captures precipitation from the water cycle and uses infiltration to recharge aquifers, directly participating in the groundwater formation process."
        },
        {
          title: "Traditional Houses - Uttarakhand Himalayas",
          location: "Mori Block, Uttarkashi, Uttarakhand",
          description: "Houses built with walls made of two wooden layers filled with cow dung and mud between them. This design utilizes the poor heat conductivity of wood and mud to prevent heat loss, keeping homes warm during harsh winters with heavy snowfall.",
          category: "Heat Transfer Application",
          impact: "Maintains warmth without external heating, saving energy in extreme cold climates",
          keyFeatures: [
            "Double wooden layer walls",
            "Natural insulation with mud and cow dung",
            "Poor conductors prevent heat loss",
            "Sustainable and eco-friendly"
          ],
          connection: "Traditional houses use poor heat conductors to minimize conduction, preventing heat loss and maintaining comfortable indoor temperatures in extreme climates."
        },
        {
          title: "Hollow Brick Construction",
          location: "Hot and Cold Climate Regions",
          description: "Buildings constructed using hollow bricks that trap air in their cavities. Since air is a poor conductor of heat, these buildings stay warm in winters and cool in summers by preventing heat transfer between inside and outside environments.",
          category: "Thermal Insulation",
          impact: "Reduces energy consumption for heating and cooling, making buildings more sustainable",
          keyFeatures: [
            "Air trapped in hollow spaces",
            "Acts as natural insulator",
            "Reduces energy bills",
            "Effective in extreme climates"
          ],
          connection: "Hollow bricks trap air (a poor conductor) to prevent heat transfer through conduction, demonstrating practical application of thermal insulation principles."
        },
        {
          title: "Traditional Bukhari Heater",
          location: "Upper Himalayan Regions",
          description: "A traditional room heater consisting of an iron stove burning wood or charcoal, with a chimney pipe for smoke venting. It demonstrates all three heat transfer processes: conduction (from flame to stove), convection (heating air and water), and radiation (warmth felt around it). The flat top can be used for cooking.",
          category: "Heat Transfer",
          impact: "Provides heating and cooking solution in areas with limited modern infrastructure",
          keyFeatures: [
            "Demonstrates conduction, convection, and radiation",
            "Multi-purpose: heating and cooking",
            "Uses locally available fuel",
            "Effective chimney system"
          ],
          connection: "Bukhari demonstrates all three heat transfer methods: conduction (metal heating), convection (air circulation), and radiation (warmth felt nearby)."
        }
      ]
    },
  },
  hi: {
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "भाषा चुनें",
    },
    nav: {
      logo: "जल चक्र",
      tabs: {
        learn: "सीखें",
        practice: "अभ्यास",
        applications: "वास्तविक दुनिया",
      },
    },
    learn: {
      title: "जल चक्र",
      subtitle: "जानें कि पानी हमारे ग्रह के चारों ओर एक निरंतर चक्र में कैसे चलता है!",
      whatIsIt: "यह क्या है?",
      realLifeExample: "वास्तविक जीवन का उदाहरण",
      previous: "पिछला",
      autoPlay: "ऑटो प्ले",
      pause: "रोकें",
      next: "अगला",
      startOver: "शुरू करें",
      phases: {
        evaporation: {
          title: "वाष्पीकरण और वाष्पोत्सर्जन",
          simple: [
            "सूर्य महासागरों, नदियों और झीलों में पानी को गर्म करता है।",
            "यह अदृश्य जल वाष्प (भाप की तरह) में बदल जाता है जो हवा में उठता है।",
            "पौधे भी अपनी पत्तियों में छोटे छिद्रों के माध्यम से जल वाष्प छोड़ते हैं जिन्हें स्टोमेटा कहा जाता है।"
          ],
          example: [
            "बारिश के बाद एक पोखर के बारे में सोचें।",
            "धूप वाले दिन, पोखर छोटा हो जाता है जब तक कि वह गायब नहीं हो जाता।",
            "पानी वाष्प में बदल गया और आकाश में चला गया!",
            "पेड़ भी अपनी पत्तियों के माध्यम से जल वाष्प \"सांस छोड़ते\" हैं।"
          ]
        },
        condensation: {
          title: "संघनन",
          simple: [
            "जल वाष्प आकाश में बहुत ऊंचाई तक उठता है जहां यह बहुत ठंडा होता है।",
            "यह ठंडा हो जाता है और छोटी जल बूंदों में वापस बदल जाता है।",
            "ये लाखों छोटी बूंदें एक साथ मिलकर बादल बनाती हैं।"
          ],
          example: [
            "एक ठंडी खिड़की पर सांस छोड़ें।",
            "आप कांच पर जल बूंदें बनते देखते हैं।",
            "यही संघनन है!",
            "आपकी गर्म सांस (जल वाष्प) ठंडी सतह से टकराती है और तरल पानी में वापस बदल जाती है।"
          ]
        },
        precipitation: {
          title: "वर्षा",
          simple: [
            "बादल जल बूंदों से बहुत भारी हो जाते हैं।",
            "गुरुत्वाकर्षण पानी को वापस पृथ्वी पर खींचता है।",
            "यह तापमान के आधार पर बारिश, बर्फ, ओले या ओलावृष्टि के रूप में गिरता है।"
          ],
          example: [
            "बादल आकाश में तैरते विशाल स्पंज की तरह हैं।",
            "जब स्पंज बहुत भर जाता है, तो पानी नीचे गिर जाता है।",
            "गर्म मौसम = बारिश। ठंडा मौसम = बर्फ!"
          ]
        },
        collection: {
          title: "संग्रह और अंतःस्राव",
          simple: [
            "बारिश का पानी नदियों, नालों, झीलों और महासागरों में नीचे की ओर बहता है।",
            "कुछ पानी मिट्टी और चट्टानों के माध्यम से जमीन में समा जाता है।",
            "इसे अंतःस्राव कहा जाता है।"
          ],
          example: [
            "बारिश के बाद, पानी सड़कों से नालियों में बहता है।",
            "यह नदियों में जाता है, फिर झीलों या महासागर में।",
            "कुछ बारिश का पानी मिट्टी में समा जाता है जहां पौधे इसे पीते हैं।"
          ]
        }
      }
    },
    practice: {
      question: "प्रश्न",
      of: "का",
      score: "स्कोर",
      submitAnswer: "उत्तर जमा करें",
      nextQuestion: "अगला प्रश्न",
      viewResults: "परिणाम देखें",
      explanation: "व्याख्या",
      quizCompleted: "क्विज़ पूर्ण!",
      yourScore: "आपका स्कोर",
      perfect: "बिल्कुल सही! आप जल चक्र के विशेषज्ञ हैं!",
      excellent: "उत्कृष्ट कार्य! आप जल चक्र को अच्छी तरह समझते हैं!",
      goodJob: "अच्छा काम! जल चक्र के बारे में सीखना जारी रखें!",
      keepPracticing: "अभ्यास जारी रखें! जल चक्र की अवधारणाओं की समीक्षा करें।",
      tryAgain: "फिर से कोशिश करें",
      questions: [
        {
          question: "प्रकृति में पानी किन तीन अवस्थाओं में मौजूद होता है?",
          options: [
            "तरल, ठोस, प्लाज्मा",
            "तरल, ठोस, गैस",
            "ठोस, गैस, प्लाज्मा",
            "तरल, गैस, प्लाज्मा"
          ],
          explanation: "पानी तरल (महासागर, नदियाँ, झीलें), ठोस (बर्फ, हिमनद) और गैस (वायुमंडल में जल वाष्प) के रूप में मौजूद होता है।"
        },
        {
          question: "जब जल वाष्प ऊपर उठती है, ठंडी होती है और बादल बनाती है, तो इस प्रक्रिया को क्या कहा जाता है?",
          options: [
            "वाष्पीकरण",
            "वर्षा",
            "संघनन",
            "वाष्पोत्सर्जन"
          ],
          explanation: "संघनन वह प्रक्रिया है जहाँ जल वाष्प ठंडी होकर तरल पानी में बदल जाती है, जिससे बादल बनते हैं।"
        },
        {
          question: "किस सामग्री से पानी सबसे तेजी से रिसता है?",
          options: [
            "मिट्टी",
            "रेत",
            "बजरी",
            "चट्टान"
          ],
          explanation: "पानी बजरी से सबसे तेजी से रिसता है क्योंकि बजरी के कणों के बीच की जगह रेत और मिट्टी की तुलना में अधिक चौड़ी होती है।"
        },
        {
          question: "तलछट और चट्टानों की भूमिगत परतें जो पानी संग्रहीत करती हैं, उन्हें क्या कहा जाता है?",
          options: [
            "जलाशय",
            "जलभृत",
            "जल स्तर",
            "भूमिगत झीलें"
          ],
          explanation: "जलभृत तलछट और चट्टानों की भूमिगत परतें हैं जो अपने छिद्र स्थानों में पानी संग्रहीत करती हैं, जिस तक हम कुओं के माध्यम से पहुँचते हैं।"
        },
        {
          question: "सतही पानी के मिट्टी और चट्टानों से रिसने की प्रक्रिया को क्या कहा जाता है?",
          options: [
            "अंतःस्राव",
            "वाष्पीकरण",
            "अंतःस्राव",
            "वर्षा"
          ],
          explanation: "अंतःस्राव वह प्रक्रिया है जहाँ सतही पानी मिट्टी और चट्टानों से पृथ्वी की सतह के नीचे रिसकर भूजल बनाता है।"
        }
      ]
    },
    realWorld: {
      title: "वास्तविक दुनिया",
      subtitle: "खोजें कि ऊष्मा स्थानांतरण और जल चक्र की अवधारणाएं वास्तविक जीवन में कैसे लागू होती हैं",
      overview: "अवलोकन",
      keyFeatures: "मुख्य विशेषताएं",
      impact: "प्रभाव",
      location: "स्थान",
      realWorldImpact: "वास्तविक दुनिया का प्रभाव",
      connection: "जल चक्र और ऊष्मा स्थानांतरण से संबंध",
      examples: [
        {
          title: "आइस स्तूप - लद्दाख",
          location: "लद्दाख, भारत",
          description: "एक नवाचारी जल संरक्षण तकनीक जहाँ पहाड़ी धारा के पानी को भूमिगत पाइपों के माध्यम से चैनल किया जाता है और सर्दियों के दौरान ठंडी हवा में छिड़काव किया जाता है। पानी परत दर परत जम जाता है, लंबे शंकु के आकार की बर्फ संरचनाएं बनाता है जो वसंत में धीरे-धीरे पिघलती हैं, गर्मियों में खेती के लिए पानी प्रदान करती हैं।",
          category: "जल संरक्षण",
          impact: "पानी की कमी वाले वसंत के मौसम में पानी की आपूर्ति प्रदान करता है जब बर्फ पर्याप्त नहीं पिघली होती",
          keyFeatures: [
            "चरम सर्दियों के दौरान निर्मित",
            "प्राकृतिक हिमीकरण तापमान का उपयोग करता है",
            "निरंतर पानी की आपूर्ति के लिए धीरे-धीरे पिघलता है",
            "शुष्क क्षेत्रों में कृषि का समर्थन करता है"
          ],
          connection: "आइस स्तूप जल चक्र का उपयोग करता है जहाँ सर्दियों के दौरान पानी को ठोस रूप (बर्फ) में संग्रहीत किया जाता है, जो फिर पिघलता है और वाष्पित होता है, कृषि जल प्रदान करते हुए चक्र को पूरा करता है।"
        },
        {
          title: "वर्षा जल संचयन प्रणाली",
          location: "शहरी क्षेत्र, भारत",
          description: "प्रणालियाँ जो छतों और अन्य सतहों से वर्षा जल एकत्र और संग्रहीत करती हैं। एकत्रित पानी को फ़िल्टर किया जाता है और भूमिगत भंडारण टैंकों में निर्देशित किया जाता है या रिचार्ज गड्ढों के माध्यम से भूजल को रिचार्ज करने के लिए उपयोग किया जाता है, जो कम हो रहे जलभृतों को पुनः भरने में मदद करता है।",
          category: "भूजल रिचार्ज",
          impact: "नगरपालिका जल आपूर्ति पर निर्भरता कम करता है और भूजल स्तर को रिचार्ज करता है",
          keyFeatures: [
            "छतों से वर्षा जल एकत्र करता है",
            "पानी को फ़िल्टर और संग्रहीत करता है",
            "भूमिगत जलभृतों को रिचार्ज करता है",
            "शहरी बाढ़ को कम करता है"
          ],
          connection: "वर्षा जल संचयन जल चक्र से वर्षा को पकड़ता है और जलभृतों को रिचार्ज करने के लिए अंतःस्राव का उपयोग करता है, भूजल निर्माण प्रक्रिया में सीधे भाग लेता है।"
        },
        {
          title: "पारंपरिक घर - उत्तराखंड हिमालय",
          location: "मोरी ब्लॉक, उत्तरकाशी, उत्तराखंड",
          description: "दो लकड़ी की परतों से बने दीवारों वाले घर जिनके बीच गोबर और मिट्टी भरी होती है। यह डिज़ाइन लकड़ी और मिट्टी की खराब ताप चालकता का उपयोग करता है ताकि ऊष्मा हानि को रोका जा सके, भारी बर्फबारी वाली कठोर सर्दियों के दौरान घरों को गर्म रखता है।",
          category: "ऊष्मा स्थानांतरण अनुप्रयोग",
          impact: "बाहरी हीटिंग के बिना गर्मी बनाए रखता है, चरम ठंडे जलवायु में ऊर्जा बचाता है",
          keyFeatures: [
            "दोहरी लकड़ी की परत दीवारें",
            "मिट्टी और गोबर के साथ प्राकृतिक इन्सुलेशन",
            "खराब चालक ऊष्मा हानि को रोकते हैं",
            "टिकाऊ और पर्यावरण के अनुकूल"
          ],
          connection: "पारंपरिक घर संचालन को कम करने के लिए खराब ऊष्मा चालकों का उपयोग करते हैं, ऊष्मा हानि को रोकते हैं और चरम जलवायु में आरामदायक इनडोर तापमान बनाए रखते हैं।"
        },
        {
          title: "खोखली ईंट निर्माण",
          location: "गर्म और ठंडे जलवायु क्षेत्र",
          description: "खोखली ईंटों का उपयोग करके निर्मित इमारतें जो अपने गुहाओं में हवा को फँसाती हैं। चूंकि हवा ऊष्मा का खराब चालक है, ये इमारतें अंदर और बाहर के वातावरण के बीच ऊष्मा स्थानांतरण को रोककर सर्दियों में गर्म और गर्मियों में ठंडी रहती हैं।",
          category: "थर्मल इन्सुलेशन",
          impact: "हीटिंग और कूलिंग के लिए ऊर्जा खपत को कम करता है, इमारतों को अधिक टिकाऊ बनाता है",
          keyFeatures: [
            "खोखले स्थानों में फँसी हवा",
            "प्राकृतिक इन्सुलेटर के रूप में कार्य करता है",
            "ऊर्जा बिल कम करता है",
            "चरम जलवायु में प्रभावी"
          ],
          connection: "खोखली ईंटें हवा (एक खराब चालक) को फँसाती हैं ताकि संचालन के माध्यम से ऊष्मा स्थानांतरण को रोका जा सके, थर्मल इन्सुलेशन सिद्धांतों के व्यावहारिक अनुप्रयोग को प्रदर्शित करता है।"
        },
        {
          title: "पारंपरिक बुखारी हीटर",
          location: "ऊपरी हिमालयी क्षेत्र",
          description: "एक पारंपरिक कमरा हीटर जिसमें लकड़ी या कोयला जलाने वाला लोहे का चूल्हा होता है, धुएं के वेंटिंग के लिए चिमनी पाइप के साथ। यह तीनों ऊष्मा स्थानांतरण प्रक्रियाओं को प्रदर्शित करता है: संचालन (लौ से चूल्हे तक), संवहन (हवा और पानी को गर्म करना), और विकिरण (इसके आसपास महसूस की गई गर्मी)। सपाट शीर्ष का उपयोग खाना पकाने के लिए किया जा सकता है।",
          category: "ऊष्मा स्थानांतरण",
          impact: "सीमित आधुनिक बुनियादी ढांचे वाले क्षेत्रों में हीटिंग और खाना पकाने का समाधान प्रदान करता है",
          keyFeatures: [
            "संचालन, संवहन और विकिरण को प्रदर्शित करता है",
            "बहुउद्देशीय: हीटिंग और खाना पकाना",
            "स्थानीय रूप से उपलब्ध ईंधन का उपयोग करता है",
            "प्रभावी चिमनी प्रणाली"
          ],
          connection: "बुखारी तीनों ऊष्मा स्थानांतरण विधियों को प्रदर्शित करता है: संचालन (धातु हीटिंग), संवहन (हवा परिसंचरण), और विकिरण (पास महसूस की गई गर्मी)।"
        }
      ]
    },
  },
  gu: {
    language: {
      en: "English",
      hi: "હિન્દી",
      gu: "ગુજરાતી",
      selectorLabel: "ભાષા પસંદ કરો",
    },
    nav: {
      logo: "જળ ચક્ર",
      tabs: {
        learn: "શીખો",
        practice: "પ્રેક્ટિસ",
        applications: "વાસ્તવિક વિશ્વ",
      },
    },
    learn: {
      title: "જળ ચક્ર",
      subtitle: "જાણો કે પાણી આપણા ગ્રહની આસપાસ સતત ચક્રમાં કેવી રીતે ફરે છે!",
      whatIsIt: "આ શું છે?",
      realLifeExample: "વાસ્તવિક જીવનનું ઉદાહરણ",
      previous: "પહેલાનું",
      autoPlay: "ઓટો પ્લે",
      pause: "રોકો",
      next: "આગળ",
      startOver: "ફરી શરૂ કરો",
      phases: {
        evaporation: {
          title: "બાષ્પીભવન અને ટ્રાન્સપિરેશન",
          simple: [
            "સૂર્ય મહાસાગરો, નદીઓ અને તળાવોમાં પાણીને ગરમ કરે છે।",
            "તે અદૃશ્ય પાણીની વરાળ (ભાફ જેવી) માં બદલાય છે જે હવામાં ઉભરે છે।",
            "છોડ પણ તેમની પાંદડીઓમાં નાના છિદ્રો દ્વારા પાણીની વરાળ છોડે છે જેને સ્ટોમેટા કહેવાય છે।"
          ],
          example: [
            "વરસાદ પછી એક પડખું વિશે વિચારો।",
            "સૂર્યમુખી દિવસે, પડખું નાનું થઈ જાય છે જ્યાં સુધી તે અદૃશ્ય થઈ જાય નહીં।",
            "પાણી વરાળમાં બદલાઈ ગયું અને આકાશમાં ચડી ગયું!",
            "ઝાડ પણ તેમની પાંદડીઓ દ્વારા પાણીની વરાળ \"શ્વાસ છોડે\" છે।"
          ]
        },
        condensation: {
          title: "સંઘનન",
          simple: [
            "પાણીની વરાળ આકાશમાં ખૂબ ઊંચાઈ સુધી ઉભરે છે જ્યાં તે ખૂબ ઠંડું હોય છે।",
            "તે ઠંડું થઈ જાય છે અને નાના પાણીના ટીપાંમાં પાછું બદલાય છે।",
            "આ લાખો નાના ટીપાંઓ એકસાથે મળીને વાદળો બનાવે છે।"
          ],
          example: [
            "એક ઠંડી વિંડો પર શ્વાસ છોડો।",
            "તમે કાચ પર પાણીના ટીપાં બનતા જુઓ છો।",
            "તે સંઘનન છે!",
            "તમારી ગરમ શ્વાસ (પાણીની વરાળ) ઠંડી સપાટીને અથડાય છે અને પ્રવાહી પાણીમાં પાછું બદલાય છે।"
          ]
        },
        precipitation: {
          title: "વરસાદ",
          simple: [
            "વાદળો પાણીના ટીપાંથી ખૂબ ભારે થઈ જાય છે।",
            "ગુરુત્વાકર્ષણ પાણીને પાછું પૃથ્વી પર ખેંચે છે।",
            "તે તાપમાનના આધારે વરસાદ, બરફ, ઓલાવૃષ્ટિ અથવા ગ્રેપલ તરીકે પડે છે।"
          ],
          example: [
            "વાદળો આકાશમાં તરતા વિશાળ સ્પોન્જ જેવા છે।",
            "જ્યારે સ્પોન્જ ખૂબ ભરાઈ જાય છે, ત્યારે પાણી નીચે પડે છે।",
            "ગરમ હવામાન = વરસાદ. ઠંડું હવામાન = બરફ!"
          ]
        },
        collection: {
          title: "સંગ્રહ અને અંતર્સ્રાવ",
          simple: [
            "વરસાદનું પાણી નદીઓ, નાળા, તળાવો અને મહાસાગરોમાં નીચે તરફ વહે છે।",
            "કેટલુંક પાણી માટી અને ખડકો દ્વારા જમીનમાં ભીંજાય છે।",
            "આને અંતર્સ્રાવ કહેવાય છે।"
          ],
          example: [
            "વરસાદ પછી, પાણી શેરીઓમાંથી નાળાઓમાં વહે છે।",
            "તે નદીઓમાં જાય છે, પછી તળાવો અથવા મહાસાગરમાં।",
            "કેટલુંક વરસાદનું પાણી માટીમાં ભીંજાય છે જ્યાં છોડ તેને પીવે છે।"
          ]
        }
      }
    },
    practice: {
      question: "પ્રશ્ન",
      of: "ના",
      score: "સ્કોર",
      submitAnswer: "જવાબ સબમિટ કરો",
      nextQuestion: "આગળનો પ્રશ્ન",
      viewResults: "પરિણામો જુઓ",
      explanation: "સમજૂતી",
      quizCompleted: "ક્વિઝ પૂર્ણ!",
      yourScore: "તમારો સ્કોર",
      perfect: "સંપૂર્ણ! તમે જળ ચક્રના નિષ્ણાત છો!",
      excellent: "ઉત્કૃષ્ટ કાર્ય! તમે જળ ચક્રને સારી રીતે સમજો છો!",
      goodJob: "સારું કામ! જળ ચક્ર વિશે શીખવાનું ચાલુ રાખો!",
      keepPracticing: "પ્રેક્ટિસ ચાલુ રાખો! જળ ચક્રની વિભાવનાઓની સમીક્ષા કરો.",
      tryAgain: "ફરી પ્રયાસ કરો",
      questions: [
        {
          question: "પ્રકૃતિમાં પાણી કઈ ત્રણ અવસ્થાઓમાં અસ્તિત્વ ધરાવે છે?",
          options: [
            "પ્રવાહી, ઘન, પ્લાઝમા",
            "પ્રવાહી, ઘન, વાયુ",
            "ઘન, વાયુ, પ્લાઝમા",
            "પ્રવાહી, વાયુ, પ્લાઝમા"
          ],
          explanation: "પાણી પ્રવાહી (મહાસાગરો, નદીઓ, તળાવો), ઘન (બરફ, હિમનદ) અને વાયુ (વાતાવરણમાં પાણીની વરાળ) તરીકે અસ્તિત્વ ધરાવે છે।"
        },
        {
          question: "જ્યારે પાણીની વરાળ ઉપર ઉઠે છે, ઠંડી થાય છે અને વાદળો બનાવે છે, ત્યારે આ પ્રક્રિયાને શું કહેવાય છે?",
          options: [
            "બાષ્પીભવન",
            "વરસાદ",
            "સંઘનન",
            "ટ્રાન્સપિરેશન"
          ],
          explanation: "સંઘનન એ પ્રક્રિયા છે જ્યાં પાણીની વરાળ ઠંડી થઈને પ્રવાહી પાણીમાં બદલાય છે, જે વાદળો બનાવે છે।"
        },
        {
          question: "કઈ સામગ્રી દ્વારા પાણી સૌથી ઝડપથી રસે છે?",
          options: [
            "માટી",
            "રેતી",
            "બજરી",
            "ખડક"
          ],
          explanation: "પાણી બજરી દ્વારા સૌથી ઝડપથી રસે છે કારણ કે બજરીના કણો વચ્ચેની જગ્યા રેતી અને માટીની તુલનામાં વધુ પહોળી હોય છે।"
        },
        {
          question: "તલછટ અને ખડકોની ભૂગર્ભ સ્તરો જે પાણી સંગ્રહિત કરે છે તેને શું કહેવાય છે?",
          options: [
            "જળાશય",
            "જળભર",
            "પાણીનું ટેબલ",
            "ભૂગર્ભ તળાવો"
          ],
          explanation: "જળભર એ તલછટ અને ખડકોની ભૂગર્ભ સ્તરો છે જે તેમના છિદ્ર સ્થાનોમાં પાણી સંગ્રહિત કરે છે, જેની પહોંચ આપણે કૂવાઓ દ્વારા કરીએ છીએ।"
        },
        {
          question: "સપાટીના પાણીની માટી અને ખડકો દ્વારા રસવાની પ્રક્રિયાને શું કહેવાય છે?",
          options: [
            "પરકોલેશન",
            "બાષ્પીભવન",
            "અંતર્સ્રાવ",
            "વરસાદ"
          ],
          explanation: "અંતર્સ્રાવ એ પ્રક્રિયા છે જ્યાં સપાટીનું પાણી માટી અને ખડકો દ્વારા પૃથ્વીની સપાટીની નીચે રસીને ભૂજળ બનાવે છે।"
        }
      ]
    },
    realWorld: {
      title: "વાસ્તવિક વિશ્વ",
      subtitle: "શોધો કે ઉષ્મા સ્થાનાંતરણ અને જળ ચક્રની વિભાવનાઓ વાસ્તવિક જીવનમાં કેવી રીતે લાગુ થાય છે",
      overview: "સંખ્યાત્મક",
      keyFeatures: "મુખ્ય લક્ષણો",
      impact: "પ્રભાવ",
      location: "સ્થાન",
      realWorldImpact: "વાસ્તવિક વિશ્વનો પ્રભાવ",
      connection: "જળ ચક્ર અને ઉષ્મા સ્થાનાંતરણ સાથે જોડાણ",
      examples: [
        {
          title: "આઇસ સ્તૂપ - લદાખ",
          location: "લદાખ, ભારત",
          description: "એક નવીન જળ સંરક્ષણ તકનીક જ્યાં પહાડી ધારાના પાણીને ભૂગર્ભ પાઇપો દ્વારા ચેનલ કરવામાં આવે છે અને શિયાળા દરમિયાન ઠંડી હવામાં છાંટવામાં આવે છે। પાણી સ્તર દ્વારા સ્તર જમે છે, લાંબા શંકુ આકારની બરફની રચનાઓ બનાવે છે જે વસંતમાં ધીમે ધીમે પીગળે છે, ઉનાળા દરમિયાન ખેતી માટે પાણી પ્રદાન કરે છે।",
          category: "જળ સંરક્ષણ",
          impact: "પાણીની ખોટ વાળા વસંતના મોસમ દરમિયાન પાણીની પુરવઠો પ્રદાન કરે છે જ્યારે બરફ પૂરતી પીગળી નથી",
          keyFeatures: [
            "ચરમ શિયાળા દરમિયાન બનાવવામાં આવે છે",
            "પ્રાકૃતિક હિમીકરણ તાપમાનનો ઉપયોગ કરે છે",
            "નિરંતર પાણીની પુરવઠા માટે ધીમે ધીમે પીગળે છે",
            "શુષ્ક પ્રદેશોમાં કૃષિને ટેકો આપે છે"
          ],
          connection: "આઇસ સ્તૂપ જળ ચક્રનો ઉપયોગ કરે છે જ્યાં શિયાળા દરમિયાન પાણીને ઘન સ્વરૂપ (બરફ) માં સંગ્રહિત કરવામાં આવે છે, જે પછી પીગળે છે અને બાષ્પીભવન થાય છે, કૃષિ જળ પ્રદાન કરતી વખતે ચક્રને પૂર્ણ કરે છે।"
        },
        {
          title: "વરસાદ પાણી સંચય પ્રણાલી",
          location: "શહેરી વિસ્તારો, ભારત",
          description: "પ્રણાલીઓ જે છતો અને અન્ય સપાટીઓથી વરસાદ પાણી એકત્રિત અને સંગ્રહિત કરે છે। એકત્રિત પાણીને ફિલ્ટર કરવામાં આવે છે અને ભૂગર્ભ સંગ્રહ ટાંકીઓમાં નિર્દેશિત કરવામાં આવે છે અથવા રિચાર્જ ખાડાઓ દ્વારા ભૂજળને રિચાર્જ કરવા માટે ઉપયોગ કરવામાં આવે છે, જે ઘટતા જળભરને ફરીથી ભરવામાં મદદ કરે છે।",
          category: "ભૂજળ રિચાર્જ",
          impact: "નગરપાલિકા પાણી પુરવઠા પર નિર્ભરતા ઘટાડે છે અને ભૂજળ સ્તરને રિચાર્જ કરે છે",
          keyFeatures: [
            "છતોમાંથી વરસાદ પાણી એકત્રિત કરે છે",
            "પાણીને ફિલ્ટર અને સંગ્રહિત કરે છે",
            "ભૂગર્ભ જળભરને રિચાર્જ કરે છે",
            "શહેરી પૂરને ઘટાડે છે"
          ],
          connection: "વરસાદ પાણી સંચય જળ ચક્રમાંથી વરસાદને પકડે છે અને જળભરને રિચાર્જ કરવા માટે અંતર્સ્રાવનો ઉપયોગ કરે છે, ભૂજળ નિર્માણ પ્રક્રિયામાં સીધો ભાગ લે છે।"
        },
        {
          title: "પરંપરાગત ઘરો - ઉત્તરાખંડ હિમાલય",
          location: "મોરી બ્લોક, ઉત્તરકાશી, ઉત્તરાખંડ",
          description: "બે લાકડાના સ્તરોથી બનેલી દિવાલોવાળા ઘરો જેની વચ્ચે ગાયનો છાણો અને માટી ભરેલી હોય છે। આ ડિઝાઇન લાકડા અને માટીની ખરાબ ઉષ્મા વાહકતાનો ઉપયોગ કરે છે જેથી ઉષ્મા નુકસાનને રોકી શકાય, ભારે બરફવર્ષા સાથેની કઠોર શિયાળામાં ઘરોને ગરમ રાખે છે।",
          category: "ઉષ્મા સ્થાનાંતરણ એપ્લિકેશન",
          impact: "બાહ્ય હીટિંગ વિના ગરમી જાળવી રાખે છે, ચરમ ઠંડા આબોહવામાં ઊર્જા બચાવે છે",
          keyFeatures: [
            "ડબલ લાકડાના સ્તર દિવાલો",
            "માટી અને ગાયના છાણા સાથે પ્રાકૃતિક ઇન્સ્યુલેશન",
            "ખરાબ વાહકો ઉષ્મા નુકસાનને રોકે છે",
            "ટકાઉ અને પર્યાવરણ મિત્ર"
          ],
          connection: "પરંપરાગત ઘરો સંચાલનને ઘટાડવા માટે ખરાબ ઉષ્મા વાહકોનો ઉપયોગ કરે છે, ઉષ્મા નુકસાનને રોકે છે અને ચરમ આબોહવામાં આરામદાયક ઇનડોર તાપમાન જાળવી રાખે છે।"
        },
        {
          title: "ખાલી ઇંટ બાંધકામ",
          location: "ગરમ અને ઠંડા આબોહવા પ્રદેશો",
          description: "ખાલી ઇંટોનો ઉપયોગ કરીને બનાવેલી ઇમારતો જે તેમની ગુહાઓમાં હવાને ફસાવે છે। હવા ઉષ્માનો ખરાબ વાહક હોવાથી, આ ઇમારતો અંદર અને બહારના વાતાવરણ વચ્ચે ઉષ્મા સ્થાનાંતરણને રોકીને શિયાળામાં ગરમ અને ઉનાળામાં ઠંડી રહે છે।",
          category: "થર્મલ ઇન્સ્યુલેશન",
          impact: "હીટિંગ અને કૂલિંગ માટે ઊર્જા વપરાશ ઘટાડે છે, ઇમારતોને વધુ ટકાઉ બનાવે છે",
          keyFeatures: [
            "ખાલી જગ્યાઓમાં ફસાયેલી હવા",
            "પ્રાકૃતિક ઇન્સ્યુલેટર તરીકે કાર્ય કરે છે",
            "ઊર્જા બિલ ઘટાડે છે",
            "ચરમ આબોહવામાં અસરકારક"
          ],
          connection: "ખાલી ઇંટો હવા (એક ખરાબ વાહક)ને ફસાવે છે જેથી સંચાલન દ્વારા ઉષ્મા સ્થાનાંતરણને રોકી શકાય, થર્મલ ઇન્સ્યુલેશન સિદ્ધાંતોની વ્યવહારિક એપ્લિકેશન દર્શાવે છે।"
        },
        {
          title: "પરંપરાગત બુખારી હીટર",
          location: "ઉપરી હિમાલયી પ્રદેશો",
          description: "એક પરંપરાગત રૂમ હીટર જેમાં લાકડું અથવા કોલસો બાળતો લોખંડનો ચૂલો હોય છે, ધુમાડાના વેન્ટિંગ માટે ચિમની પાઇપ સાથે। તે ત્રણેય ઉષ્મા સ્થાનાંતરણ પ્રક્રિયાઓ દર્શાવે છે: સંચાલન (જ્યોતથી ચૂલા સુધી), સંવહન (હવા અને પાણીને ગરમ કરવું), અને વિકિરણ (તેની આસપાસ અનુભવાતી ગરમી)। સપાટ ટોપનો ઉપયોગ રસોઈ માટે કરી શકાય છે।",
          category: "ઉષ્મા સ્થાનાંતરણ",
          impact: "મર્યાદિત આધુનિક મૂળભૂત સુવિધાઓવાળા વિસ્તારોમાં હીટિંગ અને રસોઈનો ઉકેલ પ્રદાન કરે છે",
          keyFeatures: [
            "સંચાલન, સંવહન અને વિકિરણ દર્શાવે છે",
            "બહુહેતુક: હીટિંગ અને રસોઈ",
            "સ્થાનિક રીતે ઉપલબ્ધ ઇંધણનો ઉપયોગ કરે છે",
            "અસરકારક ચિમની પ્રણાલી"
          ],
          connection: "બુખારી ત્રણેય ઉષ્મા સ્થાનાંતરણ પદ્ધતિઓ દર્શાવે છે: સંચાલન (ધાતુ હીટિંગ), સંવહન (હવા પરિભ્રમણ), અને વિકિરણ (નજીક અનુભવાતી ગરમી)।"
        }
      ]
    },
  },
};

// Get appropriate font family based on language
export const getFontFamilyForLanguage = (lang: Language | string): string => {
  const language = lang as Language;
  switch (language) {
    case 'hi':
      return '"Noto Sans Devanagari", "Noto Sans", sans-serif';
    case 'gu':
      return '"Noto Sans Gujarati", "Noto Sans", sans-serif';
    case 'en':
    default:
      return 'Poppins, "Noto Sans", sans-serif';
  }
};

// ============================================================================
// Language Context
// ============================================================================
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t: i18nT } = useTranslation();
  const initialLanguage = (i18n.language?.split('-')[0] as Language) || 'en';
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Custom translation function that accesses translationsData directly
  const t = useCallback((key: string, options?: Record<string, unknown>): string => {
    try {
      // Try to get translation from translationsData first
      const keys = key.split('.');
      let value: any = translationsData[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to i18next
          const i18nValue = i18nT(key, options);
          if (i18nValue && i18nValue !== key) {
            return i18nValue;
          }
          // If not found, return the key as fallback
          return key;
        }
      }
      
      // If we have a string value, return it (with interpolation if needed)
      if (typeof value === 'string') {
        if (options) {
          // Simple interpolation: replace {key} with values from options
          return value.replace(/\{(\w+)\}/g, (match, key) => {
            return options[key]?.toString() || match;
          });
        }
        return value;
      }
      
      // Fallback to i18next
      const i18nValue = i18nT(key, options);
      if (i18nValue && i18nValue !== key) {
        return i18nValue;
      }
      
      // Final fallback: return the key
      return key;
    } catch (error) {
      // Fallback to i18next on error
      const i18nValue = i18nT(key, options);
      if (i18nValue && i18nValue !== key) {
        return i18nValue;
      }
      return key;
    }
  }, [language, i18nT]);

  useEffect(() => {
    // Suppress Chrome extension runtime.lastError warnings
    if (typeof window !== 'undefined' && window.chrome?.runtime?.lastError) {
      // Silently handle extension errors
      try {
        window.chrome.runtime.lastError = undefined;
      } catch {
        // Ignore errors when clearing
      }
    }

    const handleLanguageChanged = (lng: string) => {
      const base = (lng?.split('-')[0] as Language) || 'en';
      setLanguageState(base);
    };
    
    try {
      i18n.on('languageChanged', handleLanguageChanged);
    } catch (error) {
      // Handle i18n event listener errors
      console.warn('Failed to set up language change listener:', error);
    }
    
    return () => {
      try {
        i18n.off('languageChanged', handleLanguageChanged);
      } catch (error) {
        // Handle cleanup errors silently
      }
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('i18nextLng', lang);
      } catch (error) {
        // Handle localStorage errors (e.g., quota exceeded, private browsing)
        console.warn('Failed to save language preference to localStorage:', error);
      }
    }
  };

  useEffect(() => {
    // Ensure we're in the browser and DOM is ready before accessing documentElement
    if (typeof window !== 'undefined' && document && document.documentElement) {
      try {
        document.documentElement.lang = language;
      } catch (error) {
        // Silently handle any DOM access errors during SSR or before mount
        // This prevents "deferred DOM Node could not be resolved" warnings
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// ============================================================================
// Language Selector Component
// ============================================================================
const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: t('language.en'), flag: '🇬🇧' },
    { code: 'hi', name: t('language.hi'), flag: '🇮🇳' },
    { code: 'gu', name: t('language.gu'), flag: '🇮🇳' },
  ];

  return (
    <div className="relative">
      <select
        aria-label={t('language.selectorLabel')}
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 w-40 sm:w-48 md:w-56 text-xs sm:text-sm md:text-base text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2">
        <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// Navbar Component
// ============================================================================
interface NavbarProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
  const { t } = useLanguage();

  const isLearn = mode === 'learn';
  const isPractice = mode === 'practice';
  const isApplications = mode === 'applications';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" aria-hidden="true" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              {t('nav.logo')}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setMode('learn')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isLearn
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-teal-700 hover:bg-teal-100/50'
              }`}
            >
              <span className="hidden sm:inline">📚 </span>
              <span className="sm:hidden">📚</span>
              <span className="hidden md:inline ml-1">{t('nav.tabs.learn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isPractice
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-100/50'
              }`}
            >
              <span className="hidden sm:inline">🎯 </span>
              <span className="sm:hidden">🎯</span>
              <span className="hidden md:inline ml-1">{t('nav.tabs.practice')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('applications')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isApplications
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <span className="hidden sm:inline">🌍 </span>
              <span className="sm:hidden">🌍</span>
              <span className="hidden lg:inline ml-1">{t('nav.tabs.applications')}</span>
            </button>

            <div className="ml-1 sm:ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// Water Cycle Educational Component Constants and Data
// ============================================================================

enum Phase {
    EVAPORATION = 'EVAPORATION',
    CONDENSATION = 'CONDENSATION',
    PRECIPITATION = 'PRECIPITATION',
    COLLECTION = 'COLLECTION',
}

const PHASE_DURATION_MS = 7000;

const STEPS = [
    {
        id: 'evaporation',
        phase: Phase.EVAPORATION,
        name: 'Evaporation & Transpiration',
        icon: '🌊',
    },
    {
        id: 'condensation',
        phase: Phase.CONDENSATION,
        name: 'Condensation',
        icon: '☁️',
    },
    {
        id: 'precipitation',
        phase: Phase.PRECIPITATION,
        name: 'Precipitation',
        icon: '💧',
    },
    {
        id: 'collection',
        phase: Phase.COLLECTION,
        name: 'Collection & Infiltration',
        icon: '🏞️',
    }
];

const keyframesCSS = `
@keyframes sunPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.92; } }
@keyframes rayPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
@keyframes waveMotion { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
@keyframes riverFlow { to { stroke-dashoffset: -20; } }
@keyframes vaporRise {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 1; }
  80% { opacity: 1; transform: translateY(-90px); }
  100% { opacity: 0; transform: translateY(-100px); }
}
@keyframes transpirationRise {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; transform: translateY(-40px); }
  100% { opacity: 0; transform: translateY(-50px); }
}
@keyframes rainDropFall {
  0% { transform: translateY(0); opacity: 0; }
  5% { opacity: 0.9; }
  95% { transform: translateY(130px); opacity: 0.9; }
  100% { transform: translateY(135px); opacity: 0; }
}
@keyframes splashEffect {
  0%, 90% { opacity: 0; transform: scale(0.5); }
  94% { opacity: 1; transform: scale(1.4); }
  100% { opacity: 0; transform: scale(2); }
}
@keyframes infiltrationDrop {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 1; }
  80% { opacity: 1; transform: translateY(30px); }
  100% { opacity: 0; transform: translateY(30px); }
}
.sun { animation: sunPulse 4s ease-in-out infinite; }
.sun-ray { animation: rayPulse 2.5s ease-in-out infinite; }
.wave { animation: waveMotion 3s ease-in-out infinite; }
.river-flow { animation: riverFlow 1.5s linear infinite; }
.evaporation-group.active .vapor-stream { animation: vaporRise 3s ease-out infinite; }
.transpiration-group.active .transpiration-stream { animation: transpirationRise 2.5s ease-out infinite; }
.rain-drop-group { animation: rainDropFall 1s linear infinite; }
.rain-group.active .rain-splash { animation: splashEffect 1s linear infinite; }
.infiltration-drop-group { animation: infiltrationDrop 2.5s ease-in infinite; }
`;

// ============================================================================
// Placeholder Mode Components (with Topic Title Headers)
// ============================================================================

// Learn Mode Component
interface WaterCycleLearnModeProps {
  props?: {
    language?: LanguageCode;
  };
}

const WaterCycleLearnMode: React.FC<WaterCycleLearnModeProps> = ({ props }) => {
  const { language: contextLanguage, t } = useLanguage();
  const language: LanguageCode = (props?.language || (contextLanguage as LanguageCode) || 'en') as LanguageCode;
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentPhase = STEPS[currentStep].phase;

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % STEPS.length);
      }, PHASE_DURATION_MS);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  // Get translated content for current phase
  const getCurrentInfo = () => {
    const phaseId = STEPS[currentStep].id;
    return {
      title: t(`learn.phases.${phaseId}.title`),
      simple: [
        t(`learn.phases.${phaseId}.simple.0`),
        t(`learn.phases.${phaseId}.simple.1`),
        t(`learn.phases.${phaseId}.simple.2`)
      ],
      example: phaseId === 'evaporation' || phaseId === 'condensation' 
        ? [
            t(`learn.phases.${phaseId}.example.0`),
            t(`learn.phases.${phaseId}.example.1`),
            t(`learn.phases.${phaseId}.example.2`),
            t(`learn.phases.${phaseId}.example.3`)
          ]
        : [
            t(`learn.phases.${phaseId}.example.0`),
            t(`learn.phases.${phaseId}.example.1`),
            t(`learn.phases.${phaseId}.example.2`)
          ]
    };
  };
  
  const currentInfo = getCurrentInfo();

  const getCloudStyles = (cloudNum: number) => {
    const positions = {
      [Phase.EVAPORATION]: cloudNum === 1 ? 'translate(200px, 110px)' : 'translate(340px, 115px)',
      [Phase.CONDENSATION]: cloudNum === 1 ? 'translate(530px, 110px)' : 'translate(670px, 115px)',
      [Phase.PRECIPITATION]: cloudNum === 1 ? 'translate(530px, 110px)' : 'translate(670px, 115px)',
      [Phase.COLLECTION]: cloudNum === 1 ? 'translate(530px, 110px)' : 'translate(670px, 115px)',
    };
    const opacity = currentPhase === Phase.COLLECTION ? 0 : 1;
    const transition = currentPhase === Phase.CONDENSATION ? 'transform 5s ease, opacity 1s ease' :
      currentPhase === Phase.COLLECTION ? 'opacity 1.5s ease' : 'transform 1s ease, opacity 1s ease';
    return { transform: positions[currentPhase], opacity, transition };
  };

  const getCloudFill = () => currentPhase === Phase.CONDENSATION || currentPhase === Phase.PRECIPITATION ? '#5a7c8a' : '#ffffff';
  const getCloudStroke = () => currentPhase === Phase.CONDENSATION || currentPhase === Phase.PRECIPITATION ? '#456672' : '#e8e8e8';

  const styles = {
    mainFrame: {
      width: '100%',
      height: '100%',
      background: '#ffffff',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
    },
    header: {
      background: 'linear-gradient(90deg, #2196f3, #1976d2)',
      color: 'white',
      padding: '10px 20px',
      textAlign: 'center' as const,
      flexShrink: 0,
    },
    title: {
      margin: 0,
      fontSize: '24px',
      fontWeight: 'bold' as const,
    },
    subtitle: {
      margin: '3px 0 0 0',
      fontSize: '12px',
      opacity: 0.95,
    },
    contentArea: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
      minHeight: 0,
    },
    leftPanel: {
      width: '62%',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      justifyContent: 'stretch',
    },
    svgContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      borderRadius: '16px',
      padding: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    },
    svg: {
      width: '95%',
      height: 'auto',
      display: 'block' as const,
    },
    rightPanel: {
      width: '38%',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '12px',
      overflow: 'hidden' as const,
    },
    topicHeader: {
      background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
      padding: '12px 18px',
      borderRadius: '10px',
      marginBottom: '12px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      border: '2px solid #2196f3',
      flexShrink: 0,
    },
    topicTitle: {
      color: '#1565c0',
      fontSize: '18px',
      fontWeight: 'bold' as const,
      margin: 0,
      textAlign: 'center' as const,
    },
    infoSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      flex: 1,
    },
    infoBox: {
      background: 'white',
      padding: '12px 14px',
      borderRadius: '10px',
      borderLeft: '4px solid #2196f3',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0,
    },
    infoTitle: {
      fontSize: '15px',
      fontWeight: 'bold' as const,
      color: '#1976d2',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      justifyContent: 'flex-start' as const,
      flexShrink: 0,
    },
    infoSentence: {
      fontSize: '13px',
      color: '#444',
      lineHeight: '1.5',
      margin: '0 0 4px 0',
      textAlign: 'left' as const,
      paddingLeft: '4px',
      fontWeight: '500' as const,
    },
    footer: {
      background: '#ffffff',
      padding: '14px 20px',
      boxShadow: '0 -6px 16px rgba(0,0,0,0.08)',
      flexShrink: 0,
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      flexWrap: 'wrap' as const,
      marginBottom: '8px',
    },
    btn: (variant: string, disabled: boolean = false): CSSProperties => {
      const colors = {
        default: { bg: '#2196f3', hover: '#1976d2' },
        play: { bg: '#4caf50', hover: '#388e3c' },
        reset: { bg: '#ff9800', hover: '#f57c00' },
      };
      const color = colors[variant as keyof typeof colors] || colors.default;
      return {
        padding: '9px 18px',
        fontSize: '13px',
        fontWeight: '600' as const,
        background: color.bg,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      };
    },
    dots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
    },
    dot: (isActive: boolean, isCompleted: boolean): CSSProperties => ({
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      background: isActive ? '#2196f3' : isCompleted ? '#4caf50' : 'white',
      color: isActive || isCompleted ? 'white' : '#2196f3',
      fontSize: '14px',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      boxShadow: isActive ? '0 0 0 3px rgba(33,150,243,0.3)' : '0 3px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.3s',
    }),
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language), height: 'calc(100vh - 80px)', minHeight: '600px' }}
    >
      <style>{keyframesCSS}</style>
      <div style={styles.mainFrame}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🌊 {t('learn.title')}</h1>
          <p style={styles.subtitle}>{t('learn.subtitle')}</p>
            </div>

        {/* Main Content */}
        <div style={styles.contentArea}>
          {/* LEFT: Animation Only - No Title */}
          <div style={styles.leftPanel}>
            <div style={styles.svgContainer}>
              <svg style={styles.svg} viewBox="0 0 800 460" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#87ceeb" />
                    <stop offset="100%" stopColor="#b3e5fc" />
                  </linearGradient>
                  <radialGradient id="sunGradient">
                    <stop offset="0%" stopColor="#fff59d" />
                    <stop offset="100%" stopColor="#ffeb3b" />
                  </radialGradient>
                  <filter id="cloudShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="3" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.25" /></feComponentTransfer>
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                <rect x="0" y="0" width="800" height="280" fill="url(#skyGradient)" />

                {/* SUN */}
                <g>
                  <circle cx="90" cy="60" r="38" fill="url(#sunGradient)" className="sun" stroke="#fbc02d" strokeWidth="3" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    return <line key={i} x1={90 + Math.cos(rad) * 46} y1={60 + Math.sin(rad) * 46} x2={90 + Math.cos(rad) * 56} y2={60 + Math.sin(rad) * 56} className="sun-ray" stroke="#fff59d" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />;
                  })}
                  <text x="90" y="65" textAnchor="middle" fontSize="12" fill="#f57c00" fontWeight="800">Sun</text>
                </g>

                {/* MOUNTAINS */}
                <g>
                  <path d="M 600 280 L 680 200 L 750 260 L 800 240 L 800 280 Z" fill="#81c784" opacity="0.6" />
                  <path d="M 500 280 L 600 180 L 700 260 L 750 220 L 800 260 L 800 280 Z" fill="#66bb6a" opacity="0.7" />
                </g>

                {/* OCEAN */}
                <rect x="0" y="280" width="450" height="85" fill="#2196f3" />
                <path d="M 0 285 Q 50 280, 100 285 T 200 285 T 300 285 T 450 285" className="wave" fill="none" stroke="#64b5f6" strokeWidth="2.5" opacity="0.7" />
                <text x="225" y="325" textAnchor="middle" fill="#1a237e" fontSize="14" fontWeight="700">Ocean / Lake</text>

                {/* LAND */}
                <rect x="450" y="280" width="350" height="85" fill="#a5d6a7" />
                <text x="625" y="325" textAnchor="middle" fill="#1a237e" fontSize="14" fontWeight="700">Land</text>

                {/* RIVER */}
                <path d="M 550 280 C 570 310, 510 340, 470 360 C 410 385, 350 360, 290 360" className={currentPhase === Phase.COLLECTION ? 'river-flow' : ''} fill="none" stroke="#42a5f5" strokeWidth="6" strokeDasharray={currentPhase === Phase.COLLECTION ? '12 8' : '0'} />

                {/* TREES */}
                <g>
                  <rect x="520" y="255" width="12" height="32" fill="#6d4c41" />
                  <circle cx="526" cy="250" r="16" fill="#388e3c" />
                  <rect x="560" y="255" width="12" height="32" fill="#6d4c41" />
                  <circle cx="566" cy="250" r="16" fill="#388e3c" />
                </g>

                {/* SOIL */}
                <rect x="0" y="365" width="800" height="40" fill="#8d6e63" />
                <text x="400" y="388" textAnchor="middle" fill="#3e2723" fontSize="13" fontWeight="700">Soil</text>

                {/* UNDERGROUND */}
                <rect x="0" y="405" width="800" height="55" fill="#5d4037" />
                <rect x="230" y="410" width="260" height="35" fill="#4fc3f7" opacity="0.75" />
                <text x="360" y="432" textAnchor="middle" fill="#01579b" fontSize="13" fontWeight="700">Aquifer (Groundwater)</text>

                {/* EVAPORATION */}
                <g className={currentPhase === Phase.EVAPORATION ? 'evaporation-group active' : 'evaporation-group'} style={{ opacity: currentPhase === Phase.EVAPORATION ? 1 : 0, transition: 'opacity 0.8s' }}>
                  {currentPhase === Phase.EVAPORATION && <text x="225" y="250" textAnchor="middle" fill="#0d47a1" fontSize="14" fontWeight="800">Evaporation</text>}
                  {[80, 140, 200, 260, 320, 380].map((x, i) => (
                    <g key={i} className="vapor-stream" style={{ animationDelay: `${i * 0.3}s`, opacity: 0 }}>
                      <path d={`M ${x} 275 Q ${x - 5} 260, ${x} 245 T ${x} 215 T ${x} 185`} stroke="#4fc3f7" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                      <path d={`M ${x + 8} 275 Q ${x + 3} 260, ${x + 8} 245 T ${x + 8} 215 T ${x + 8} 185`} stroke="#4fc3f7" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                    </g>
                  ))}
                </g>

                {/* TRANSPIRATION */}
                <g className={currentPhase === Phase.EVAPORATION ? 'transpiration-group active' : 'transpiration-group'} style={{ opacity: currentPhase === Phase.EVAPORATION ? 1 : 0, transition: 'opacity 0.8s' }}>
                  {currentPhase === Phase.EVAPORATION && <text x="540" y="220" textAnchor="middle" fill="#1b5e20" fontSize="14" fontWeight="800">Transpiration</text>}
                  {[520, 535, 550, 565].map((x, i) => (
                    <g key={i} className="transpiration-stream" style={{ animationDelay: `${i * 0.2}s`, opacity: 0 }}>
                      <path d={`M ${x} 245 Q ${x - 3} 235, ${x} 225 T ${x} 205`} stroke="#66bb6a" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />
                    </g>
                  ))}
                </g>

                {/* CLOUDS */}
                <g>
                  {[1, 2].map(cloudNum => (
                    <g key={cloudNum} style={getCloudStyles(cloudNum)}>
                      {cloudNum === 1 && <text x="0" y="-45" textAnchor="middle" fill="#0d47a1" fontSize="13" fontWeight="700">
                        {currentPhase === Phase.CONDENSATION && 'Condensation'}
                        {currentPhase === Phase.PRECIPITATION && 'Precipitation'}
                      </text>}
                      <g filter="url(#cloudShadow)">
                        {[{ cx: 0, cy: 0, r: 32 }, { cx: -25, cy: 5, r: 23 }, { cx: 25, cy: 5, r: 23 }, { cx: -10, cy: -8, r: 20 }, { cx: 10, cy: -8, r: 20 }].map((c, i) =>
                          <circle key={i} {...c} fill={getCloudFill()} stroke={getCloudStroke()} strokeWidth="1" style={{ transition: 'fill 5s, stroke 5s' }} />
                        )}
                      </g>
                    </g>
                  ))}
                </g>

                {/* RAIN */}
                <g className={currentPhase === Phase.PRECIPITATION ? 'rain-group active' : 'rain-group'} style={{ opacity: currentPhase === Phase.PRECIPITATION ? 1 : 0, transition: 'opacity 0.8s' }}>
                  {Array.from({ length: 72 }).map((_, i) => {
                    const cloudBase = i < 36 ? 495 : 635;
                    const col = (i % 36) % 6;
                    const row = Math.floor((i % 36) / 6);
                    const x = cloudBase + col * 16;
                    const y = 145 + row * 5;
                    return (
                      <g key={i} className="rain-drop-group" style={{ animationDelay: `${(col * 0.12) + (row * 0.05)}s` }}>
                        <circle cx={x} cy={y} r="3" fill="#4a90b8" opacity="0.9" />
                        <ellipse cx={x} cy={y + 4} rx="2" ry="5" fill="#4a90b8" opacity="0.9" />
                      </g>
                    );
                  })}
                  {[500, 520, 540, 560, 580, 640, 660, 680, 700, 720].map((x, i) => (
                    <ellipse key={i} className="rain-splash" cx={x} cy={278} rx={6} ry={2} fill="#64b5f6" opacity="0" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </g>

                {/* INFILTRATION */}
                <g className={currentPhase === Phase.COLLECTION ? 'infiltration-group active' : 'infiltration-group'} style={{ opacity: currentPhase === Phase.COLLECTION ? 1 : 0, transition: 'opacity 0.8s' }}>
                  <text x="610" y="345" textAnchor="middle" fill="#0d47a1" fontSize="14" fontWeight="800">Infiltration</text>
                  {[500, 560, 620, 680, 730].map((x, i) => (
                    <g key={i} className="infiltration-drop-group" style={{ animationDelay: `${i * 0.25}s` }}>
                      <line x1={x} y1={350} x2={x} y2={380} stroke="#1976d2" strokeWidth="2.5" strokeLinecap="round" opacity="0" />
                    </g>
                  ))}
                </g>
              </svg>
          </div>
        </div>

          {/* RIGHT: Topic Title + Details */}
          <div style={styles.rightPanel}>
            {/* Topic Header */}
            <div style={styles.topicHeader}>
              <h2 style={styles.topicTitle}>{currentInfo.title}</h2>
      </div>

            {/* Info Boxes */}
            <div style={styles.infoSection}>
              {/* What is it? Box */}
              <div style={styles.infoBox}>
                <div style={styles.infoTitle}>
                  <span>📖</span> {t('learn.whatIsIt')}
        </div>
                {currentInfo.simple.map((sentence, index) => (
                  <p
                    key={`simple-${index}`}
                    style={styles.infoSentence}
                  >
                    • {sentence}
                  </p>
                ))}
              </div>

              {/* Real-Life Example Box */}
              <div style={styles.infoBox}>
                <div style={styles.infoTitle}>
                  <span>💡</span> {t('learn.realLifeExample')}
                </div>
                {currentInfo.example.map((sentence, index) => (
                  <p
                    key={`example-${index}`}
                    style={styles.infoSentence}
                  >
                    • {sentence}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.controls}>
            <button style={styles.btn('default', isAutoPlaying)} onClick={() => setCurrentStep((prev) => (prev - 1 + STEPS.length) % STEPS.length)} disabled={isAutoPlaying}>← {t('learn.previous')}</button>
            <button style={styles.btn('play')} onClick={() => setIsAutoPlaying(!isAutoPlaying)}>{isAutoPlaying ? `⏸ ${t('learn.pause')}` : `▶ ${t('learn.autoPlay')}`}</button>
            <button style={styles.btn('default', isAutoPlaying)} onClick={() => setCurrentStep((prev) => (prev + 1) % STEPS.length)} disabled={isAutoPlaying}>{t('learn.next')} →</button>
            <button style={styles.btn('reset')} onClick={() => { setCurrentStep(0); setIsAutoPlaying(false); }}>🔄 {t('learn.startOver')}</button>
          </div>

          <div style={styles.dots}>
            {STEPS.map((_, i) => (
              <button key={i} style={styles.dot(i === currentStep, i < currentStep)} onClick={() => { setCurrentStep(i); setIsAutoPlaying(false); }}>{i + 1}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Practice Mode Component
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface WaterCyclePracticeModeProps {
  props?: {
    language?: LanguageCode;
  };
}

const WaterCyclePracticeMode: React.FC<WaterCyclePracticeModeProps> = ({ props }) => {
  const { language: contextLanguage, t } = useLanguage();
  const language: LanguageCode = (props?.language || (contextLanguage as LanguageCode) || 'en') as LanguageCode;

  // Get questions from translations
  const getQuestions = (): Question[] => {
    const langData = translationsData[language];
    if (langData && langData.practice && langData.practice.questions) {
      return langData.practice.questions.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 2 : index === 3 ? 1 : 2, // Keep correct answers same
        explanation: q.explanation
      }));
    }
    // Fallback to English if translation fails
    const enData = translationsData['en'];
    if (enData && enData.practice && enData.practice.questions) {
      return enData.practice.questions.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 2 : index === 3 ? 1 : 2,
        explanation: q.explanation
      }));
    }
    return [];
  };

  const questions = getQuestions();

  // Safety check: if questions array is empty, return early
  if (questions.length === 0) {
  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading questions...</p>
            </div>
          </div>
    );
  }

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: getFontFamilyForLanguage(language),
    } as React.CSSProperties,
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '15px',
      marginBottom: '30px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    } as React.CSSProperties,
    headerTitle: {
      margin: '0 0 20px 0',
      fontSize: '2em',
    } as React.CSSProperties,
    progressInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px',
      fontSize: '1.1em',
    } as React.CSSProperties,
    progressBar: {
      background: 'rgba(255, 255, 255, 0.3)',
      height: '10px',
      borderRadius: '5px',
      overflow: 'hidden',
    } as React.CSSProperties,
    progressFill: (width: number) => ({
      background: 'white',
      height: '100%',
      width: `${width}%`,
      transition: 'width 0.3s ease',
    } as React.CSSProperties),
    questionCard: {
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,
    questionText: {
      fontSize: '1.4em',
      color: '#333',
      marginBottom: '30px',
      lineHeight: '1.6',
    } as React.CSSProperties,
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '25px',
    } as React.CSSProperties,
    optionButton: (isSelected: boolean, isCorrect: boolean, isIncorrect: boolean, isDisabled: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      border: `2px solid ${isCorrect ? '#4caf50' : isIncorrect ? '#f44336' : isSelected ? '#667eea' : '#e0e0e0'}`,
      borderRadius: '10px',
      background: isCorrect ? '#e8f5e9' : isIncorrect ? '#ffebee' : isSelected ? '#f0f4ff' : 'white',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1em',
      textAlign: 'left',
    } as React.CSSProperties),
    optionLabel: (isCorrect: boolean, isIncorrect: boolean) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '35px',
      height: '35px',
      background: isCorrect ? '#4caf50' : isIncorrect ? '#f44336' : '#667eea',
      color: 'white',
      borderRadius: '50%',
      fontWeight: 'bold',
      marginRight: '15px',
      flexShrink: 0,
    } as React.CSSProperties),
    optionText: {
      flex: 1,
    } as React.CSSProperties,
    icon: {
      marginLeft: '10px',
      fontSize: '1.5em',
      fontWeight: 'bold',
    } as React.CSSProperties,
    explanationBox: {
      background: '#fff8e1',
      borderLeft: '4px solid #ffc107',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
    } as React.CSSProperties,
    explanationTitle: {
      margin: '0 0 10px 0',
      color: '#f57c00',
    } as React.CSSProperties,
    explanationText: {
      margin: 0,
      lineHeight: '1.6',
      color: '#333',
    } as React.CSSProperties,
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
    } as React.CSSProperties,
    submitButton: (isDisabled: boolean) => ({
      padding: '15px 40px',
      fontSize: '1.1em',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '25px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      background: isDisabled ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    } as React.CSSProperties),
    nextButton: {
      padding: '15px 40px',
      fontSize: '1.1em',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
      color: 'white',
    } as React.CSSProperties,
    quizCompleted: {
      textAlign: 'center',
      padding: '40px',
    } as React.CSSProperties,
    completedTitle: {
      fontSize: '2.5em',
      color: '#667eea',
      marginBottom: '30px',
    } as React.CSSProperties,
    scoreDisplay: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '40px',
      borderRadius: '15px',
      marginBottom: '30px',
    } as React.CSSProperties,
    scoreCircle: {
      display: 'inline-block',
      margin: '20px 0',
    } as React.CSSProperties,
    scoreNumber: {
      fontSize: '4em',
      fontWeight: 'bold',
    } as React.CSSProperties,
    scoreTotal: {
      fontSize: '2em',
      opacity: 0.8,
    } as React.CSSProperties,
    scorePercentage: {
      fontSize: '1.5em',
      margin: '10px 0',
    } as React.CSSProperties,
    performanceMessage: {
      fontSize: '1.3em',
      color: '#333',
      margin: '20px 0',
      padding: '20px',
      background: '#f5f5f5',
      borderRadius: '10px',
    } as React.CSSProperties,
    restartButton: {
      padding: '15px 50px',
      fontSize: '1.2em',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    } as React.CSSProperties,
  };

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    let message = '';
    if (score === questions.length) message = `🌟 ${t('practice.perfect')}`;
    else if (percentage >= 80) message = `🎯 ${t('practice.excellent')}`;
    else if (percentage >= 60) message = `👍 ${t('practice.goodJob')}`;
    else message = `📚 ${t('practice.keepPracticing')}`;

    return (
      <div
        className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: getFontFamilyForLanguage(language) }}
      >
        <div style={styles.container}>
          <div style={styles.quizCompleted}>
            <h1 style={styles.completedTitle}>🎉 {t('practice.quizCompleted')}</h1>
            <div style={styles.scoreDisplay}>
              <h2>{t('practice.yourScore')}</h2>
              <div style={styles.scoreCircle}>
                <span style={styles.scoreNumber}>{score}</span>
                <span style={styles.scoreTotal}>/ {questions.length}</span>
        </div>
              <p style={styles.scorePercentage}>{percentage.toFixed(0)}%</p>
      </div>
            <div style={styles.performanceMessage}>
              <p>{message}</p>
            </div>
            <button style={styles.restartButton} onClick={handleRestart}>
              {t('practice.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
      <div style={styles.container}>
        <div style={styles.questionCard}>
          <div style={styles.progressInfo}>
            <span>{t('practice.question')} {currentQuestion + 1} {t('practice.of')} {questions.length}</span>
            <span>{t('practice.score')}: {score}</span>
        </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(((currentQuestion + 1) / questions.length) * 100)} />
          </div>
          <h2 style={styles.questionText}>{questions[currentQuestion].question}</h2>
          
          <div style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = showExplanation && index === questions[currentQuestion].correctAnswer;
              const isIncorrect = showExplanation && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer;
              
              return (
                <button
                  key={index}
                  style={styles.optionButton(isSelected, isCorrect, isIncorrect, showExplanation)}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                >
                  <span style={styles.optionLabel(isCorrect, isIncorrect)}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span style={styles.optionText}>{option}</span>
                  {isCorrect && <span style={styles.icon}>✓</span>}
                  {isIncorrect && <span style={styles.icon}>✗</span>}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div style={styles.explanationBox}>
              <h3 style={styles.explanationTitle}>💡 {t('practice.explanation')}</h3>
              <p style={styles.explanationText}>{questions[currentQuestion].explanation}</p>
            </div>
          )}

          <div style={styles.buttonContainer}>
            {!showExplanation ? (
              <button 
                style={styles.submitButton(selectedAnswer === null)} 
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                {t('practice.submitAnswer')}
              </button>
            ) : (
              <button style={styles.nextButton} onClick={handleNext}>
                {currentQuestion < questions.length - 1 ? `${t('practice.nextQuestion')} →` : t('practice.viewResults')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Real World Applications Mode Component
interface RealWorldExample {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  category: string;
  impact: string;
  keyFeatures: string[];
}

interface WaterCycleRealWorldProps {
  props?: {
    language?: LanguageCode;
  };
}

const WaterCycleRealWorld: React.FC<WaterCycleRealWorldProps> = ({ props }) => {
  const { language: contextLanguage, t } = useLanguage();
  const language: LanguageCode = (props?.language || (contextLanguage as LanguageCode) || 'en') as LanguageCode;

  // Get examples from translations
  const getExamples = (): RealWorldExample[] => {
    const langData = translationsData[language];
    if (langData && langData.realWorld && langData.realWorld.examples) {
      return langData.realWorld.examples.map((ex: any, index: number) => ({
        id: index + 1,
        title: ex.title,
        location: ex.location,
        description: ex.description,
        image: index === 0 ? "🏔️" : index === 1 ? "🏠" : index === 2 ? "🛖" : index === 3 ? "🧱" : "♨️",
        category: ex.category,
        impact: ex.impact,
        keyFeatures: ex.keyFeatures
      }));
    }
    // Fallback to English if translation fails
    const enData = translationsData['en'];
    if (enData && enData.realWorld && enData.realWorld.examples) {
      return enData.realWorld.examples.map((ex: any, index: number) => ({
        id: index + 1,
        title: ex.title,
        location: ex.location,
        description: ex.description,
        image: index === 0 ? "🏔️" : index === 1 ? "🏠" : index === 2 ? "🛖" : index === 3 ? "🧱" : "♨️",
        category: ex.category,
        impact: ex.impact,
        keyFeatures: ex.keyFeatures
      }));
    }
    return [];
  };

  const examples = getExamples();

  // Safety check: if examples array is empty, return early
  if (examples.length === 0) {
  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading examples...</p>
          </div>
        </div>
    );
  }

  const [selectedExample, setSelectedExample] = useState<number>(0);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: getFontFamilyForLanguage(language),
    } as React.CSSProperties,
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    } as React.CSSProperties,
    title: {
      fontSize: '2.5em',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '10px',
    } as React.CSSProperties,
    subtitle: {
      fontSize: '1.2em',
      color: '#666',
    } as React.CSSProperties,
    examplesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '40px',
    } as React.CSSProperties,
    exampleCard: (isActive: boolean) => ({
      background: isActive ? 'linear-gradient(135deg, #f0f4ff 0%, #e8ebff 100%)' : 'white',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      border: `3px solid ${isActive ? '#667eea' : 'transparent'}`,
    } as React.CSSProperties),
    exampleIcon: {
      fontSize: '3em',
      marginBottom: '15px',
    } as React.CSSProperties,
    exampleTitle: {
      fontSize: '1.1em',
      color: '#333',
      marginBottom: '10px',
    } as React.CSSProperties,
    exampleLocation: {
      fontSize: '0.9em',
      color: '#666',
      marginBottom: '10px',
    } as React.CSSProperties,
    exampleCategory: {
      display: 'inline-block',
      padding: '5px 15px',
      background: '#667eea',
      color: 'white',
      borderRadius: '20px',
      fontSize: '0.85em',
      fontWeight: 'bold',
    } as React.CSSProperties,
    detailSection: {
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px',
    } as React.CSSProperties,
    detailHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      paddingBottom: '20px',
      borderBottom: '2px solid #f0f0f0',
      flexWrap: 'wrap',
      gap: '15px',
    } as React.CSSProperties,
    detailTitle: {
      color: '#333',
      margin: 0,
    } as React.CSSProperties,
    detailCategory: {
      padding: '8px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '20px',
      fontWeight: 'bold',
    } as React.CSSProperties,
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '25px',
      borderBottom: '2px solid #f0f0f0',
      flexWrap: 'wrap',
    } as React.CSSProperties,
    tab: (isActive: boolean) => ({
      padding: '12px 25px',
      background: 'none',
      border: 'none',
      fontSize: '1em',
      fontWeight: 600,
      color: isActive ? '#667eea' : '#666',
      cursor: 'pointer',
      borderBottom: `3px solid ${isActive ? '#667eea' : 'transparent'}`,
      transition: 'all 0.3s ease',
    } as React.CSSProperties),
    tabContent: {
      minHeight: '300px',
    } as React.CSSProperties,
    locationBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 20px',
      background: '#f0f4ff',
      borderRadius: '10px',
      marginBottom: '20px',
      fontSize: '1em',
    } as React.CSSProperties,
    locationIcon: {
      fontSize: '1.3em',
    } as React.CSSProperties,
    description: {
      fontSize: '1.1em',
      lineHeight: '1.8',
      color: '#444',
    } as React.CSSProperties,
    sectionTitle: {
      color: '#667eea',
      marginBottom: '20px',
      fontSize: '1.3em',
    } as React.CSSProperties,
    featuresList: {
      listStyle: 'none',
      padding: 0,
    } as React.CSSProperties,
    featureItem: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '15px',
      marginBottom: '10px',
      background: '#f8f9fa',
      borderRadius: '10px',
      fontSize: '1.05em',
      lineHeight: '1.6',
    } as React.CSSProperties,
    featureIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '25px',
      height: '25px',
      background: '#4caf50',
      color: 'white',
      borderRadius: '50%',
      marginRight: '15px',
      flexShrink: 0,
      fontWeight: 'bold',
    } as React.CSSProperties,
    impactCard: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '20px',
      padding: '25px',
      background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
      borderRadius: '15px',
      marginBottom: '25px',
      borderLeft: '5px solid #ffc107',
      flexWrap: 'wrap',
    } as React.CSSProperties,
    impactIcon: {
      fontSize: '2.5em',
      flexShrink: 0,
    } as React.CSSProperties,
    impactText: {
      fontSize: '1.1em',
      lineHeight: '1.7',
      color: '#333',
      margin: 0,
      flex: 1,
    } as React.CSSProperties,
    connectionBox: {
      padding: '25px',
      background: '#e8f5e9',
      borderRadius: '15px',
      borderLeft: '5px solid #4caf50',
    } as React.CSSProperties,
    connectionTitle: {
      color: '#2e7d32',
      margin: '0 0 15px 0',
      fontSize: '1.2em',
    } as React.CSSProperties,
    connectionText: {
      fontSize: '1.05em',
      lineHeight: '1.7',
      color: '#333',
      margin: 0,
    } as React.CSSProperties,
    learningTip: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '15px',
      textAlign: 'center',
    } as React.CSSProperties,
    learningTipTitle: {
      margin: '0 0 15px 0',
      fontSize: '1.5em',
    } as React.CSSProperties,
    learningTipText: {
      fontSize: '1.1em',
      lineHeight: '1.7',
      margin: 0,
    } as React.CSSProperties,
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🌍 {t('realWorld.title')}</h1>
          <p style={styles.subtitle}>{t('realWorld.subtitle')}</p>
      </div>

        <div style={styles.examplesGrid}>
          {examples.map((example, index) => (
            <div
              key={example.id}
              style={styles.exampleCard(selectedExample === index)}
              onClick={() => setSelectedExample(index)}
            >
              <div style={styles.exampleIcon}>{example.image}</div>
              <h3 style={styles.exampleTitle}>{example.title}</h3>
              <p style={styles.exampleLocation}>📍 {example.location}</p>
              <span style={styles.exampleCategory}>{example.category}</span>
        </div>
          ))}
        </div>

        <div style={styles.detailSection}>
          <div style={styles.detailHeader}>
            <h2 style={styles.detailTitle}>{examples[selectedExample].title}</h2>
            <span style={styles.detailCategory}>{examples[selectedExample].category}</span>
          </div>

          <div style={styles.tabContent}>
            <div>
              <div style={styles.locationBadge}>
                <span style={styles.locationIcon}>📍</span>
                <strong>{t('realWorld.location')}:</strong> {examples[selectedExample].location}
              </div>
              <p style={styles.description}>{examples[selectedExample].description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main WaterCycleLearning Component (Router)
// ============================================================================
interface WaterCycleLearningProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const WaterCycleLearning: React.FC<WaterCycleLearningProps> = ({ mode, setMode }) => {
  return (
    <>
      <Navbar mode={mode} setMode={setMode} />
      <div className="pt-14 sm:pt-16 px-2 sm:px-3 md:px-4 lg:px-6 pb-4 sm:pb-6">
        {mode === 'learn' && <WaterCycleLearnMode />}
        {mode === 'practice' && <WaterCyclePracticeMode />}
        {mode === 'applications' && <WaterCycleRealWorld />}
      </div>
    </>
  );
};

// Export as named exports
export { WaterCycleLearnMode, WaterCyclePracticeMode, WaterCycleRealWorld };

// Default export for main component
export default WaterCycleLearning;
