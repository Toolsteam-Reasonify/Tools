import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

// Icon components from lucide-react are imported above

// ============================================================================
// Type Definitions (merged from heatTransferTranslations.ts)
// ============================================================================

export type Language = "en" | "hi" | "gu";

// Common types
export interface LanguageLabels {
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

// Water Cycle types
export interface WaterCycleNav {
  logo: string;
  tabs: {
    learn: string;
    practice: string;
    applications: string;
  };
}

export interface WaterCycleControls {
  step: string;
  of: string;
  previous: string;
  next: string;
  play: string;
  pause: string;
  reset: string;
}

export interface WaterCycleStep {
  title: string;
  description: string;
  keyPoints: string[];
}

export interface WaterCycleSteps {
  overview: WaterCycleStep;
  evaporation: WaterCycleStep;
  transpiration: WaterCycleStep;
  condensation: WaterCycleStep;
  precipitation: WaterCycleStep;
  collection: WaterCycleStep;
  infiltration: WaterCycleStep;
  complete: WaterCycleStep;
}

export interface WaterCycleCanvas {
  evaporation: string;
  transpiration: string;
  condensation: string;
  precipitation: string;
  collection: string;
  infiltration: string;
  groundwater: string;
  sun: string;
  waterBody: string;
  clouds: string;
  rain: string;
}

export interface WaterCycleLearn {
  title: string;
  subtitle: string;
  stepInformation: string;
  keyPoints: string;
  quickJump: string;
  didYouKnow: string;
  understanding: string;
  energySource: string;
  energySourceDesc: string;
  stateChanges: string;
  stateChangesDesc: string;
  continuousProcess: string;
  continuousProcessDesc: string;
  lifeSupport: string;
  lifeSupportDesc: string;
  funFacts: string[];
  progress: string;
}

export interface WaterCyclePractice {
  title: string;
  subtitle: string;
  score: string;
  reset: string;
  showAnswers: string;
  instructions: string;
  correct: string;
  incorrect: string;
  alreadyConnected: string;
  progress: string;
  connectionsMade: string;
  stages: {
    sun: string;
    ocean: string;
    evaporation: string;
    transpiration: string;
    condensation: string;
    precipitation: string;
    infiltration: string;
    groundwater: string;
  };
  stageDescriptions: {
    sun: string;
    ocean: string;
    evaporation: string;
    transpiration: string;
    condensation: string;
    precipitation: string;
    infiltration: string;
    groundwater: string;
  };
  concepts: {
    evaporation: {
      title: string;
      description: string;
    };
    transpiration: {
      title: string;
      description: string;
    };
    condensation: {
      title: string;
      description: string;
    };
    precipitation: {
      title: string;
      description: string;
    };
  };
}

export interface WaterCycleRealWorld {
  title: string;
  subtitle: string;
  score: string;
  completed: string;
  tabs: {
    scenarios: string;
    seepage: string;
    conservation: string;
  };
  scenario: string;
  of: string;
  previous: string;
  next: string;
  correct: string;
  incorrect: string;
  scenarios: {
    coastal: {
      title: string;
      description: string;
      question: string;
      options: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
      explanations: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
    };
    drying: {
      title: string;
      description: string;
      question: string;
      options: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
      explanations: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
    };
    monsoon: {
      title: string;
      description: string;
      question: string;
      options: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
      explanations: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
    };
    groundwater: {
      title: string;
      description: string;
      question: string;
      options: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
      explanations: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
    };
    iceStupa: {
      title: string;
      description: string;
      question: string;
      options: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
      explanations: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
    };
  };
  seepage: {
    title: string;
    materials: {
      clay: {
        name: string;
        porosity: string;
        description: string;
      };
      sand: {
        name: string;
        porosity: string;
        description: string;
      };
      gravel: {
        name: string;
        porosity: string;
        description: string;
      };
    };
    waterAmount: string;
    collected: string;
    rate: {
      title: string;
      slow: string;
      medium: string;
      fast: string;
    };
    time: {
      title: string;
      slow: string;
      medium: string;
      fast: string;
    };
    bestFor: {
      title: string;
      storage: string;
      farming: string;
      drainage: string;
    };
  };
  conservation: {
    title: string;
    aquiferLevel: string;
    markers: {
      full: string;
      good: string;
      warning: string;
      critical: string;
      depleted: string;
    };
    useWater: string;
    rainfall: string;
    criticalWarning: string;
    criticalMessage: string;
    solutions: {
      title: string;
      rainwater: {
        title: string;
        description: string;
      };
      greenCover: {
        title: string;
        description: string;
      };
      reduceWastage: {
        title: string;
        description: string;
      };
      rechargePits: {
        title: string;
        description: string;
      };
    };
    successStory: {
      title: string;
      para1: string;
      para2: string;
    };
  };
  takeaways: {
    title: string;
    items: string[];
  };
}

export interface WaterCycleContent {
  nav: WaterCycleNav;
  language: LanguageLabels;
  controls: WaterCycleControls;
  steps: WaterCycleSteps;
  canvas: WaterCycleCanvas;
  learn: WaterCycleLearn;
  practice: WaterCyclePractice;
  realWorld: WaterCycleRealWorld;
}

// Component-specific types
type StepMode = "learn" | "practice" | "real_world";
type LearnStage =
  | "overview"
  | "evaporation"
  | "transpiration"
  | "condensation"
  | "precipitation"
  | "collection"
  | "infiltration"
  | "complete";
type LearnActiveElement =
  | "sun"
  | "water"
  | "vapor"
  | "clouds"
  | "rain"
  | "ground"
  | "underground"
  | "plants"
  | "all";

interface BaseStep {
  id: number;
  title: string;
  description: string;
  mode: StepMode;
}

interface LearnStep extends BaseStep {
  mode: "learn";
  type: "intro" | "explanation";
  data: {
    stage: LearnStage;
    activeElements?: LearnActiveElement[];
  };
}

type Step = LearnStep;

interface Particle {
  id: number;
  x: number;
  y: number;
  initialX: number; // Reference for sine wave calculation
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: 'water' | 'vapor' | 'rain' | 'snow';
  color: string;
  life: number; // 0 to 1
  wobbleSpeed: number; // How fast it moves side to side
}

// Translation system
const translations: Record<Language, WaterCycleContent> = {
  en: {
    nav: {
      logo: "Water Cycle Learning",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        applications: "Real World",
      },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "Select Language",
    },
    controls: {
      step: "Step",
      of: "of",
      previous: "Previous",
      next: "Next",
      play: "Play",
      pause: "Pause",
      reset: "Reset",
    },
    steps: {
      overview: {
        title: "The Water Cycle - An Overview",
        description:
          "The water cycle, also called the hydrological cycle, is the continuous movement of water on, above, and below the surface of Earth. Water can change states among liquid, vapor, and ice at various places in the water cycle.",
        keyPoints: [
          "Water constantly moves through different states",
          "The cycle is powered by the Sun's energy",
          "Water moves between oceans, atmosphere, and land",
          "The total amount of water on Earth remains constant"
        ],
      },
      evaporation: {
        title: "Step 1: Evaporation",
        description:
          "Evaporation is the process where liquid water transforms into water vapor (gas). When the Sun heats water in oceans, rivers, lakes, and puddles, the water molecules gain enough energy to break free from the liquid surface and rise into the atmosphere as invisible water vapor.",
        keyPoints: [
          "Heat from the Sun provides energy for evaporation",
          "Water changes from liquid to gas (vapor)",
          "Occurs from oceans, rivers, lakes, and soil",
          "About 86% of global evaporation comes from oceans"
        ],
      },
      transpiration: {
        title: "Step 2: Transpiration",
        description:
          "Transpiration is the process where plants absorb water through their roots and release water vapor through tiny pores (stomata) in their leaves. This is how plants contribute to the water cycle and cool themselves, just like humans sweating.",
        keyPoints: [
          "Plants absorb water through roots from soil",
          "Water travels up through the plant's stem",
          "Water vapor exits through stomata in leaves",
          "About 10% of atmospheric moisture comes from plants"
        ],
      },
      condensation: {
        title: "Step 3: Condensation",
        description:
          "Condensation occurs when water vapor in the atmosphere cools down and changes back into liquid water droplets. As warm, moist air rises, it expands and cools. When the air cools to its dew point, water vapor condenses around tiny particles like dust, salt, or smoke to form clouds.",
        keyPoints: [
          "Water vapor cools and turns back into liquid",
          "Forms tiny water droplets around dust particles",
          "Creates clouds, fog, and dew",
          "Higher altitude = cooler temperature = more condensation"
        ],
      },
      precipitation: {
        title: "Step 4: Precipitation",
        description:
          "Precipitation is when water falls from clouds to Earth. As cloud droplets collide and merge, they become heavier. When they're too heavy for air currents to hold them up, they fall as rain, snow, sleet, or hail depending on the temperature.",
        keyPoints: [
          "Water droplets in clouds grow larger and heavier",
          "Falls as rain when temperature is above 0°C",
          "Falls as snow when temperature is below 0°C",
          "Average raindrop falls at 20 mph (32 km/h)"
        ],
      },
      collection: {
        title: "Step 5: Collection (Surface Runoff)",
        description:
          "Collection is when precipitation gathers in bodies of water. Some water flows over land as surface runoff into streams and rivers, eventually reaching lakes and oceans. This runoff can erode soil and carry nutrients and pollutants.",
        keyPoints: [
          "Water flows downhill due to gravity",
          "Forms streams, rivers, and eventually reaches oceans",
          "Some water collects in lakes and ponds",
          "Runoff can cause erosion and flooding"
        ],
      },
      infiltration: {
        title: "Step 6: Infiltration & Groundwater",
        description:
          "Infiltration is the process where water soaks into the ground through soil and rocks. This water becomes groundwater, stored in underground layers called aquifers. Groundwater slowly moves through the ground and can take years to centuries to return to the surface through springs or wells.",
        keyPoints: [
          "Water seeps through soil into underground layers",
          "Stored in aquifers between rock and soil layers",
          "Provides drinking water for many communities",
          "Can take hundreds of years to recharge"
        ],
      },
      complete: {
        title: "The Complete Water Cycle",
        description:
          "The water cycle is continuous and interconnected. Solar energy drives evaporation and transpiration, sending water vapor into the atmosphere. Cooling causes condensation into clouds, which release precipitation. Water then collects in bodies of water and infiltrates the ground, completing the cycle and beginning again.",
        keyPoints: [
          "All steps work together continuously",
          "Powered by solar energy and gravity",
          "Distributes fresh water across the planet",
          "Essential for all life on Earth"
        ],
      },
    },
    canvas: {
      evaporation: "EVAPORATION",
      transpiration: "TRANSPIRATION",
      condensation: "CONDENSATION",
      precipitation: "PRECIPITATION",
      collection: "COLLECTION (Runoff)",
      infiltration: "INFILTRATION",
      groundwater: "GROUNDWATER",
      sun: "Sun",
      waterBody: "Water Body",
      clouds: "Clouds",
      rain: "Rain",
    },
    learn: {
      title: "The Water Cycle",
      subtitle: "Interactive Learning Experience",
      stepInformation: "Step Information",
      keyPoints: "Key Points",
      quickJump: "Quick Jump",
      didYouKnow: "Did You Know?",
      understanding: "Understanding the Water Cycle",
      energySource: "Energy Source",
      energySourceDesc: "The Sun provides energy for evaporation, driving the entire water cycle.",
      stateChanges: "State Changes",
      stateChangesDesc: "Water changes between liquid, vapor, and ice throughout the cycle.",
      continuousProcess: "Continuous Process",
      continuousProcessDesc: "The cycle never stops - water is constantly moving and changing form.",
      lifeSupport: "Life Support",
      lifeSupportDesc: "The water cycle distributes fresh water essential for all living things.",
      funFacts: [
        "🌊 97% of Earth's water is in the oceans (salt water)",
        "💧 Only 3% is fresh water, and 2/3 of that is frozen!",
        "🌍 The same water has been cycling for billions of years",
        "☁️ A cloud can weigh more than 1 million pounds!",
        "🌳 A large oak tree can transpire 40,000 gallons per year"
      ],
      progress: "Progress",
    },
    practice: {
      title: "Water Cycle - Practice Mode",
      subtitle: "Click on stages to connect them and build the water cycle!",
      score: "Score",
      reset: "Reset",
      showAnswers: "Show Answers",
      instructions: "Instructions: Click on a stage, then click on another stage to create a connection. Build the complete water cycle by connecting all stages correctly!",
      correct: "✓ Correct connection!",
      incorrect: "✗ Incorrect connection. Try again!",
      alreadyConnected: "✓ Connection already made!",
      progress: "Your Progress",
      connectionsMade: "connections made",
      stages: {
        sun: "Sun",
        ocean: "Ocean/Water Bodies",
        evaporation: "Evaporation",
        transpiration: "Transpiration",
        condensation: "Condensation",
        precipitation: "Precipitation",
        infiltration: "Infiltration",
        groundwater: "Groundwater",
      },
      stageDescriptions: {
        sun: "Main source of heat for evaporation",
        ocean: "Source of water for evaporation",
        evaporation: "Water turns into water vapour due to heat",
        transpiration: "Water evaporates from trees and plants",
        condensation: "Water vapour cools and forms clouds",
        precipitation: "Rain, snow, or hail falls from clouds",
        infiltration: "Water seeps through soil and rocks",
        groundwater: "Water stored in aquifers underground",
      },
      concepts: {
        evaporation: {
          title: "🌊 Evaporation",
          description: "Water from oceans, rivers, and lakes gets heated by the Sun and turns into water vapour.",
        },
        transpiration: {
          title: "🌳 Transpiration",
          description: "Plants release water vapour through their leaves into the atmosphere.",
        },
        condensation: {
          title: "☁️ Condensation",
          description: "Water vapour rises, cools down, and forms tiny droplets that create clouds.",
        },
        precipitation: {
          title: "🌧️ Precipitation",
          description: "Clouds release water as rain, snow, or hail, which falls back to Earth.",
        },
      },
    },
    realWorld: {
      title: "Water Cycle - Real World Applications",
      subtitle: "Explore how the water cycle impacts our daily lives and environment",
      score: "Score",
      completed: "Completed",
      tabs: {
        scenarios: "🌍 Real-World Scenarios",
        seepage: "🧪 Seepage Experiment",
        conservation: "💧 Water Conservation",
      },
      scenario: "Scenario",
      of: "of",
      previous: "← Previous",
      next: "Next →",
      correct: "✅ Correct!",
      incorrect: "❌ Incorrect",
      scenarios: {
        coastal: {
          title: "Coastal City Weather",
          description: "Mumbai, a coastal city in India, experiences different weather patterns compared to inland cities.",
          question: "Why does Mumbai have a more moderate climate throughout the year?",
          options: {
            a: "Because it has more trees",
            b: "Because water bodies heat up and cool down slowly",
            c: "Because of air conditioning in buildings",
            d: "Because of the buildings blocking wind",
          },
          explanations: {
            a: "While trees help, they are not the primary reason for moderate coastal climate.",
            b: "Correct! Large water bodies like oceans heat up and cool down slowly. During the day, the sea is cooler than land (creating sea breeze), and at night, the sea is warmer than land (creating land breeze). This moderates the temperature.",
            c: "Air conditioning affects indoor temperatures but not the overall city climate.",
            d: "Buildings can affect local wind patterns but not the overall moderate climate.",
          },
        },
        drying: {
          title: "Drying Clothes",
          description: "Your mother hangs wet clothes on the terrace on two different days.",
          question: "On which day will clothes dry faster?",
          options: {
            a: "A cloudy, humid day",
            b: "A sunny, dry day",
            c: "Both days will be the same",
            d: "At night when it's cooler",
          },
          explanations: {
            a: "On cloudy days with high humidity, evaporation is slower because the air already contains moisture.",
            b: "Correct! Clothes dry faster on sunny days because the Sun's heat increases evaporation. Dry air can absorb more moisture, speeding up the drying process.",
            c: "No, the rate of evaporation depends on temperature and humidity.",
            d: "Lower temperatures reduce evaporation rate, so drying is slower at night.",
          },
        },
        monsoon: {
          title: "Monsoon Season",
          description: "During monsoons, Kerala receives heavy rainfall while some parts of Rajasthan remain dry.",
          question: "What role does the water cycle play in this difference?",
          options: {
            a: "Kerala has more water bodies",
            b: "Water evaporates from the Arabian Sea, forms clouds, and releases rain when it reaches Kerala's coast",
            c: "Rajasthan has no clouds",
            d: "Kerala uses more water",
          },
          explanations: {
            a: "While Kerala has water bodies, the main reason is its proximity to the sea and monsoon wind patterns.",
            b: "Correct! The monsoon winds carry moisture-laden air from the Arabian Sea. When this air rises over Kerala's Western Ghats, it cools, condenses, and causes heavy precipitation. Rajasthan receives less rainfall as it's far from the sea.",
            c: "Rajasthan does have clouds, but receives less moisture from the monsoon winds.",
            d: "Water usage doesn't affect rainfall patterns.",
          },
        },
        groundwater: {
          title: "Groundwater Depletion",
          description: "A village in Haryana has been using bore wells extensively for the past 10 years.",
          question: "What is likely happening to the groundwater level?",
          options: {
            a: "It remains the same",
            b: "It is increasing",
            c: "It is decreasing because extraction exceeds natural recharge",
            d: "Bore wells create more groundwater",
          },
          explanations: {
            a: "If extraction exceeds recharge through the water cycle, levels will drop.",
            b: "Excessive extraction without adequate infiltration decreases groundwater levels.",
            c: "Correct! Excessive groundwater extraction, combined with reduced infiltration (due to concrete surfaces), depletes aquifers faster than the water cycle can recharge them. This is why rainwater harvesting is important.",
            d: "Bore wells only extract existing groundwater; they don't create it.",
          },
        },
        iceStupa: {
          title: "Ice Stupa in Ladakh",
          description: "In Ladakh, people create ice stupas to store water during winter for use in spring.",
          question: "How does this innovation work with the water cycle?",
          options: {
            a: "It stops the water cycle",
            b: "It stores frozen water that melts slowly in spring when needed",
            c: "It makes rain fall in Ladakh",
            d: "It prevents evaporation completely",
          },
          explanations: {
            a: "Ice stupas don't stop the water cycle; they work within it.",
            b: "Correct! Water is sprayed in winter and freezes into ice stupas. In spring, when radiation from the Sun increases, the ice melts slowly, providing water when streams are dry. This clever use of the water cycle helps overcome water scarcity.",
            c: "Ice stupas don't affect precipitation; they store existing water.",
            d: "Some evaporation still occurs, but ice stupas minimize water loss.",
          },
        },
      },
      seepage: {
        title: "Water Infiltration Experiment",
        materials: {
          clay: {
            name: "Clay",
            porosity: "Porosity: 15%",
            description: "Clay has very small pore spaces. Water seeps very slowly through clay.",
          },
          sand: {
            name: "Sand",
            porosity: "Porosity: 45%",
            description: "Sand has medium-sized pore spaces. Water seeps moderately through sand.",
          },
          gravel: {
            name: "Gravel",
            porosity: "Porosity: 85%",
            description: "Gravel has large, interconnected pore spaces. Water seeps rapidly through gravel.",
          },
        },
        waterAmount: "200 mL Water",
        collected: "Collected",
        rate: {
          title: "Seepage Rate",
          slow: "Slow",
          medium: "Medium",
          fast: "Fast",
        },
        time: {
          title: "Time to Seep",
          slow: "10+ min",
          medium: "5 min",
          fast: "1 min",
        },
        bestFor: {
          title: "Best For",
          storage: "Water Storage",
          farming: "Farming",
          drainage: "Drainage",
        },
      },
      conservation: {
        title: "Water Conservation Simulator",
        aquiferLevel: "Aquifer Water Level",
        markers: {
          full: "100% - Full",
          good: "75% - Good",
          warning: "50% - Warning",
          critical: "25% - Critical",
          depleted: "0% - Depleted",
        },
        useWater: "🚰 Use Water (-10%)",
        rainfall: "🌧️ Rainfall (+20%)",
        criticalWarning: "⚠️ Critical Water Level!",
        criticalMessage: "Implement water conservation measures immediately.",
        solutions: {
          title: "Conservation Solutions",
          rainwater: {
            title: "🏠 Rainwater Harvesting",
            description: "Collect rainwater from rooftops and direct it to recharge pits to refill aquifers.",
          },
          greenCover: {
            title: "🌳 Increase Green Cover",
            description: "Plant trees and reduce concrete surfaces to improve water infiltration.",
          },
          reduceWastage: {
            title: "🔧 Reduce Wastage",
            description: "Fix leaky taps, use water-efficient appliances, and reuse water where possible.",
          },
          rechargePits: {
            title: "💧 Recharge Pits",
            description: "Create pits filled with gravel and sand to help rainwater seep into the ground.",
          },
        },
        successStory: {
          title: "🌟 Success Story: Rajasthan's Water Revival",
          para1: "In several villages of Rajasthan, traditional water harvesting methods like johads (small earthen dams) and tankas (underground tanks) have been revived.",
          para2: "These structures capture rainwater during monsoons, allowing it to infiltrate and recharge groundwater. As a result, dried-up wells have been revived, and the water table has risen significantly!",
        },
      },
      takeaways: {
        title: "🎯 Key Takeaways",
        items: [
          "The water cycle is essential for life and affects weather, climate, and water availability",
          "Different materials have different infiltration rates - gravel > sand > clay",
          "Groundwater is not unlimited and requires conservation and recharge",
          "Understanding the water cycle helps us solve real-world problems like water scarcity",
          "Simple actions like rainwater harvesting can make a big difference",
        ],
      },
    },
  },
  hi: {
    nav: {
      logo: "जल चक्र सीखें",
      tabs: { learn: "सीखें", practice: "अभ्यास", applications: "वास्तविक दुनिया" },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "भाषा चुनें",
    },
    controls: {
      step: "चरण",
      of: "का",
      previous: "पिछला",
      next: "अगला",
      play: "चलाएं",
      pause: "रोकें",
      reset: "रीसेट",
    },
    steps: {
      overview: {
        title: "जल चक्र - एक अवलोकन",
        description:
          "जल चक्र, जिसे जलीय चक्र भी कहा जाता है, पृथ्वी की सतह पर, ऊपर और नीचे पानी की निरंतर गति है। जल चक्र में विभिन्न स्थानों पर पानी तरल, वाष्प और बर्फ के बीच अवस्थाएं बदल सकता है।",
        keyPoints: [
          "पानी लगातार विभिन्न अवस्थाओं के माध्यम से घूमता है",
          "चक्र सूर्य की ऊर्जा से संचालित होता है",
          "पानी महासागरों, वायुमंडल और भूमि के बीच घूमता है",
          "पृथ्वी पर पानी की कुल मात्रा स्थिर रहती है"
        ],
      },
      evaporation: {
        title: "चरण 1: वाष्पीकरण",
        description:
          "जब सूर्य महासागरों, नदियों और झीलों में पानी को गर्म करता है, तो यह वाष्पित होकर जलवाष्प बन जाता है। देखें कि पानी की बूंदें कैसे पानी की सतह से ऊपर उठती हैं।",
        keyPoints: [
          "सूर्य की गर्मी वाष्पीकरण के लिए ऊर्जा प्रदान करती है",
          "पानी तरल से गैस (वाष्प) में बदलता है",
          "महासागरों, नदियों, झीलों और मिट्टी से होता है",
          "लगभग 86% वैश्विक वाष्पीकरण महासागरों से आता है"
        ],
      },
      transpiration: {
        title: "चरण 2: वाष्पोत्सर्जन",
        description:
          "पेड़ों और पौधों से भी वाष्पोत्सर्जन के माध्यम से पानी वाष्पित होता है। पौधे अपनी जड़ों के माध्यम से पानी को अवशोषित करते हैं और अपनी पत्तियों में छोटे छिद्रों के माध्यम से जलवाष्प छोड़ते हैं।",
        keyPoints: [
          "पौधे मिट्टी से जड़ों के माध्यम से पानी अवशोषित करते हैं",
          "पानी पौधे के तने के माध्यम से ऊपर जाता है",
          "जलवाष्प पत्तियों में स्टोमाटा के माध्यम से निकलता है",
          "लगभग 10% वायुमंडलीय नमी पौधों से आती है"
        ],
      },
      condensation: {
        title: "चरण 3: संघनन",
        description:
          "जैसे ही जलवाष्प वायुमंडल में ऊपर उठता है, यह ठंडा हो जाता है। जब यह पर्याप्त ठंडा हो जाता है, तो जलवाष्प छोटी पानी की बूंदों में संघनित होकर बादल बनाता है।",
        keyPoints: [
          "जलवाष्प ठंडा होकर वापस तरल में बदल जाता है",
          "धूल कणों के चारों ओर छोटी पानी की बूंदें बनाता है",
          "बादल, कोहरा और ओस बनाता है",
          "अधिक ऊंचाई = कम तापमान = अधिक संघनन"
        ],
      },
      precipitation: {
        title: "चरण 4: वर्षा",
        description:
          "जब बादल पानी की बूंदों से भारी हो जाते हैं, तो वे पानी को वर्षा के रूप में पृथ्वी पर वापस छोड़ते हैं - बारिश, बर्फ या ओले के रूप में।",
        keyPoints: [
          "बादलों में पानी की बूंदें बड़ी और भारी हो जाती हैं",
          "तापमान 0°C से ऊपर होने पर बारिश के रूप में गिरता है",
          "तापमान 0°C से नीचे होने पर बर्फ के रूप में गिरता है",
          "औसत बारिश की बूंद 20 मील प्रति घंटे (32 किमी/घंटा) की गति से गिरती है"
        ],
      },
      collection: {
        title: "चरण 5: संग्रहण (सतह अपवाह)",
        description:
          "संग्रहण तब होता है जब वर्षा जल निकायों में एकत्र होती है। कुछ पानी सतह अपवाह के रूप में भूमि पर बहकर नदियों और नालों में जाता है, अंततः झीलों और महासागरों तक पहुँचता है। यह अपवाह मिट्टी का कटाव कर सकता है और पोषक तत्वों और प्रदूषकों को ले जा सकता है।",
        keyPoints: [
          "पानी गुरुत्वाकर्षण के कारण नीचे की ओर बहता है",
          "नदियाँ और नाले बनाता है और अंततः महासागरों तक पहुँचता है",
          "कुछ पानी झीलों और तालाबों में एकत्र होता है",
          "अपवाह से कटाव और बाढ़ आ सकती है"
        ],
      },
      infiltration: {
        title: "चरण 6: अंतःस्यंदन और भूजल",
        description:
          "अंतःस्यंदन वह प्रक्रिया है जिसमें पानी मिट्टी और चट्टानों के माध्यम से जमीन में रिसता है। यह पानी भूजल बन जाता है, जो भूमिगत परतों में संग्रहीत होता है जिन्हें जलभृत कहा जाता है। भूजल धीरे-धीरे जमीन के माध्यम से चलता है और सतह पर वापस आने में सालों से सैकड़ों साल लग सकते हैं।",
        keyPoints: [
          "पानी मिट्टी से भूमिगत परतों में रिसता है",
          "चट्टान और मिट्टी की परतों के बीच जलभृत में संग्रहीत",
          "कई समुदायों को पीने का पानी प्रदान करता है",
          "पुनर्भरण में सैकड़ों साल लग सकते हैं"
        ],
      },
      complete: {
        title: "पूर्ण जल चक्र",
        description:
          "जल चक्र निरंतर और परस्पर जुड़ा हुआ है। सौर ऊर्जा वाष्पीकरण और वाष्पोत्सर्जन को चलाती है, जो जलवाष्प को वायुमंडल में भेजती है। ठंडक से संघनन होकर बादल बनते हैं, जो वर्षा छोड़ते हैं। पानी फिर जल निकायों में एकत्र होता है और जमीन में रिसता है, चक्र को पूरा करता है और फिर से शुरू करता है।",
        keyPoints: [
          "सभी चरण लगातार एक साथ काम करते हैं",
          "सौर ऊर्जा और गुरुत्वाकर्षण द्वारा संचालित",
          "ग्रह भर में ताजा पानी वितरित करता है",
          "पृथ्वी पर सभी जीवन के लिए आवश्यक"
        ],
      },
    },
    canvas: {
      evaporation: "वाष्पीकरण",
      transpiration: "वाष्पोत्सर्जन",
      condensation: "संघनन",
      precipitation: "वर्षा",
      collection: "संग्रहण (अपवाह)",
      infiltration: "अंतःस्यंदन",
      groundwater: "भूजल",
      sun: "सूर्य",
      waterBody: "जल निकाय",
      clouds: "बादल",
      rain: "बारिश",
    },
    learn: {
      title: "जल चक्र",
      subtitle: "इंटरएक्टिव लर्निंग अनुभव",
      stepInformation: "चरण जानकारी",
      keyPoints: "मुख्य बिंदु",
      quickJump: "त्वरित जंप",
      didYouKnow: "क्या आप जानते हैं?",
      understanding: "जल चक्र को समझना",
      energySource: "ऊर्जा स्रोत",
      energySourceDesc: "सूर्य वाष्पीकरण के लिए ऊर्जा प्रदान करता है, जो पूरे जल चक्र को चलाता है।",
      stateChanges: "अवस्था परिवर्तन",
      stateChangesDesc: "चक्र भर में पानी तरल, वाष्प और बर्फ के बीच बदलता रहता है।",
      continuousProcess: "निरंतर प्रक्रिया",
      continuousProcessDesc: "चक्र कभी नहीं रुकता - पानी लगातार घूम रहा है और रूप बदल रहा है।",
      lifeSupport: "जीवन सहायता",
      lifeSupportDesc: "जल चक्र सभी जीवित चीजों के लिए आवश्यक ताजा पानी वितरित करता है।",
      funFacts: [
        "🌊 पृथ्वी का 97% पानी महासागरों में है (खारा पानी)",
        "💧 केवल 3% ताजा पानी है, और उसका 2/3 जमा हुआ है!",
        "🌍 यही पानी अरबों वर्षों से चक्रित हो रहा है",
        "☁️ एक बादल का वजन 1 मिलियन पाउंड से अधिक हो सकता है!",
        "🌳 एक बड़ा ओक का पेड़ प्रति वर्ष 40,000 गैलन पानी का वाष्पोत्सर्जन कर सकता है"
      ],
      progress: "प्रगति",
    },
    practice: {
      title: "जल चक्र - अभ्यास मोड",
      subtitle: "चरणों पर क्लिक करें और जल चक्र बनाने के लिए उन्हें जोड़ें!",
      score: "स्कोर",
      reset: "रीसेट",
      showAnswers: "उत्तर दिखाएं",
      instructions: "निर्देश: एक चरण पर क्लिक करें, फिर कनेक्शन बनाने के लिए दूसरे चरण पर क्लिक करें। सभी चरणों को सही तरीके से जोड़कर पूर्ण जल चक्र बनाएं!",
      correct: "✓ सही कनेक्शन!",
      incorrect: "✗ गलत कनेक्शन। पुनः प्रयास करें!",
      alreadyConnected: "✓ कनेक्शन पहले से बना है!",
      progress: "आपकी प्रगति",
      connectionsMade: "कनेक्शन बनाए गए",
      stages: {
        sun: "सूर्य",
        ocean: "महासागर/जल निकाय",
        evaporation: "वाष्पीकरण",
        transpiration: "वाष्पोत्सर्जन",
        condensation: "संघनन",
        precipitation: "वर्षा",
        infiltration: "अंतःस्यंदन",
        groundwater: "भूजल",
      },
      stageDescriptions: {
        sun: "वाष्पीकरण के लिए गर्मी का मुख्य स्रोत",
        ocean: "वाष्पीकरण के लिए पानी का स्रोत",
        evaporation: "गर्मी के कारण पानी जलवाष्प में बदल जाता है",
        transpiration: "पेड़ों और पौधों से पानी वाष्पित होता है",
        condensation: "जलवाष्प ठंडा होकर बादल बनाता है",
        precipitation: "बादलों से बारिश, बर्फ या ओले गिरते हैं",
        infiltration: "पानी मिट्टी और चट्टानों के माध्यम से रिसता है",
        groundwater: "भूमिगत जलभृत में संग्रहीत पानी",
      },
      concepts: {
        evaporation: {
          title: "🌊 वाष्पीकरण",
          description: "महासागरों, नदियों और झीलों से पानी सूर्य द्वारा गर्म होकर जलवाष्प में बदल जाता है।",
        },
        transpiration: {
          title: "🌳 वाष्पोत्सर्जन",
          description: "पौधे अपनी पत्तियों के माध्यम से वायुमंडल में जलवाष्प छोड़ते हैं।",
        },
        condensation: {
          title: "☁️ संघनन",
          description: "जलवाष्प ऊपर उठता है, ठंडा होता है, और छोटी बूंदें बनाता है जो बादल बनाती हैं।",
        },
        precipitation: {
          title: "🌧️ वर्षा",
          description: "बादल पानी को बारिश, बर्फ या ओले के रूप में छोड़ते हैं, जो पृथ्वी पर वापस गिरते हैं।",
        },
      },
    },
    realWorld: {
      title: "जल चक्र - वास्तविक दुनिया के अनुप्रयोग",
      subtitle: "जानें कि जल चक्र हमारे दैनिक जीवन और पर्यावरण को कैसे प्रभावित करता है",
      score: "स्कोर",
      completed: "पूर्ण",
      tabs: {
        scenarios: "🌍 वास्तविक दुनिया के परिदृश्य",
        seepage: "🧪 अंतःस्यंदन प्रयोग",
        conservation: "💧 जल संरक्षण",
      },
      scenario: "परिदृश्य",
      of: "का",
      previous: "← पिछला",
      next: "अगला →",
      correct: "✅ सही!",
      incorrect: "❌ गलत",
      scenarios: {
        coastal: {
          title: "तटीय शहर का मौसम",
          description: "भारत का मुंबई, एक तटीय शहर, अंतर्देशीय शहरों की तुलना में अलग मौसम पैटर्न का अनुभव करता है।",
          question: "मुंबई में पूरे वर्ष अधिक समशीतोष्ण जलवायु क्यों होती है?",
          options: {
            a: "क्योंकि इसमें अधिक पेड़ हैं",
            b: "क्योंकि जल निकाय धीरे-धीरे गर्म और ठंडे होते हैं",
            c: "क्योंकि इमारतों में एयर कंडीशनिंग है",
            d: "क्योंकि इमारतें हवा को रोकती हैं",
          },
          explanations: {
            a: "हालांकि पेड़ मदद करते हैं, लेकिन ये समशीतोष्ण तटीय जलवायु का मुख्य कारण नहीं हैं।",
            b: "सही! महासागरों जैसे बड़े जल निकाय धीरे-धीरे गर्म और ठंडे होते हैं। दिन के दौरान, समुद्र जमीन से ठंडा होता है (समुद्री हवा बनाता है), और रात में, समुद्र जमीन से गर्म होता है (स्थलीय हवा बनाता है)। यह तापमान को संतुलित करता है।",
            c: "एयर कंडीशनिंग इनडोर तापमान को प्रभावित करती है लेकिन समग्र शहर की जलवायु को नहीं।",
            d: "इमारतें स्थानीय हवा के पैटर्न को प्रभावित कर सकती हैं लेकिन समग्र समशीतोष्ण जलवायु को नहीं।",
          },
        },
        drying: {
          title: "कपड़े सुखाना",
          description: "आपकी माँ दो अलग-अलग दिनों में छत पर गीले कपड़े टांगती है।",
          question: "किस दिन कपड़े तेजी से सूखेंगे?",
          options: {
            a: "एक बादल छाए, नम दिन",
            b: "एक धूप वाला, सूखा दिन",
            c: "दोनों दिन एक जैसे होंगे",
            d: "रात में जब यह ठंडा हो",
          },
          explanations: {
            a: "उच्च आर्द्रता वाले बादल छाए दिनों में, वाष्पीकरण धीमा होता है क्योंकि हवा में पहले से ही नमी होती है।",
            b: "सही! कपड़े धूप वाले दिनों में तेजी से सूखते हैं क्योंकि सूर्य की गर्मी वाष्पीकरण को बढ़ाती है। सूखी हवा अधिक नमी अवशोषित कर सकती है, जिससे सुखाने की प्रक्रिया तेज होती है।",
            c: "नहीं, वाष्पीकरण की दर तापमान और आर्द्रता पर निर्भर करती है।",
            d: "कम तापमान वाष्पीकरण दर को कम करता है, इसलिए रात में सुखाना धीमा होता है।",
          },
        },
        monsoon: {
          title: "मानसून सीजन",
          description: "मानसून के दौरान, केरल में भारी वर्षा होती है जबकि राजस्थान के कुछ हिस्से सूखे रहते हैं।",
          question: "जल चक्र इस अंतर में क्या भूमिका निभाता है?",
          options: {
            a: "केरल में अधिक जल निकाय हैं",
            b: "अरब सागर से पानी वाष्पित होता है, बादल बनाता है, और केरल के तट पर पहुंचने पर बारिश छोड़ता है",
            c: "राजस्थान में बादल नहीं हैं",
            d: "केरल अधिक पानी का उपयोग करता है",
          },
          explanations: {
            a: "हालांकि केरल में जल निकाय हैं, लेकिन मुख्य कारण समुद्र के करीब और मानसून हवा के पैटर्न हैं।",
            b: "सही! मानसून की हवाएं अरब सागर से नमी से भरी हवा ले जाती हैं। जब यह हवा केरल की पश्चिमी घाटों पर उठती है, तो यह ठंडी होती है, संघनित होती है, और भारी वर्षा का कारण बनती है। राजस्थान समुद्र से दूर होने के कारण कम वर्षा प्राप्त करता है।",
            c: "राजस्थान में बादल हैं, लेकिन मानसून हवाओं से कम नमी प्राप्त होती है।",
            d: "पानी का उपयोग वर्षा के पैटर्न को प्रभावित नहीं करता है।",
          },
        },
        groundwater: {
          title: "भूजल की कमी",
          description: "हरियाणा के एक गाँव में पिछले 10 वर्षों से बोरवेल का व्यापक उपयोग किया जा रहा है।",
          question: "भूजल स्तर के साथ क्या होने की संभावना है?",
          options: {
            a: "यह समान रहता है",
            b: "यह बढ़ रहा है",
            c: "यह घट रहा है क्योंकि निष्कर्षण प्राकृतिक पुनर्भरण से अधिक है",
            d: "बोरवेल अधिक भूजल बनाते हैं",
          },
          explanations: {
            a: "यदि निष्कर्षण जल चक्र के माध्यम से पुनर्भरण से अधिक है, तो स्तर गिरेंगे।",
            b: "पर्याप्त अंतःस्यंदन के बिना अत्यधिक निष्कर्षण भूजल स्तर को कम करता है।",
            c: "सही! अत्यधिक भूजल निष्कर्षण, कम अंतःस्यंदन (कंक्रीट सतहों के कारण) के साथ मिलकर, जलभृत को जल चक्र के पुनर्भरण से तेजी से खाली करता है। यही कारण है कि वर्षा जल संचयन महत्वपूर्ण है।",
            d: "बोरवेल केवल मौजूदा भूजल को निकालते हैं; वे इसे नहीं बनाते हैं।",
          },
        },
        iceStupa: {
          title: "लद्दाख में आइस स्तूप",
          description: "लद्दाख में, लोग सर्दियों में पानी जमाकर वसंत में उपयोग के लिए आइस स्तूप बनाते हैं।",
          question: "यह नवाचार जल चक्र के साथ कैसे काम करता है?",
          options: {
            a: "यह जल चक्र को रोकता है",
            b: "यह जमे हुए पानी को संग्रहीत करता है जो वसंत में आवश्यकता पड़ने पर धीरे-धीरे पिघलता है",
            c: "यह लद्दाख में बारिश कराता है",
            d: "यह वाष्पीकरण को पूरी तरह से रोकता है",
          },
          explanations: {
            a: "आइस स्तूप जल चक्र को नहीं रोकते हैं; वे इसके भीतर काम करते हैं।",
            b: "सही! सर्दियों में पानी का छिड़काव किया जाता है और यह आइस स्तूपों में जम जाता है। वसंत में, जब सूर्य से विकिरण बढ़ता है, तो बर्फ धीरे-धीरे पिघलती है, जो धाराएं सूखने पर पानी प्रदान करती है। जल चक्र का यह चतुर उपयोग जल की कमी को दूर करने में मदद करता है।",
            c: "आइस स्तूप वर्षा को प्रभावित नहीं करते हैं; वे मौजूदा पानी को संग्रहीत करते हैं।",
            d: "कुछ वाष्पीकरण अभी भी होता है, लेकिन आइस स्तूप पानी की हानि को कम करते हैं।",
          },
        },
      },
      seepage: {
        title: "जल अंतःस्यंदन प्रयोग",
        materials: {
          clay: {
            name: "मिट्टी",
            porosity: "छिद्रता: 15%",
            description: "मिट्टी में बहुत छोटे छिद्र स्थान होते हैं। पानी मिट्टी के माध्यम से बहुत धीरे-धीरे रिसता है।",
          },
          sand: {
            name: "रेत",
            porosity: "छिद्रता: 45%",
            description: "रेत में मध्यम आकार के छिद्र स्थान होते हैं। पानी रेत के माध्यम से मध्यम रूप से रिसता है।",
          },
          gravel: {
            name: "बजरी",
            porosity: "छिद्रता: 85%",
            description: "बजरी में बड़े, आपस में जुड़े छिद्र स्थान होते हैं। पानी बजरी के माध्यम से तेजी से रिसता है।",
          },
        },
        waterAmount: "200 मिली पानी",
        collected: "एकत्रित",
        rate: {
          title: "रिसाव दर",
          slow: "धीमी",
          medium: "मध्यम",
          fast: "तेज",
        },
        time: {
          title: "रिसने का समय",
          slow: "10+ मिनट",
          medium: "5 मिनट",
          fast: "1 मिनट",
        },
        bestFor: {
          title: "सर्वोत्तम",
          storage: "जल भंडारण",
          farming: "खेती",
          drainage: "जल निकासी",
        },
      },
      conservation: {
        title: "जल संरक्षण सिम्युलेटर",
        aquiferLevel: "जलभृत जल स्तर",
        markers: {
          full: "100% - भरा हुआ",
          good: "75% - अच्छा",
          warning: "50% - चेतावनी",
          critical: "25% - गंभीर",
          depleted: "0% - समाप्त",
        },
        useWater: "🚰 पानी उपयोग करें (-10%)",
        rainfall: "🌧️ वर्षा (+20%)",
        criticalWarning: "⚠️ गंभीर जल स्तर!",
        criticalMessage: "तुरंत जल संरक्षण उपाय लागू करें।",
        solutions: {
          title: "संरक्षण समाधान",
          rainwater: {
            title: "🏠 वर्षा जल संचयन",
            description: "छतों से वर्षा जल एकत्र करें और इसे पुनर्भरण गड्ढों में निर्देशित करें ताकि जलभृत भर जाएं।",
          },
          greenCover: {
            title: "🌳 हरित आवरण बढ़ाएं",
            description: "पानी के अंतःस्यंदन में सुधार के लिए पेड़ लगाएं और कंक्रीट सतहों को कम करें।",
          },
          reduceWastage: {
            title: "🔧 बर्बादी कम करें",
            description: "टपकते नलों को ठीक करें, पानी-कुशल उपकरणों का उपयोग करें, और जहाँ संभव हो पानी का पुन: उपयोग करें।",
          },
          rechargePits: {
            title: "💧 पुनर्भरण गड्ढे",
            description: "वर्षा जल को जमीन में रिसने में मदद करने के लिए बजरी और रेत से भरे गड्ढे बनाएं।",
          },
        },
        successStory: {
          title: "🌟 सफलता की कहानी: राजस्थान का जल पुनर्जीवन",
          para1: "राजस्थान के कई गाँवों में, जोहड़ (छोटे मिट्टी के बांध) और टांका (भूमिगत टैंक) जैसी पारंपरिक जल संचयन विधियों को पुनर्जीवित किया गया है।",
          para2: "ये संरचनाएं मानसून के दौरान वर्षा जल को पकड़ती हैं, इसे अंतःस्यंदन और भूजल पुनर्भरण की अनुमति देती हैं। परिणामस्वरूप, सूखे कुओं को पुनर्जीवित किया गया है, और जल स्तर में काफी वृद्धि हुई है!",
        },
      },
      takeaways: {
        title: "🎯 मुख्य बातें",
        items: [
          "जल चक्र जीवन के लिए आवश्यक है और मौसम, जलवायु और जल उपलब्धता को प्रभावित करता है",
          "विभिन्न सामग्रियों की अलग-अलग अंतःस्यंदन दरें होती हैं - बजरी > रेत > मिट्टी",
          "भूजल असीमित नहीं है और संरक्षण और पुनर्भरण की आवश्यकता होती है",
          "जल चक्र को समझना हमें जल की कमी जैसी वास्तविक दुनिया की समस्याओं को हल करने में मदद करता है",
          "वर्षा जल संचयन जैसे सरल कार्यों से बड़ा अंतर आ सकता है",
        ],
      },
    },
  },
  gu: {
    nav: {
      logo: "જળ ચક્ર શીખો",
      tabs: { learn: "શીખો", practice: "અભ્યાસ", applications: "વાસ્તવિક વિશ્વ" },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "ભાષા પસંદ કરો",
    },
    controls: {
      step: "પગલું",
      of: "નું",
      previous: "અગાઉ",
      next: "આગળ",
      play: "ચલાવો",
      pause: "થોભાવો",
      reset: "રીસેટ",
    },
    steps: {
      overview: {
        title: "જળ ચક્ર - એક અવલોકન",
        description:
          "જળ ચક્ર, જેને જળીય ચક્ર પણ કહેવામાં આવે છે, એ પૃથ્વીની સપાટી પર, ઉપર અને નીચે પાણીની સતત હલચલ છે। જળ ચક્રમાં વિવિધ સ્થાનોએ પાણી પ્રવાહી, વરાળ અને બરફ વચ્ચે અવસ્થાઓ બદલી શકે છે।",
        keyPoints: [
          "પાણી સતત વિવિધ અવસ્થાઓ દ્વારા ફરે છે",
          "ચક્ર સૂર્યની ઊર્જાથી સંચાલિત થાય છે",
          "પાણી મહાસાગરો, વાતાવરણ અને જમીન વચ્ચે ફરે છે",
          "પૃથ્વી પર પાણીની કુલ માત્રા સ્થિર રહે છે"
        ],
      },
      evaporation: {
        title: "પગલું 1: બાષ્પીભવન",
        description:
          "જ્યારે સૂર્ય મહાસાગરો, નદીઓ અને તળાવોમાં પાણીને ગરમ કરે છે, ત્યારે તે બાષ્પીભવન થાય છે અને જળ વરાળ બને છે। જુઓ કે પાણીના ટીપાં કેવી રીતે પાણીની સપાટીથી ઉપર જાય છે।",
        keyPoints: [
          "સૂર્યની ગરમી બાષ્પીભવન માટે ઊર્જા પ્રદાન કરે છે",
          "પાણી પ્રવાહીથી ગેસ (વરાળ) માં ફેરવાય છે",
          "મહાસાગરો, નદીઓ, તળાવો અને માટીમાંથી થાય છે",
          "લગભગ 86% વૈશ્વિક બાષ્પીભવન મહાસાગરોમાંથી આવે છે"
        ],
      },
      transpiration: {
        title: "પગલું 2: વાષ્પોત્સર્જન",
        description:
          "વૃક્ષો અને છોડમાંથી પણ વાષ્પોત્સર્જન દ્વારા પાણી બાષ્પીભવન થાય છે। છોડ તેમના મૂળ દ્વારા પાણી શોષી લે છે અને તેમના પાંદડાઓમાં નાના છિદ્રો દ્વારા જળ વરાળ મુક્ત કરે છે।",
        keyPoints: [
          "છોડ માટીમાંથી મૂળ દ્વારા પાણી શોષે છે",
          "પાણી છોડના દાંડા દ્વારા ઉપર જાય છે",
          "જળ વરાળ પાંદડાઓમાં સ્ટોમાટા દ્વારા બહાર નીકળે છે",
          "લગભગ 10% વાતાવરણીય ભેજ છોડમાંથી આવે છે"
        ],
      },
      condensation: {
        title: "પગલું 3: સંઘનન",
        description:
          "જેમ જેમ જળ વરાળ વાતાવરણમાં ઉપર જાય છે, તે ઠંડુ થાય છે। જ્યારે તે પૂરતું ઠંડુ થાય છે, ત્યારે જળ વરાળ નાના પાણીના ટીપાંમાં સંઘનિત થઈને વાદળો બનાવે છે।",
        keyPoints: [
          "જળ વરાળ ઠંડી થઈને પાછી પ્રવાહીમાં ફેરવાય છે",
          "ધૂળ કણોની આસપાસ નાના પાણીના ટીપાં બનાવે છે",
          "વાદળો, ધુમ્મસ અને ઓસ બનાવે છે",
          "ઉચ્ચ ઊંચાઈ = ઠંડુ તાપમાન = વધુ સંઘનન"
        ],
      },
      precipitation: {
        title: "પગલું 4: વરસાદ",
        description:
          "જ્યારે વાદળો પાણીના ટીપાંથી ભારે થાય છે, ત્યારે તેઓ પાણીને વરસાદ તરીકે પૃથ્વી પર પાછા છોડે છે - વરસાદ, બરફ અથવા કરાના રૂપમાં।",
        keyPoints: [
          "વાદળોમાં પાણીના ટીપાં મોટા અને ભારે થાય છે",
          "તાપમાન 0°C થી ઉપર હોય ત્યારે વરસાદ તરીકે પડે છે",
          "તાપમાન 0°C થી નીચે હોય ત્યારે બરફ તરીકે પડે છે",
          "સરેરાશ વરસાદનું ટીપું 20 માઇલ પ્રતિ કલાક (32 કિમી/કલાક) ની ઝડપથી પડે છે"
        ],
      },
      collection: {
        title: "પગલું 5: સંગ્રહ (સપાટી રનઓફ)",
        description:
          "સંગ્રહ ત્યારે થાય છે જ્યારે વરસાદ જળ સંસ્થાઓમાં એકત્રિત થાય છે। કેટલાક પાણી સપાટી રનઓફ તરીકે જમીન પર વહીને નદીઓ અને નાળાઓમાં જાય છે, અંતે તળાવો અને મહાસાગરો સુધી પહોંચે છે। આ રનઓફ માટીનું કટાણ કરી શકે છે અને પોષક તત્વો અને પ્રદૂષકોને લઈ જઈ શકે છે।",
        keyPoints: [
          "પાણી ગુરુત્વાકર્ષણના કારણે નીચે તરફ વહે છે",
          "નદીઓ અને નાળાઓ બનાવે છે અને અંતે મહાસાગરો સુધી પહોંચે છે",
          "કેટલાક પાણી તળાવો અને તળાવોમાં એકત્રિત થાય છે",
          "રનઓફ કટાણ અને પૂરનું કારણ બની શકે છે"
        ],
      },
      infiltration: {
        title: "પગલું 6: અંતર્સ્યંદન અને ભૂજળ",
        description:
          "અંતર્સ્યંદન એ પ્રક્રિયા છે જ્યાં પાણી માટી અને ખડકો દ્વારા જમીનમાં રસે છે। આ પાણી ભૂજળ બને છે, જે ભૂગર્ભ સ્તરોમાં સંગ્રહિત થાય છે જેને જળભરત કહેવામાં આવે છે। ભૂજળ ધીમે ધીમે જમીન દ્વારા ફરે છે અને સપાટી પર પાછું આવવામાં વર્ષોથી સેંકડો વર્ષ લાગી શકે છે।",
        keyPoints: [
          "પાણી માટી દ્વારા ભૂગર્ભ સ્તરોમાં રસે છે",
          "ખડક અને માટીની સ્તરો વચ્ચે જળભરતમાં સંગ્રહિત",
          "ઘણા સમુદાયોને પીણાનું પાણી પ્રદાન કરે છે",
          "પુનઃભરણ માટે સેંકડો વર્ષ લાગી શકે છે"
        ],
      },
      complete: {
        title: "સંપૂર્ણ જળ ચક્ર",
        description:
          "જળ ચક્ર સતત અને પરસ્પર જોડાયેલું છે। સૌર ઊર્જા બાષ્પીભવન અને વાષ્પોત્સર્જનને ચલાવે છે, જે જળ વરાળને વાતાવરણમાં મોકલે છે। ઠંડકથી વાદળોમાં સંઘનન થાય છે, જે વરસાદ છોડે છે। પાણી પછી જળ સંસ્થાઓમાં એકત્રિત થાય છે અને જમીનમાં રસે છે, ચક્રને પૂર્ણ કરે છે અને ફરીથી શરૂ કરે છે।",
        keyPoints: [
          "બધા પગલાઓ સતત એકસાથે કામ કરે છે",
          "સૌર ઊર્જા અને ગુરુત્વાકર્ષણ દ્વારા સંચાલિત",
          "ગ્રહ પર તાજા પાણીને વિતરિત કરે છે",
          "પૃથ્વી પરના બધા જીવન માટે આવશ્યક"
        ],
      },
    },
    canvas: {
      evaporation: "બાષ્પીભવન",
      transpiration: "વાષ્પોત્સર્જન",
      condensation: "સંઘનન",
      precipitation: "વરસાદ",
      collection: "સંગ્રહ (રનઓફ)",
      infiltration: "અંતર્સ્યંદન",
      groundwater: "ભૂજળ",
      sun: "સૂર્ય",
      waterBody: "જળ સંસ્થા",
      clouds: "વાદળો",
      rain: "વરસાદ",
    },
    learn: {
      title: "જળ ચક્ર",
      subtitle: "ઇન્ટરએક્ટિવ શીખવાનો અનુભવ",
      stepInformation: "પગલું માહિતી",
      keyPoints: "મુખ્ય મુદ્દાઓ",
      quickJump: "ઝડપી જમ્પ",
      didYouKnow: "શું તમે જાણો છો?",
      understanding: "જળ ચક્રને સમજવું",
      energySource: "ઊર્જા સ્ત્રોત",
      energySourceDesc: "સૂર્ય બાષ્પીભવન માટે ઊર્જા પ્રદાન કરે છે, જે આખા જળ ચક્રને ચલાવે છે।",
      stateChanges: "સ્થિતિ પરિવર્તન",
      stateChangesDesc: "ચક્ર દરમિયાન પાણી પ્રવાહી, વરાળ અને બરફ વચ્ચે બદલાય છે।",
      continuousProcess: "સતત પ્રક્રિયા",
      continuousProcessDesc: "ચક્ર ક્યારેય અટકતું નથી - પાણી સતત ફરતું રહે છે અને રૂપ બદલે છે।",
      lifeSupport: "જીવન સહાય",
      lifeSupportDesc: "જળ ચક્ર બધી જીવંત વસ્તુઓ માટે આવશ્યક તાજા પાણીને વિતરિત કરે છે।",
      funFacts: [
        "🌊 પૃથ્વીનો 97% પાણી મહાસાગરોમાં છે (ખારું પાણી)",
        "💧 માત્ર 3% તાજું પાણી છે, અને તેનો 2/3 જામી ગયેલું છે!",
        "🌍 આ જ પાણી અબજો વર્ષોથી ફરી રહ્યું છે",
        "☁️ એક વાદળનું વજન 1 મિલિયન પાઉન્ડથી વધારે હોઈ શકે છે!",
        "🌳 એક મોટું ઓકનું ઝાડ વર્ષ દીઠ 40,000 ગેલન પાણીનો વાષ્પોત્સર્જન કરી શકે છે"
      ],
      progress: "પ્રગતિ",
    },
    practice: {
      title: "જળ ચક્ર - અભ્યાસ મોડ",
      subtitle: "પગલાઓ પર ક્લિક કરો અને જળ ચક્ર બનાવવા માટે તેમને જોડો!",
      score: "સ્કોર",
      reset: "રીસેટ",
      showAnswers: "જવાબો બતાવો",
      instructions: "સૂચનાઓ: એક પગલું પર ક્લિક કરો, પછી કનેક્શન બનાવવા માટે બીજા પગલા પર ક્લિક કરો. બધા પગલાઓને સાચી રીતે જોડીને સંપૂર્ણ જળ ચક્ર બનાવો!",
      correct: "✓ સાચો કનેક્શન!",
      incorrect: "✗ ખોટો કનેક્શન. ફરીથી પ્રયાસ કરો!",
      alreadyConnected: "✓ કનેક્શન પહેલેથી બનાવ્યો છે!",
      progress: "તમારી પ્રગતિ",
      connectionsMade: "કનેક્શન બનાવ્યા",
      stages: {
        sun: "સૂર્ય",
        ocean: "મહાસાગર/જળ સંસ્થાઓ",
        evaporation: "બાષ્પીભવન",
        transpiration: "વાષ્પોત્સર્જન",
        condensation: "સંઘનન",
        precipitation: "વરસાદ",
        infiltration: "અંતર્સ્યંદન",
        groundwater: "ભૂજળ",
      },
      stageDescriptions: {
        sun: "બાષ્પીભવન માટે ગરમીનો મુખ્ય સ્ત્રોત",
        ocean: "બાષ્પીભવન માટે પાણીનો સ્ત્રોત",
        evaporation: "ગરમીના કારણે પાણી જળ વરાળમાં ફેરવાય છે",
        transpiration: "વૃક્ષો અને છોડમાંથી પાણી બાષ્પીભવન થાય છે",
        condensation: "જળ વરાળ ઠંડી થઈને વાદળો બનાવે છે",
        precipitation: "વાદળોમાંથી વરસાદ, બરફ અથવા કરાના રૂપમાં પાણી પડે છે",
        infiltration: "પાણી માટી અને ખડકો દ્વારા રસે છે",
        groundwater: "ભૂગર્ભજળ ભંડારણમાં સંગ્રહિત પાણી",
      },
      concepts: {
        evaporation: {
          title: "🌊 બાષ્પીભવન",
          description: "મહાસાગરો, નદીઓ અને તળાવોમાંથી પાણી સૂર્ય દ્વારા ગરમ થઈને જળ વરાળમાં ફેરવાય છે.",
        },
        transpiration: {
          title: "🌳 વાષ્પોત્સર્જન",
          description: "છોડ તેમની પાંદડાઓ દ્વારા વાતાવરણમાં જળ વરાળ છોડે છે.",
        },
        condensation: {
          title: "☁️ સંઘનન",
          description: "જળ વરાળ ઉપર જાય છે, ઠંડી થાય છે, અને નાના ટીપાં બનાવે છે જે વાદળો બનાવે છે.",
        },
        precipitation: {
          title: "🌧️ વરસાદ",
          description: "વાદળો પાણીને વરસાદ, બરફ અથવા કરાના રૂપમાં છોડે છે, જે પૃથ્વી પર પાછા પડે છે.",
        },
      },
    },
    realWorld: {
      title: "જળ ચક્ર - વાસ્તવિક વિશ્વના ઉપયોગો",
      subtitle: "જાણો કે જળ ચક્ર આપણા દૈનિક જીવન અને પર્યાવરણને કેવી રીતે પ્રભાવિત કરે છે",
      score: "સ્કોર",
      completed: "પૂર્ણ",
      tabs: {
        scenarios: "🌍 વાસ્તવિક વિશ્વના પરિદૃશ્યો",
        seepage: "🧪 અંતર્સ્યંદન પ્રયોગ",
        conservation: "💧 જળ સંરક્ષણ",
      },
      scenario: "પરિદૃશ્ય",
      of: "નું",
      previous: "← અગાઉ",
      next: "આગળ →",
      correct: "✅ સાચું!",
      incorrect: "❌ ખોટું",
      scenarios: {
        coastal: {
          title: "કિનારાના શહેરનું હવામાન",
          description: "ભારતનું મુંબઈ, એક કિનારાનું શહેર, અંતર્દેશીય શહેરોની તુલનામાં વિવિધ હવામાન પેટર્ન અનુભવે છે.",
          question: "મુંબઈમાં આખા વર્ષ દરમિયાન વધુ નમૂનેદાર વાતાવરણ કેમ હોય છે?",
          options: {
            a: "કારણ કે તેમાં વધુ વૃક્ષો છે",
            b: "કારણ કે જળ સંસ્થાઓ ધીમે ધીમે ગરમ અને ઠંડી થાય છે",
            c: "કારણ કે ઇમારતોમાં એર કન્ડીશનિંગ છે",
            d: "કારણ કે ઇમારતો હવાને અવરોધે છે",
          },
          explanations: {
            a: "જ્યારે વૃક્ષો મદદ કરે છે, પરંતુ તે નમૂનેદાર કિનારાના વાતાવરણનું મુખ્ય કારણ નથી.",
            b: "સાચું! મહાસાગરો જેવી મોટી જળ સંસ્થાઓ ધીમે ધીમે ગરમ અને ઠંડી થાય છે. દિવસ દરમિયાન, સમુદ્ર જમીન કરતાં ઠંડો છે (સમુદ્રી પવન બનાવે છે), અને રાત્રે, સમુદ્ર જમીન કરતાં ગરમ છે (જમીની પવન બનાવે છે). આ તાપમાનને સંતુલિત કરે છે.",
            c: "એર કન્ડીશનિંગ ઇનડોર તાપમાનને પ્રભાવિત કરે છે પરંતુ એકંદર શહેરની વાતાવરણને નહીં.",
            d: "ઇમારતો સ્થાનિક પવન પેટર્નને પ્રભાવિત કરી શકે છે પરંતુ એકંદર નમૂનેદાર વાતાવરણને નહીં.",
          },
        },
        drying: {
          title: "કપડાં સુકાવવા",
          description: "તમારી માતા બે અલગ અલગ દિવસોમાં છત પર ભીના કપડાં ટાંગે છે.",
          question: "કયા દિવસે કપડાં ઝડપથી સૂકાશે?",
          options: {
            a: "એક વાદળાળુ, ભેજવાળો દિવસ",
            b: "એક સૂર્યપ્રકાશવાળો, શુષ્ક દિવસ",
            c: "બંને દિવસો સમાન હશે",
            d: "રાત્રે જ્યારે તે ઠંડુ હોય",
          },
          explanations: {
            a: "ઉચ્ચ ભેજવાળા વાદળાળુ દિવસોમાં, બાષ્પીભવન ધીમું છે કારણ કે હવામાં પહેલેથી જ ભેજ છે.",
            b: "સાચું! કપડાં સૂર્યપ્રકાશવાળા દિવસોમાં ઝડપથી સૂકાય છે કારણ કે સૂર્યની ગરમી બાષ્પીભવનને વધારે છે. શુષ્ક હવા વધુ ભેજ શોષી શકે છે, જે સુકાવાની પ્રક્રિયાને ઝડપી બનાવે છે.",
            c: "ના, બાષ્પીભવનની દર તાપમાન અને ભેજ પર આધારિત છે.",
            d: "નીચું તાપમાન બાષ્પીભવન દરને ઘટાડે છે, તેથી રાત્રે સુકાવું ધીમું છે.",
          },
        },
        monsoon: {
          title: "માનસૂન સીઝન",
          description: "માનસૂન દરમિયાન, કેરળમાં ભારે વરસાદ પડે છે જ્યારે રાજસ્થાનના કેટલાક ભાગો શુષ્ક રહે છે.",
          question: "જળ ચક્ર આ તફાવતમાં શું ભૂમિકા ભજવે છે?",
          options: {
            a: "કેરળમાં વધુ જળ સંસ્થાઓ છે",
            b: "અરબ સમુદ્રમાંથી પાણી બાષ્પીભવન થાય છે, વાદળો બનાવે છે, અને કેરળના કિનારા પર પહોંચે ત્યારે વરસાદ છોડે છે",
            c: "રાજસ્થાનમાં વાદળો નથી",
            d: "કેરળ વધુ પાણીનો ઉપયોગ કરે છે",
          },
          explanations: {
            a: "જ્યારે કેરળમાં જળ સંસ્થાઓ છે, પરંતુ મુખ્ય કારણ સમુદ્રની નજીક અને માનસૂન પવન પેટર્ન છે.",
            b: "સાચું! માનસૂન પવનો અરબ સમુદ્રમાંથી ભેજયુક્ત હવા લાવે છે. જ્યારે આ હવા કેરળની પશ્ચિમી ઘાટો પર ઉઠે છે, ત્યારે તે ઠંડી થાય છે, સંઘનન થાય છે, અને ભારે વરસાદનું કારણ બને છે. રાજસ્થાન સમુદ્રથી દૂર હોવાને કારણે ઓછો વરસાદ મેળવે છે.",
            c: "રાજસ્થાનમાં વાદળો છે, પરંતુ માનસૂન પવનોમાંથી ઓછો ભેજ મેળવે છે.",
            d: "પાણીનો ઉપયોગ વરસાદના પેટર્નને પ્રભાવિત નથી કરતો.",
          },
        },
        groundwater: {
          title: "ભૂજળની ઘટાડો",
          description: "હરિયાણાના એક ગામમાં પાછલા 10 વર્ષોથી બોરવેલનો વ્યાપક ઉપયોગ થઈ રહ્યો છે.",
          question: "ભૂજળની સ્તર સાથે શું થવાની સંભાવના છે?",
          options: {
            a: "તે સમાન રહે છે",
            b: "તે વધી રહ્યું છે",
            c: "તે ઘટી રહ્યું છે કારણ કે નિષ્કર્ષણ કુદરતી પુનઃભરણ કરતાં વધુ છે",
            d: "બોરવેલ વધુ ભૂજળ બનાવે છે",
          },
          explanations: {
            a: "જો નિષ્કર્ષણ જળ ચક્ર દ્વારા પુનઃભરણ કરતાં વધુ છે, તો સ્તર ઘટશે.",
            b: "પર્યાપ્ત અંતર્સ્યંદન વિના અતિશય નિષ્કર્ષણ ભૂજળ સ્તરને ઘટાડે છે.",
            c: "સાચું! અતિશય ભૂજળ નિષ્કર્ષણ, ઘટેલા અંતર્સ્યંદન (કોંક્રિટ સપાટીઓના કારણે) સાથે મળીને, જળભરતને જળ ચક્રના પુનઃભરણ કરતાં ઝડપથી ખાલી કરે છે. તેથી જ વરસાદી પાણી સંગ્રહ મહત્વપૂર્ણ છે.",
            d: "બોરવેલ માત્ર હાલના ભૂજળને નિષ્કર્ષણ કરે છે; તેઓ તેને બનાવતા નથી.",
          },
        },
        iceStupa: {
          title: "લદ્દાખમાં આઇસ સ્તૂપ",
          description: "લદ્દાખમાં, લોકો શિયાળામાં પાણી સંગ્રહ કરીને વસંતમાં ઉપયોગ માટે આઇસ સ્તૂપ બનાવે છે.",
          question: "આ નવીનતા જળ ચક્ર સાથે કેવી રીતે કામ કરે છે?",
          options: {
            a: "તે જળ ચક્રને અટકાવે છે",
            b: "તે જમેલા પાણીને સંગ્રહ કરે છે જે વસંતમાં જરૂર પડે ત્યારે ધીમે ધીમે પીગળે છે",
            c: "તે લદ્દાખમાં વરસાદ પાડે છે",
            d: "તે બાષ્પીભવનને સંપૂર્ણપણે અટકાવે છે",
          },
          explanations: {
            a: "આઇસ સ્તૂપ જળ ચક્રને અટકાવતા નથી; તેઓ તેની અંદર કામ કરે છે.",
            b: "સાચું! શિયાળામાં પાણી છંટકાવ કરવામાં આવે છે અને તે આઇસ સ્તૂપોમાં જમે છે. વસંતમાં, જ્યારે સૂર્યમાંથી વિકિરણ વધે છે, ત્યારે બરફ ધીમે ધીમે પીગળે છે, જે નદીઓ સૂકાય ત્યારે પાણી પ્રદાન કરે છે. જળ ચક્રનો આ ચતુર ઉપયોગ પાણીની ખોટને દૂર કરવામાં મદદ કરે છે.",
            c: "આઇસ સ્તૂપ વરસાદને પ્રભાવિત નથી કરતા; તેઓ હાલના પાણીને સંગ્રહ કરે છે.",
            d: "કેટલાક બાષ્પીભવન હજુ પણ થાય છે, પરંતુ આઇસ સ્તૂપ પાણીની ખોટને ઘટાડે છે.",
          },
        },
      },
      seepage: {
        title: "જળ અંતર્સ્યંદન પ્રયોગ",
        materials: {
          clay: {
            name: "માટી",
            porosity: "છિદ્રતા: 15%",
            description: "માટીમાં ખૂબ નાના છિદ્ર સ્થાનો છે. પાણી માટી દ્વારા ખૂબ ધીમે રસે છે.",
          },
          sand: {
            name: "રેતી",
            porosity: "છિદ્રતા: 45%",
            description: "રેતીમાં મધ્યમ કદના છિદ્ર સ્થાનો છે. પાણી રેતી દ્વારા મધ્યમ રીતે રસે છે.",
          },
          gravel: {
            name: "કાંકરી",
            porosity: "છિદ્રતા: 85%",
            description: "કાંકરીમાં મોટા, આપસમાં જોડાયેલા છિદ્ર સ્થાનો છે. પાણી કાંકરી દ્વારા ઝડપથી રસે છે.",
          },
        },
        waterAmount: "200 મિલી પાણી",
        collected: "એકત્રિત",
        rate: {
          title: "રસાવણી દર",
          slow: "ધીમો",
          medium: "મધ્યમ",
          fast: "ઝડપી",
        },
        time: {
          title: "રસાવવાનો સમય",
          slow: "10+ મિનિટ",
          medium: "5 મિનિટ",
          fast: "1 મિનિટ",
        },
        bestFor: {
          title: "શ્રેષ્ઠ",
          storage: "જળ સંગ્રહ",
          farming: "ખેતી",
          drainage: "જળ નિકાસ",
        },
      },
      conservation: {
        title: "જળ સંરક્ષણ સિમ્યુલેટર",
        aquiferLevel: "જળભરત જળ સ્તર",
        markers: {
          full: "100% - ભરેલું",
          good: "75% - સારું",
          warning: "50% - ચેતવણી",
          critical: "25% - ગંભીર",
          depleted: "0% - ખાલી",
        },
        useWater: "🚰 પાણીનો ઉપયોગ કરો (-10%)",
        rainfall: "🌧️ વરસાદ (+20%)",
        criticalWarning: "⚠️ ગંભીર જળ સ્તર!",
        criticalMessage: "તરત જળ સંરક્ષણ પગલાં અમલમાં મૂકો.",
        solutions: {
          title: "સંરક્ષણ ઉકેલો",
          rainwater: {
            title: "🏠 વરસાદી પાણી સંગ્રહ",
            description: "છતોમાંથી વરસાદી પાણી એકત્રિત કરો અને તેને પુનઃભરણ ખાડાઓમાં નિર્દેશિત કરો જેથી જળભરત ભરાય.",
          },
          greenCover: {
            title: "🌳 લીલો આવરણ વધારો",
            description: "જળ અંતર્સ્યંદન સુધારવા માટે વૃક્ષો લગાવો અને કોંક્રિટ સપાટીઓ ઘટાડો.",
          },
          reduceWastage: {
            title: "🔧 બગાડ ઘટાડો",
            description: "લીકિંગ ટેપ ઠીક કરો, પાણી-કાર્યક્ષમ ઉપકરણોનો ઉપયોગ કરો, અને જ્યાં શક્ય હોય ત્યાં પાણીનો પુનઃઉપયોગ કરો.",
          },
          rechargePits: {
            title: "💧 પુનઃભરણ ખાડાઓ",
            description: "વરસાદી પાણીને જમીનમાં રસાવવામાં મદદ કરવા માટે કાંકરી અને રેતીથી ભરેલા ખાડાઓ બનાવો.",
          },
        },
        successStory: {
          title: "🌟 સફળતાની કહાણી: રાજસ્થાનનું જળ પુનરુદ્ધાર",
          para1: "રાજસ્થાનના કેટલાક ગામોમાં, જોહડ (નાના માટીના બંધ) અને ટાંકા (ભૂગર્ભજળ ટાંકી) જેવી પારંપરિક જળ સંગ્રહ પદ્ધતિઓને પુનરુદ્ધાર કરવામાં આવી છે.",
          para2: "આ બંધારણો માનસૂન દરમિયાન વરસાદી પાણીને પકડે છે, તેને અંતર્સ્યંદન અને ભૂજળ પુનઃભરણની મંજૂરી આપે છે. પરિણામે, સૂકાયેલા કૂવાઓને પુનરુદ્ધાર કરવામાં આવ્યા છે, અને જળ સ્તરમાં નોંધપાત્ર વધારો થયો છે!",
        },
      },
      takeaways: {
        title: "🎯 મુખ્ય મુદ્દાઓ",
        items: [
          "જળ ચક્ર જીવન માટે આવશ્યક છે અને હવામાન, વાતાવરણ અને જળ ઉપલબ્ધતાને પ્રભાવિત કરે છે",
          "વિવિધ સામગ્રીની અલગ અલગ અંતર્સ્યંદન દર હોય છે - કાંકરી > રેતી > માટી",
          "ભૂજળ અમર્યાદિત નથી અને સંરક્ષણ અને પુનઃભરણની જરૂર છે",
          "જળ ચક્રને સમજવું આપણને પાણીની ખોટ જેવી વાસ્તવિક વિશ્વની સમસ્યાઓને હલ કરવામાં મદદ કરે છે",
          "વરસાદી પાણી સંગ્રહ જેવા સરળ કાર્યોથી મોટો ફેરફાર આવી શકે છે",
        ],
      },
    },
  },
};

// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem("waterCycleLang", lang);
      }
    } catch (error) {
      // Silently handle localStorage errors (e.g., in private browsing mode)
      console.warn('localStorage write error:', error);
    }
  };

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem("waterCycleLang") as Language;
        if (saved && ["en", "hi", "gu"].includes(saved)) {
          setLanguageState(saved);
        }
      }
    } catch (error) {
      // Silently handle localStorage errors (e.g., in private browsing mode)
      console.warn('localStorage access error:', error);
    }
  }, []);

  const t = useCallback((key: string) => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// Language Selector
const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: t("language.en"), flag: "🇬🇧" },
    { code: "hi", name: t("language.hi"), flag: "🇮🇳" },
    { code: "gu", name: t("language.gu"), flag: "🇮🇳" },
  ];

  return (
    <div className="relative">
      <select
        aria-label={t("language.selectorLabel")}
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
        <svg
          className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-teal-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// Default steps data (7 steps only)
const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    title: "What is the Water Cycle?",
    description: "",
    type: "intro",
    mode: "learn",
    data: { stage: "overview" },
  },
  {
    id: 2,
    title: "Step 1: Evaporation",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "evaporation", activeElements: ["sun", "water", "vapor"] },
  },
  {
    id: 3,
    title: "Step 2: Transpiration",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "transpiration", activeElements: ["plants", "vapor"] },
  },
  {
    id: 4,
    title: "Step 3: Condensation",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "condensation", activeElements: ["vapor", "clouds"] },
  },
  {
    id: 5,
    title: "Step 4: Precipitation",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "precipitation", activeElements: ["clouds", "rain"] },
  },
  {
    id: 6,
    title: "Step 5: Collection",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "collection", activeElements: ["rain", "water"] },
  },
  {
    id: 7,
    title: "Step 6: The Complete Cycle",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "complete", activeElements: ["all"] },
  },
];

interface WaterCycleLearningProps {
  width?: number;
  height?: number;
  steps?: Step[];
  mode: "learn" | "practice" | "applications";
  setMode?: (mode: "learn" | "practice" | "applications") => void;
}

const WaterCycleLearning: React.FC<WaterCycleLearningProps> = ({
  width = 800,
  height = 600,
  steps: propSteps,
  mode,
  setMode,
}) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Internal mode state if setMode is not provided
  const [internalMode, setInternalMode] = useState<"learn" | "practice" | "applications">("learn");
  const activeMode = mode !== undefined ? mode : internalMode;
  const handleSetMode = setMode || setInternalMode;
  
  // Reset step index when mode changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [activeMode]);

  const steps = useMemo(() => propSteps || DEFAULT_STEPS, [propSteps]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const modeSteps = useMemo(
    () => steps.filter((step) => step.mode === activeMode),
    [steps, activeMode]
  );
  const currentStep = modeSteps[currentStepIndex];

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      newParticles.push({
        id: Date.now() + i,
        x: x,
        y: Math.random() * height,
        initialX: x,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2 - 1,
        size: Math.random() * 5 + 3,
        opacity: Math.random() * 0.6 + 0.4,
        type: 'vapor',
        color: "#00CED1",
        life: 1,
        wobbleSpeed: 0.05 + Math.random() * 0.05,
      });
    }
    setParticles(newParticles);
  }, [width, height]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      if (currentStepIndex < modeSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, modeSteps.length]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationProgress((prev) => (prev + 0.005) % 1);
      setParticles((prevParticles) =>
        prevParticles
          .map((p) => ({
            ...p,
            y: p.y + p.vy,
            x: p.x + Math.sin(p.y * 0.01) * 0.5,
            opacity: p.y < 0 ? 0 : p.opacity,
          }))
          .map((p) =>
            p.y < 0
              ? { ...p, y: height, opacity: Math.random() * 0.6 + 0.4 }
              : p
          )
      );
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [height]);

  // Draw on canvas with enhanced DOM safety checks
  useEffect(() => {
    // Ensure DOM is ready
    if (typeof document === 'undefined') return;
    
    if (!canvasRef.current || !currentStep) return;
    const canvas = canvasRef.current;
    
    // Verify canvas is connected to DOM
    if (!canvas.isConnected) {
      return;
    }
    
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      console.warn('Failed to get 2D context from canvas');
      return;
    }

    // Validate dimensions
    if (width <= 0 || height <= 0) {
      console.warn('Invalid canvas dimensions:', width, height);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const stage = currentStep.data.stage;
    const activeElements = currentStep.data.activeElements || [];

    drawWaterCycle(
      ctx,
      width,
      height,
      stage,
      activeElements,
      animationProgress,
      particles,
      t
    );
  }, [currentStep, animationProgress, particles, width, height, t]);

  // Real World Mode Component
  const RealWorldMode: React.FC = () => {
    const { t } = useLanguage();
    const [currentScenario, setCurrentScenario] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<'scenarios' | 'seepage' | 'conservation'>('scenarios');
    const [waterLevel, setWaterLevel] = useState(100);
    const [selectedMaterial, setSelectedMaterial] = useState<string>('gravel');

    interface Scenario {
      id: number;
      title: string;
      description: string;
      image: string;
      question: string;
      options: {
        id: string;
        text: string;
        isCorrect: boolean;
        explanation: string;
      }[];
    }

    interface SeepageExperiment {
      material: string;
      porosity: number;
      color: string;
      description: string;
    }

    const scenarios: Scenario[] = useMemo(() => [
      {
        id: 1,
        title: t('realWorld.scenarios.coastal.title'),
        description: t('realWorld.scenarios.coastal.description'),
        image: '🏖️',
        question: t('realWorld.scenarios.coastal.question'),
        options: [
          {
            id: 'a',
            text: t('realWorld.scenarios.coastal.options.a'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.coastal.explanations.a')
          },
          {
            id: 'b',
            text: t('realWorld.scenarios.coastal.options.b'),
            isCorrect: true,
            explanation: t('realWorld.scenarios.coastal.explanations.b')
          },
          {
            id: 'c',
            text: t('realWorld.scenarios.coastal.options.c'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.coastal.explanations.c')
          },
          {
            id: 'd',
            text: t('realWorld.scenarios.coastal.options.d'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.coastal.explanations.d')
          }
        ]
      },
      {
        id: 2,
        title: t('realWorld.scenarios.drying.title'),
        description: t('realWorld.scenarios.drying.description'),
        image: '👕',
        question: t('realWorld.scenarios.drying.question'),
        options: [
          {
            id: 'a',
            text: t('realWorld.scenarios.drying.options.a'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.drying.explanations.a')
          },
          {
            id: 'b',
            text: t('realWorld.scenarios.drying.options.b'),
            isCorrect: true,
            explanation: t('realWorld.scenarios.drying.explanations.b')
          },
          {
            id: 'c',
            text: t('realWorld.scenarios.drying.options.c'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.drying.explanations.c')
          },
          {
            id: 'd',
            text: t('realWorld.scenarios.drying.options.d'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.drying.explanations.d')
          }
        ]
      },
      {
        id: 3,
        title: t('realWorld.scenarios.monsoon.title'),
        description: t('realWorld.scenarios.monsoon.description'),
        image: '🌧️',
        question: t('realWorld.scenarios.monsoon.question'),
        options: [
          {
            id: 'a',
            text: t('realWorld.scenarios.monsoon.options.a'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.monsoon.explanations.a')
          },
          {
            id: 'b',
            text: t('realWorld.scenarios.monsoon.options.b'),
            isCorrect: true,
            explanation: t('realWorld.scenarios.monsoon.explanations.b')
          },
          {
            id: 'c',
            text: t('realWorld.scenarios.monsoon.options.c'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.monsoon.explanations.c')
          },
          {
            id: 'd',
            text: t('realWorld.scenarios.monsoon.options.d'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.monsoon.explanations.d')
          }
        ]
      },
      {
        id: 4,
        title: t('realWorld.scenarios.groundwater.title'),
        description: t('realWorld.scenarios.groundwater.description'),
        image: '💧',
        question: t('realWorld.scenarios.groundwater.question'),
        options: [
          {
            id: 'a',
            text: t('realWorld.scenarios.groundwater.options.a'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.groundwater.explanations.a')
          },
          {
            id: 'b',
            text: t('realWorld.scenarios.groundwater.options.b'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.groundwater.explanations.b')
          },
          {
            id: 'c',
            text: t('realWorld.scenarios.groundwater.options.c'),
            isCorrect: true,
            explanation: t('realWorld.scenarios.groundwater.explanations.c')
          },
          {
            id: 'd',
            text: t('realWorld.scenarios.groundwater.options.d'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.groundwater.explanations.d')
          }
        ]
      },
      {
        id: 5,
        title: t('realWorld.scenarios.iceStupa.title'),
        description: t('realWorld.scenarios.iceStupa.description'),
        image: '⛰️',
        question: t('realWorld.scenarios.iceStupa.question'),
        options: [
          {
            id: 'a',
            text: t('realWorld.scenarios.iceStupa.options.a'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.iceStupa.explanations.a')
          },
          {
            id: 'b',
            text: t('realWorld.scenarios.iceStupa.options.b'),
            isCorrect: true,
            explanation: t('realWorld.scenarios.iceStupa.explanations.b')
          },
          {
            id: 'c',
            text: t('realWorld.scenarios.iceStupa.options.c'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.iceStupa.explanations.c')
          },
          {
            id: 'd',
            text: t('realWorld.scenarios.iceStupa.options.d'),
            isCorrect: false,
            explanation: t('realWorld.scenarios.iceStupa.explanations.d')
          }
        ]
      }
    ], [t]);

    const seepageExperiments: SeepageExperiment[] = useMemo(() => [
      {
        material: 'clay',
        porosity: 15,
        color: '#8B4513',
        description: t('realWorld.seepage.materials.clay.description')
      },
      {
        material: 'sand',
        porosity: 45,
        color: '#DEB887',
        description: t('realWorld.seepage.materials.sand.description')
      },
      {
        material: 'gravel',
        porosity: 85,
        color: '#A9A9A9',
        description: t('realWorld.seepage.materials.gravel.description')
      }
    ], [t]);

    const handleOptionSelect = (optionId: string) => {
      setSelectedOption(optionId);
      setShowExplanation(true);
      
      const selectedOptionData = scenarios[currentScenario].options.find(opt => opt.id === optionId);
      if (selectedOptionData?.isCorrect && !completedScenarios.includes(currentScenario)) {
        setScore(score + 20);
        setCompletedScenarios([...completedScenarios, currentScenario]);
      }
    };

    const nextScenario = () => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      }
    };

    const prevScenario = () => {
      if (currentScenario > 0) {
        setCurrentScenario(currentScenario - 1);
        setSelectedOption(null);
        setShowExplanation(false);
      }
    };

    const simulateWaterUsage = () => {
      if (waterLevel > 0) {
        setWaterLevel(waterLevel - 10);
      }
    };

    const simulateRainfall = () => {
      if (waterLevel < 100) {
        setWaterLevel(Math.min(100, waterLevel + 20));
      }
    };

    const renderSeepageSimulation = () => {
      const experiment = seepageExperiments.find(exp => exp.material === selectedMaterial);
      if (!experiment) return null;

      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-blue-800">{t('realWorld.seepage.title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {seepageExperiments.map(exp => (
              <button
                key={exp.material}
                onClick={() => setSelectedMaterial(exp.material)}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedMaterial === exp.material
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="text-xl font-bold capitalize mb-2">{t(`realWorld.seepage.materials.${exp.material}.name`)}</div>
                <div className="text-sm text-gray-600">{t(`realWorld.seepage.materials.${exp.material}.porosity`)}</div>
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="relative h-96 border-4 border-gray-400 rounded-lg overflow-hidden"
              style={{ backgroundColor: '#87CEEB' }}>
              
              {/* Water bottle pouring */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="text-6xl">💧</div>
                <div className="text-sm text-center font-bold">{t('realWorld.seepage.waterAmount')}</div>
              </div>

              {/* Material layer */}
              <div className="absolute bottom-0 w-full h-2/3 flex items-end justify-center"
                style={{ backgroundColor: experiment.color }}>
                <div className="text-center pb-4 text-white font-bold text-lg">
                  {experiment.material.toUpperCase()}
                </div>
              </div>

              {/* Water seepage visualization */}
              <div className="absolute bottom-0 w-full transition-all duration-1000"
                style={{ 
                  height: `${experiment.porosity}%`,
                  backgroundColor: 'rgba(30, 144, 255, 0.4)'
                }}>
              </div>

              {/* Collection beaker */}
              <div className="absolute bottom-4 right-4 text-center">
                <div className="text-4xl">🥤</div>
                <div className="text-xs font-bold">{t('realWorld.seepage.collected')}: {experiment.porosity}%</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-800">{experiment.description}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-3 rounded">
                <div className="font-bold text-green-800">{t('realWorld.seepage.rate.title')}</div>
                <div className="text-2xl font-bold">
                  {experiment.porosity < 30 ? t('realWorld.seepage.rate.slow') : experiment.porosity < 60 ? t('realWorld.seepage.rate.medium') : t('realWorld.seepage.rate.fast')}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-bold text-blue-800">{t('realWorld.seepage.time.title')}</div>
                <div className="text-2xl font-bold">
                  {experiment.porosity < 30 ? t('realWorld.seepage.time.slow') : experiment.porosity < 60 ? t('realWorld.seepage.time.medium') : t('realWorld.seepage.time.fast')}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-bold text-purple-800">{t('realWorld.seepage.bestFor.title')}</div>
                <div className="text-lg font-bold">
                  {experiment.porosity < 30 ? t('realWorld.seepage.bestFor.storage') : experiment.porosity < 60 ? t('realWorld.seepage.bestFor.farming') : t('realWorld.seepage.bestFor.drainage')}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderConservation = () => (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-green-800">{t('realWorld.conservation.title')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Groundwater Level Indicator */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-lg mb-4">{t('realWorld.conservation.aquiferLevel')}</h4>
            <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-900 rounded-lg overflow-hidden border-4 border-gray-400">
              <div 
                className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500"
                style={{ height: `${waterLevel}%` }}
              >
                <div className="text-white font-bold text-center mt-4">
                  {waterLevel}%
                </div>
              </div>
              
              {/* Water level markers */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 px-2">
                <div className="text-xs font-bold text-gray-700">{t('realWorld.conservation.markers.full')}</div>
                <div className="text-xs font-bold text-gray-700">{t('realWorld.conservation.markers.good')}</div>
                <div className="text-xs font-bold text-orange-600">{t('realWorld.conservation.markers.warning')}</div>
                <div className="text-xs font-bold text-red-600">{t('realWorld.conservation.markers.critical')}</div>
                <div className="text-xs font-bold text-red-800">{t('realWorld.conservation.markers.depleted')}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={simulateWaterUsage}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                {t('realWorld.conservation.useWater')}
              </button>
              <button
                onClick={simulateRainfall}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {t('realWorld.conservation.rainfall')}
              </button>
            </div>

            {waterLevel < 30 && (
              <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-3 rounded">
                <p className="text-red-800 font-bold">{t('realWorld.conservation.criticalWarning')}</p>
                <p className="text-sm text-red-700">{t('realWorld.conservation.criticalMessage')}</p>
              </div>
            )}
          </div>

          {/* Conservation Methods */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-lg mb-4">{t('realWorld.conservation.solutions.title')}</h4>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded">
                <h5 className="font-bold text-green-800">{t('realWorld.conservation.solutions.rainwater.title')}</h5>
                <p className="text-sm text-gray-700">
                  {t('realWorld.conservation.solutions.rainwater.description')}
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded">
                <h5 className="font-bold text-blue-800">{t('realWorld.conservation.solutions.greenCover.title')}</h5>
                <p className="text-sm text-gray-700">
                  {t('realWorld.conservation.solutions.greenCover.description')}
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 rounded">
                <h5 className="font-bold text-purple-800">{t('realWorld.conservation.solutions.reduceWastage.title')}</h5>
                <p className="text-sm text-gray-700">
                  {t('realWorld.conservation.solutions.reduceWastage.description')}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded">
                <h5 className="font-bold text-orange-800">{t('realWorld.conservation.solutions.rechargePits.title')}</h5>
                <p className="text-sm text-gray-700">
                  {t('realWorld.conservation.solutions.rechargePits.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-world example */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-lg text-white">
          <h4 className="font-bold text-xl mb-3">{t('realWorld.conservation.successStory.title')}</h4>
          <p className="mb-2">
            {t('realWorld.conservation.successStory.para1')}
          </p>
          <p>
            {t('realWorld.conservation.successStory.para2')}
          </p>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2">
              {t('realWorld.title')}
            </h1>
            <p className="text-gray-700 text-base sm:text-lg">
              {t('realWorld.subtitle')}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {t('realWorld.score')}: {score} / {scenarios.length * 20}
              </div>
              <div className="text-base sm:text-lg text-gray-600">
                {t('realWorld.completed')}: {completedScenarios.length} / {scenarios.length}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition text-sm sm:text-base ${
                activeTab === 'scenarios'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              {t('realWorld.tabs.scenarios')}
            </button>
            <button
              onClick={() => setActiveTab('seepage')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition text-sm sm:text-base ${
                activeTab === 'seepage'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-600 hover:bg-green-50'
              }`}
            >
              {t('realWorld.tabs.seepage')}
            </button>
            <button
              onClick={() => setActiveTab('conservation')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition text-sm sm:text-base ${
                activeTab === 'conservation'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
              }`}
            >
              {t('realWorld.tabs.conservation')}
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            {activeTab === 'scenarios' && (
              <>
                {/* Scenario */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {t('realWorld.scenario')} {currentScenario + 1} {t('realWorld.of')} {scenarios.length}
                    </h2>
                    <div className="text-4xl sm:text-6xl" style={{ lineHeight: '1', fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>{scenarios[currentScenario].image}</div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-3">
                    {scenarios[currentScenario].title}
                  </h3>
                  
                  <p className="text-base sm:text-lg text-gray-700 mb-4">
                    {scenarios[currentScenario].description}
                  </p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                    <p className="text-gray-800 font-semibold text-sm sm:text-base">
                      {scenarios[currentScenario].question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {scenarios[currentScenario].options.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={showExplanation}
                        className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition text-sm sm:text-base ${
                          selectedOption === option.id
                            ? option.isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-bold text-base sm:text-lg">{option.id.toUpperCase()})</span>
                          <span className="text-gray-800">{option.text}</span>
                          {showExplanation && selectedOption === option.id && (
                            <span className="ml-auto text-xl sm:text-2xl">
                              {option.isCorrect ? '✅' : '❌'}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Explanation */}
                  {showExplanation && selectedOption && (
                    <div className={`p-4 sm:p-6 rounded-lg mb-6 ${
                      scenarios[currentScenario].options.find(opt => opt.id === selectedOption)?.isCorrect
                        ? 'bg-green-50 border-l-4 border-green-500'
                        : 'bg-red-50 border-l-4 border-red-500'
                    }`}>
                      <h4 className="font-bold text-base sm:text-lg mb-2">
                        {scenarios[currentScenario].options.find(opt => opt.id === selectedOption)?.isCorrect
                          ? t('realWorld.correct')
                          : t('realWorld.incorrect')}
                      </h4>
                      <p className="text-gray-800 text-sm sm:text-base">
                        {scenarios[currentScenario].options.find(opt => opt.id === selectedOption)?.explanation}
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      onClick={prevScenario}
                      disabled={currentScenario === 0}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                        disabled:bg-gray-300 disabled:cursor-not-allowed transition w-full sm:w-auto"
                    >
                      {t('realWorld.previous')}
                    </button>
                    
                    <div className="flex gap-2">
                      {scenarios.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index === currentScenario
                              ? 'bg-blue-600'
                              : completedScenarios.includes(index)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextScenario}
                      disabled={currentScenario === scenarios.length - 1}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                        disabled:bg-gray-300 disabled:cursor-not-allowed transition w-full sm:w-auto"
                    >
                      {t('realWorld.next')}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'seepage' && renderSeepageSimulation()}
            {activeTab === 'conservation' && renderConservation()}
          </div>

          {/* Key Takeaways */}
          <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 rounded-lg text-white">
            <h3 className="font-bold text-xl sm:text-2xl mb-4">{t('realWorld.takeaways.title')}</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              {t('realWorld.takeaways.items').map((item: string, index: number) => (
                <li key={index}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Practice Mode Component
  const PracticeMode: React.FC = () => {
    const { t } = useLanguage();
    const [selectedStage, setSelectedStage] = useState<string | null>(null);
    const [userConnections, setUserConnections] = useState<{ from: string; to: string; label: string }[]>([]);
    const [startConnection, setStartConnection] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    interface Stage {
      id: string;
      name: string;
      description: string;
      x: number;
      y: number;
      color: string;
    }

    interface Connection {
      from: string;
      to: string;
      label: string;
    }

    const stages: Stage[] = [
      {
        id: 'sun',
        name: t('practice.stages.sun'),
        description: t('practice.stageDescriptions.sun'),
        x: 50,
        y: 10,
        color: '#FFA500'
      },
      {
        id: 'ocean',
        name: t('practice.stages.ocean'),
        description: t('practice.stageDescriptions.ocean'),
        x: 10,
        y: 70,
        color: '#1E90FF'
      },
      {
        id: 'evaporation',
        name: t('practice.stages.evaporation'),
        description: t('practice.stageDescriptions.evaporation'),
        x: 30,
        y: 50,
        color: '#87CEEB'
      },
      {
        id: 'transpiration',
        name: t('practice.stages.transpiration'),
        description: t('practice.stageDescriptions.transpiration'),
        x: 70,
        y: 60,
        color: '#90EE90'
      },
      {
        id: 'condensation',
        name: t('practice.stages.condensation'),
        description: t('practice.stageDescriptions.condensation'),
        x: 50,
        y: 30,
        color: '#B0C4DE'
      },
      {
        id: 'precipitation',
        name: t('practice.stages.precipitation'),
        description: t('practice.stageDescriptions.precipitation'),
        x: 70,
        y: 40,
        color: '#4682B4'
      },
      {
        id: 'infiltration',
        name: t('practice.stages.infiltration'),
        description: t('practice.stageDescriptions.infiltration'),
        x: 85,
        y: 75,
        color: '#8B4513'
      },
      {
        id: 'groundwater',
        name: t('practice.stages.groundwater'),
        description: t('practice.stageDescriptions.groundwater'),
        x: 90,
        y: 85,
        color: '#4169E1'
      }
    ];

    const correctConnections: Connection[] = [
      { from: 'sun', to: 'evaporation', label: 'Provides heat' },
      { from: 'ocean', to: 'evaporation', label: 'Water source' },
      { from: 'evaporation', to: 'condensation', label: 'Water vapour rises' },
      { from: 'transpiration', to: 'condensation', label: 'Water vapour rises' },
      { from: 'condensation', to: 'precipitation', label: 'Forms clouds' },
      { from: 'precipitation', to: 'ocean', label: 'Returns to water bodies' },
      { from: 'precipitation', to: 'infiltration', label: 'Seeps into ground' },
      { from: 'infiltration', to: 'groundwater', label: 'Stores underground' }
    ];

    const handleStageClick = (stageId: string) => {
      setSelectedStage(stageId);
      
      if (startConnection === null) {
        setStartConnection(stageId);
      } else if (startConnection !== stageId) {
        const newConnection: Connection = {
          from: startConnection,
          to: stageId,
          label: 'User connection'
        };
        
        const isCorrect = correctConnections.some(
          conn => conn.from === newConnection.from && conn.to === newConnection.to
        );
        
        if (isCorrect) {
          const connectionExists = userConnections.some(
            conn => conn.from === newConnection.from && conn.to === newConnection.to
          );
          if (!connectionExists) {
            setUserConnections([...userConnections, newConnection]);
            setScore(score + 10);
            setFeedbackMessage(t('practice.correct'));
          } else {
            setFeedbackMessage(t('practice.alreadyConnected'));
          }
        } else {
          setFeedbackMessage(t('practice.incorrect'));
        }
        
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 2000);
        setStartConnection(null);
      }
    };

    const resetActivity = () => {
      setUserConnections([]);
      setStartConnection(null);
      setSelectedStage(null);
      setScore(0);
      setShowFeedback(false);
    };

    const showAnswers = () => {
      setUserConnections(correctConnections);
      setScore(correctConnections.length * 10);
    };

    const getContainerWidth = () => {
      if (typeof window !== 'undefined') {
        return Math.min(window.innerWidth * 0.9, 1200);
      }
      return 1200;
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200 p-4 sm:p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2">
              {t('practice.title')}
            </h1>
            <p className="text-gray-700 text-base sm:text-lg">
              {t('practice.subtitle')}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {t('practice.score')}: {score}
              </div>
              <button
                onClick={resetActivity}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                {t('practice.reset')}
              </button>
              <button
                onClick={showAnswers}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {t('practice.showAnswers')}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <p className="text-gray-800 text-sm sm:text-base">
              <strong>{t('practice.instructions').split(':')[0]}:</strong> {t('practice.instructions').split(':').slice(1).join(':').trim()}
            </p>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              ${feedbackMessage.includes('✓') ? 'bg-green-500' : 'bg-red-500'} 
              text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-lg sm:text-xl font-bold shadow-2xl z-50 animate-bounce`}>
              {feedbackMessage}
            </div>
          )}

          {/* Main Interactive Area */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative" style={{ minHeight: '500px' }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {/* Draw user connections */}
              {userConnections.map((conn, index) => {
                const fromStage = stages.find(s => s.id === conn.from);
                const toStage = stages.find(s => s.id === conn.to);
                if (!fromStage || !toStage) return null;

                const containerWidth = getContainerWidth();
                const x1 = (fromStage.x / 100) * containerWidth * 0.85;
                const y1 = (fromStage.y / 100) * 450;
                const x2 = (toStage.x / 100) * containerWidth * 0.85;
                const y2 = (toStage.y / 100) * 450;

                return (
                  <g key={index}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#4169E1"
                      strokeWidth="3"
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              })}
              
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#4169E1" />
                </marker>
              </defs>
            </svg>

            {/* Stages */}
            {stages.map(stage => (
              <div
                key={stage.id}
                onClick={() => handleStageClick(stage.id)}
                className={`absolute cursor-pointer transition-all duration-200 transform hover:scale-110 
                  ${selectedStage === stage.id ? 'ring-4 ring-yellow-400' : ''}
                  ${startConnection === stage.id ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
                style={{
                  left: `${stage.x}%`,
                  top: `${stage.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                <div
                  className="rounded-full p-4 sm:p-6 shadow-lg border-4 border-white"
                  style={{ backgroundColor: stage.color }}
                >
                  <div className="text-center">
                    <div className="font-bold text-white text-xs sm:text-sm mb-1">{stage.name}</div>
                  </div>
                </div>
                {selectedStage === stage.id && (
                  <div className="absolute top-full mt-2 bg-gray-800 text-white p-2 sm:p-3 rounded shadow-lg 
                    text-xs sm:text-sm w-40 sm:w-48 left-1/2 transform -translate-x-1/2 z-20">
                    {stage.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Concepts */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-base sm:text-lg text-blue-800 mb-2">{t('practice.concepts.evaporation.title')}</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {t('practice.concepts.evaporation.description')}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-base sm:text-lg text-green-800 mb-2">{t('practice.concepts.transpiration.title')}</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {t('practice.concepts.transpiration.description')}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-base sm:text-lg text-purple-800 mb-2">{t('practice.concepts.condensation.title')}</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {t('practice.concepts.condensation.description')}
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-bold text-base sm:text-lg text-indigo-800 mb-2">{t('practice.concepts.precipitation.title')}</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {t('practice.concepts.precipitation.description')}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="font-bold text-base sm:text-lg mb-3">{t('practice.progress')}</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(userConnections.length / correctConnections.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              {userConnections.length} {t('controls.of')} {correctConnections.length} {t('practice.connectionsMade')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render navbar (common for all modes)
  const renderNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Droplets size={24} className="text-teal-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              {t("nav.logo")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-white/80 rounded-lg p-1 backdrop-blur-sm border border-teal-200/50">
              <button
                onClick={() => handleSetMode("learn")}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeMode === "learn"
                    ? "bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("nav.tabs.learn")}
              </button>
              <button
                onClick={() => handleSetMode("practice")}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeMode === "practice"
                    ? "bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("nav.tabs.practice")}
              </button>
              <button
                onClick={() => handleSetMode("applications")}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeMode === "applications"
                    ? "bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("nav.tabs.applications")}
              </button>
            </div>
            <div className="ml-2">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Render Practice mode
  if (activeMode === "practice") {
    return (
      <>
        {renderNavbar()}
        <PracticeMode />
      </>
    );
  }

  // Render Applications mode (Real World)
  if (activeMode === "applications") {
    return (
      <>
        {renderNavbar()}
        <RealWorldMode />
      </>
    );
  }

  // Learn Mode Component
  const LearnMode: React.FC = () => {

    return (
      <div className="flex flex-col items-center p-8 bg-blue-50 min-h-screen font-sans pt-24">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">The Water Cycle</h1>
        <p className="text-gray-600 mb-8 max-w-2xl text-center">
          The continuous movement of water upward as vapour and downward as precipitation 
          is called the <strong>Water Cycle</strong>.
        </p>

        <div className="relative w-full max-w-4xl h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-blue-200">
          
          {/* The Sun - Source of Heat  */}
          <motion.div 
            className="absolute top-4 right-4 w-24 h-24 bg-yellow-400 rounded-full shadow-[0_0_50px_rgba(250,204,21,0.8)]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Ocean/Water Bodies [cite: 147, 152] */}
          <div className="absolute bottom-0 w-full h-32 bg-blue-500">
            <div className="absolute top-0 w-full h-4 bg-blue-400 opacity-50 animate-pulse" />
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-bold">Oceans & Lakes</p>
          </div>

          {/* Land and Trees (Transpiration)  */}
          <div className="absolute bottom-32 left-0 w-1/3 h-24 bg-green-600 rounded-tr-full">
            <div className="absolute bottom-4 left-10 w-8 h-12 bg-green-800 rounded-t-lg">
               <span className="text-xs text-white absolute -top-6">Trees</span>
            </div>
          </div>

          {/* 1. Evaporation & Transpiration  */}
          <div className="absolute bottom-32 left-1/2 flex space-x-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={`vapour-${i}`}
                className="w-2 h-2 bg-blue-200 rounded-full"
                animate={{
                  y: [0, -200],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5
                }}
              />
            ))}
            <div className="absolute -top-10 -left-10 text-blue-600 font-semibold text-sm bg-white/80 px-2 rounded">
              Evaporation & Transpiration
            </div>
          </div>

          {/* 2. Condensation (Clouds)  */}
          <motion.div 
            className="absolute top-20 left-1/4 w-40 h-16 bg-gray-100 rounded-full shadow-lg"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <div className="absolute -top-5 left-10 text-gray-600 font-semibold text-sm">Clouds (Condensation)</div>
            
            {/* 3. Precipitation (Rain) [cite: 154] */}
            <div className="flex justify-around mt-12">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={`rain-${i}`}
                  className="w-1 h-4 bg-blue-400 rounded-full"
                  animate={{
                    y: [-20, 250],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Ground Infiltration  */}
          <div className="absolute bottom-32 left-1/4 w-4 h-32 bg-blue-300 opacity-40">
             <p className="text-[10px] rotate-90 mt-10 font-bold text-blue-900">Infiltration</p>
          </div>
        </div>

        {/* Educational Labels based on Textbook Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
          <div className="p-4 bg-white rounded-lg shadow border-l-4 border-yellow-400">
            <h3 className="font-bold text-yellow-700">1. Evaporation</h3>
            <p className="text-sm text-gray-600">The Sun heats water in oceans and lakes, turning it into water vapour[cite: 152].</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow border-l-4 border-gray-400">
            <h3 className="font-bold text-gray-700">2. Condensation</h3>
            <p className="text-sm text-gray-600">As vapour rises, it cools and condenses to form clouds.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow border-l-4 border-blue-400">
            <h3 className="font-bold text-blue-700">3. Precipitation</h3>
            <p className="text-sm text-gray-600">Water returns to Earth as rain, snow, or hail[cite: 154].</p>
          </div>
        </div>
      </div>
    );
  };

  // Render Learn mode
  return (
    <>
      {renderNavbar()}
      <LearnMode />
    </>
  );
};

// Drawing function with FIXED animations
function drawWaterCycle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stage: LearnStage,
  activeElements: LearnActiveElement[],
  progress: number,
  _particles: Particle[],
  t: (key: string) => string
) {
  const waterY = height * 0.7;
  const groundY = height * 0.6;

  // Sky
  const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGradient.addColorStop(0, "#87CEEB");
  skyGradient.addColorStop(0.5, "#B0E0E6");
  skyGradient.addColorStop(1, "#E0F6FF");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, groundY);

  // Ground - GREEN SURFACE (FIXED - NO WAVES)
  ctx.fillStyle = "#90EE90";
  ctx.fillRect(0, groundY, width, waterY - groundY);

  // Underground
  const undergroundGradient = ctx.createLinearGradient(0, waterY, 0, height);
  undergroundGradient.addColorStop(0, "#8FBC8F");
  undergroundGradient.addColorStop(0.4, "#8B7355");
  undergroundGradient.addColorStop(1, "#4A3520");
  ctx.fillStyle = undergroundGradient;
  ctx.fillRect(0, waterY, width, height - waterY);

  // Sun
  if (activeElements.includes("sun") || activeElements.includes("all")) {
    const sunPulse = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
    ctx.fillStyle = "#FFD700";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#FFA500";
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.15, 40 * sunPulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Sun rays
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + progress * Math.PI * 2;
      const rayLength = 50 + Math.sin(progress * Math.PI * 4 + i) * 10;
      const x1 = width * 0.15 + Math.cos(angle) * (50 * sunPulse);
      const y1 = height * 0.15 + Math.sin(angle) * (50 * sunPulse);
      const x2 = width * 0.15 + Math.cos(angle) * rayLength;
      const y2 = height * 0.15 + Math.sin(angle) * rayLength;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // Water body
  ctx.fillStyle = "#4682B4";
  ctx.fillRect(width * 0.05, waterY, width * 0.3, height - waterY);

  // Mountain - FIXED TO BROWN COLOR ONLY
  ctx.fillStyle = "#8B7355";
  ctx.beginPath();
  ctx.moveTo(width * 0.7, groundY);
  ctx.lineTo(width * 0.8, height * 0.3);
  ctx.lineTo(width * 0.9, groundY);
  ctx.closePath();
  ctx.fill();

  // Tree - FIXED (positioned on green ground, NO sway)
  const treeX = width * 0.55;
  const treeY = groundY;

  // Tree trunk (NO sway animation)
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(treeX - 7.5, treeY, 15, 60);

  // Tree leaves
  ctx.fillStyle = "#228B22";
  ctx.beginPath();
  ctx.arc(treeX, treeY - 10, 30, 0, Math.PI * 2);
  ctx.fill();

  // STEP 2: Evaporation - Water droplets rising from water body
  if (stage === "evaporation") {
    for (let i = 0; i < 10; i++) {
      const x =
        width * 0.1 + i * 20 + Math.sin(progress * Math.PI * 2 + i) * 10;
      const riseHeight = (progress * 200 + i * 20) % 200;
      const y = waterY - riseHeight;
      const opacity = Math.max(0, 1 - riseHeight / 200);

      if (y > height * 0.3) {
        ctx.fillStyle = `rgba(30, 144, 255, ${opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // STEP 3: Transpiration - Water droplets rising from tree ONLY
  if (stage === "transpiration") {
    for (let i = 0; i < 6; i++) {
      const x = treeX + Math.sin(progress * Math.PI * 2 + i) * 15;
      const riseHeight = (progress * 180 + i * 30) % 180;
      const y = treeY - 40 - riseHeight;
      const opacity = Math.max(0, 1 - riseHeight / 180);

      if (y > height * 0.3) {
        ctx.fillStyle = `rgba(34, 139, 34, ${opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // STEP 4: Condensation - NO droplets, only clouds forming
  if (stage === "condensation") {
    const cloudFloat = Math.sin(progress * Math.PI * 2) * 5;
    drawCloud(ctx, width * 0.4 + cloudFloat, height * 0.25, 80);
    drawCloud(ctx, width * 0.6 - cloudFloat, height * 0.2, 100);
  }

  // STEP 5: Precipitation - ONLY rain falling from clouds, NO background droplets
  if (stage === "precipitation") {
    // Clouds
    const cloudFloat = Math.sin(progress * Math.PI * 2) * 5;
    drawCloud(ctx, width * 0.4 + cloudFloat, height * 0.25, 80);
    drawCloud(ctx, width * 0.6 - cloudFloat, height * 0.2, 100);

    // Rain falling from clouds
    ctx.strokeStyle = "#4682B4";
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      const x =
        width * 0.35 + i * 25 + Math.sin(progress * Math.PI * 2 + i) * 5;
      const fallProgress = (progress * 300 + i * 15) % 300;
      const y1 = height * 0.3 + fallProgress;
      const y2 = y1 + 20;

      if (y1 < groundY) {
        ctx.globalAlpha = Math.max(0, 1 - fallProgress / 300);
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  // STEP 6: Collection - NO falling rain, NO rising droplets, just static water
  if (stage === "collection") {
    // Just show the collected water (already drawn)
  }

  // STEP 7: Complete cycle - Small animation showing entire process
  if (stage === "complete") {
    // Clouds
    const cloudFloat = Math.sin(progress * Math.PI * 2) * 3;
    drawCloud(ctx, width * 0.4 + cloudFloat, height * 0.25, 70);
    drawCloud(ctx, width * 0.6 - cloudFloat, height * 0.2, 85);

    // Small evaporation (3 droplets)
    for (let i = 0; i < 3; i++) {
      const x = width * 0.15 + i * 25;
      const riseHeight = (progress * 150 + i * 50) % 150;
      const y = waterY - riseHeight;
      const opacity = Math.max(0, 1 - riseHeight / 150);

      if (y > height * 0.35 && y < waterY) {
        ctx.fillStyle = `rgba(30, 144, 255, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Small rain (5 drops)
    ctx.strokeStyle = "#4682B4";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x = width * 0.45 + i * 30;
      const fallProgress = (progress * 200 + i * 40) % 200;
      const y1 = height * 0.35 + fallProgress;
      const y2 = y1 + 15;

      if (y1 < groundY) {
        ctx.globalAlpha = Math.max(0, 1 - fallProgress / 200);
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  // Labels
  ctx.fillStyle = "#000000";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 4;

  if (stage === "evaporation") {
    ctx.fillText(t("canvas.evaporation"), width * 0.2, waterY - 120);
  }
  if (stage === "transpiration") {
    ctx.fillText(t("canvas.transpiration"), treeX, treeY - 80);
  }
  if (stage === "condensation" || stage === "complete") {
    ctx.fillText(t("canvas.condensation"), width * 0.5, height * 0.15);
  }
  if (stage === "precipitation" || stage === "complete") {
    ctx.fillText(t("canvas.precipitation"), width * 0.5, height * 0.42);
  }
  if (stage === "collection") {
    ctx.fillText(t("canvas.collection"), width * 0.2, waterY + 30);
  }

  ctx.shadowBlur = 0;
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.2, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.2, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
}

// ============================================================================
// Helper Functions (merged from heatTransferTranslations.ts)
// ============================================================================

/**
 * Get the complete language content for a given language
 */
export const getWaterCycleContent = (lang: Language): WaterCycleContent => {
  return translations[lang];
};

/**
 * Get navigation translations for a given language
 */
export const getWaterCycleNav = (lang: Language): WaterCycleNav => {
  return translations[lang].nav;
};

/**
 * Get controls translations for a given language
 */
export const getWaterCycleControls = (lang: Language): WaterCycleControls => {
  return translations[lang].controls;
};

/**
 * Get steps translations for a given language
 */
export const getWaterCycleSteps = (lang: Language): WaterCycleSteps => {
  return translations[lang].steps;
};

/**
 * Get canvas labels for a given language
 */
export const getWaterCycleCanvas = (lang: Language): WaterCycleCanvas => {
  return translations[lang].canvas;
};

/**
 * Get learn section translations for a given language
 */
export const getWaterCycleLearn = (lang: Language): WaterCycleLearn => {
  return translations[lang].learn;
};

/**
 * Get practice section translations for a given language
 */
export const getWaterCyclePractice = (lang: Language): WaterCyclePractice => {
  return translations[lang].practice;
};

/**
 * Get real world section translations for a given language
 */
export const getWaterCycleRealWorld = (lang: Language): WaterCycleRealWorld => {
  return translations[lang].realWorld;
};

export default WaterCycleLearning;
