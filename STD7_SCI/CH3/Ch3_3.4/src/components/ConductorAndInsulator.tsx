/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle, XCircle, RotateCcw,
  ChevronRight, ChevronLeft, Trophy, Star, BookOpen,
  Target, Brain, Lightbulb, Info
} from 'lucide-react';
import i18n from 'i18next';  // Import from i18next directly to avoid circular dependency


export type TranslationLang = 'en' | 'hi' | 'gu';

export interface Translations {
  [key: string]: any;
}

export interface AllTranslations {
  en: Translations;
  hi: Translations;
  gu: Translations;
}

// ============================================================================
// TRANSLATIONS DATA (inlined from src/locales/a.tsx)
// ============================================================================

export const translations: AllTranslations = {
  en: {
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "Choose language",
    },
    nav: {
      logo: "Conductors & Insulators",
      learn: "Learn",
      practice: "Practice",
      applications: "Real World",
    },
    common: {
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      reset: "Reset",
      gotIt: "Got it!",
      correct: "Correct",
      incorrect: "Incorrect",
      examples: "Examples",
      yourAnswer: "Your Answer:",
      answerPlaceholder: "Type your answer here...",
      ariaBack: "Go back",
      ariaNext: "Go forward",
    },
    component: {
      on: "ON",
      off: "OFF",
    },
    torch: {
      intro: {
        title: "Topic 3.1: A Torchlight",
        subtitle: "Let's explore how a torchlight works! 🔦",
        learnHeading: "What We'll Learn:",
        start: "Let's Start Exploring!",
      },
      learn: {
        obsTitle: "Observation Skills",
        obsDesc: "Identify parts of a torchlight",
        partsTitle: "Understanding Parts",
        partsDesc: "Learn about cells, battery, lamp, switch",
        glowTitle: "How It Glows",
        glowDesc: "Discover why lamp lights up",
        demoTitle: "Interactive Demo",
        demoDesc: "Try animations and activities",
      },
      safety: {
        title: "Safety First!",
        line1: "Use only small batteries from torches or remotes.",
        warning: "Never experiment with wall socket electricity!",
      },
      observe: {
        title: "Activity 3.1: Observe a Torchlight",
        clickTorch: "Click the Torch!",
        lampGlowing: "✨ The lamp is GLOWING!",
        lampNotGlowing: "⭕ The lamp is NOT glowing",
        whatNotice: "🔦 What is a Torchlight?",
        definition:
          "A torchlight is a portable light source that uses electric cells (battery), a switch, wires, and a lamp or LED. When the switch is ON, the cells push electric current through the wires to the lamp/LED, making it glow so you can see in the dark.",
        nextQuestion: "🧐 Next Question:",
        questionText: "If we open the torchlight, what will we find inside?",
        exploreNext: "Let's explore the different parts! →",
        back: "Back",
        nextParts: "Next: Torch Parts",
      },
      parts: {
        title: "🔍 What's Inside a Torchlight?",
        lamp: "1. Lamp",
        switch: "2. Switch",
        cells: "3. Cells",
        wires: "4. Wires",
        lampCard: "Lamp",
        lampDesc: "Produces light",
        switchCard: "Switch",
        switchDesc: "Controls ON/OFF",
        cellCard: "Cell",
        cellDesc: "Power source",
        wiresCard: "Wires",
        wiresDesc: "Carry electricity",
        clickToLearn: "Click to learn →",
        back: "Back",
        nextCell: "Next: Learn About Cells",
      },
      cell: {
        title: "🔋 Electric Cell",
        content:
          "An electric cell stores chemical energy and pushes electric charge from its positive (+) terminal to its negative (−) terminal when connected in a circuit. The metal cap is the positive terminal and the flat base is the negative terminal. When you connect wires from + to − through a lamp or LED, the cell supplies the energy that makes the lamp glow.",
      },
      battery: {
        title: "🔋🔋 Battery",
        content: "Detailed battery content here...",
      },
      lamp: {
        title: "💡 Electric Lamp",
        content: "Detailed lamp content here...",
      },
      switch: {
        title: "🔘 Switch",
        content: "Detailed switch content here...",
      },
      complete: {
        title: "⚡ Complete Circuit",
        content: "Final overview...",
      },
      quiz: {
        title: "📝 Quiz Time!",
        content: "Test your knowledge...",
      },
      nav: {
        back: "Back",
        continue: "Continue Learning",
      },
    },
    practice: {
      header: {
        title: "⚡ Practice: Torchlight Circuit",
        subtitle: "Apply what you learned!",
      },
      practiceMode: "Practice Mode",
      topicSelection: "Choose a Topic to Practice",
      mixedPractice: "Mixed Practice",
      allTopics: "All Topics Combined",
      questions: "questions",
      submitAnswer: "Submit Answer",
      nextQuestion: "Next Question",
      finishPractice: "Finish Practice",
      yourScore: "Your Score",
      tryAgain: "Try Again",
      backToTopics: "Back to Topics",
      excellentWork: "Excellent Work!",
      goodJob: "Good Job!",
      keepPracticing: "Keep Practicing!",
      explanation: "Explanation:",
      correctAnswer: "Correct Answer:",
      progress: "Progress",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      correct: "Correct",
      incorrect: "Incorrect",
      total: "Total",
      outstandingWork: "Outstanding work! You have mastered this topic!",
      goodWork: "Good work! Keep practicing to improve further.",
      dontGiveUp: "Don't give up! Practice more to improve your understanding.",
      topics: {
        identification: {
          name: "Basic Identification",
          description: "Identify conductors and insulators",
        },
        properties: {
          name: "Properties",
          description: "Understanding material properties",
        },
        wires: {
          name: "Wires & Cables",
          description: "Why wires are made and covered",
        },
        testing: {
          name: "Testing Methods",
          description: "Using conduction tester",
        },
        safety: {
          name: "Safety Rules",
          description: "Electrical safety precautions",
        },
        applications: {
          name: "Real-World Uses",
          description: "Applications in daily life",
        },
      },
      ex6: {
        question: "Question",
        of: "of",
        q1: "What is the purpose of an electric cell in a torchlight?",
        q1o1: "To produce light",
        q1o2: "To provide electrical energy",
        q1o3: "To control the flow of electricity",
        q1o4: "To connect the parts",
        q2: "How many cells make a battery?",
        q2o1: "One",
        q2o2: "Two or more",
        q2o3: "Exactly three",
        q2o4: "None",
        q3: "What happens when we slide the switch to ON position?",
        q3o1: "Circuit breaks",
        q3o2: "Circuit completes and lamp glows",
        q3o3: "Battery drains immediately",
        q3o4: "Nothing happens",
        q4: "What component actually produces light in a torchlight?",
        q4o1: "Cell",
        q4o2: "Battery",
        q4o3: "Electric lamp",
        q4o4: "Switch",
        q5: "What do connecting wires do?",
        q5o1: "Store electricity",
        q5o2: "Produce light",
        q5o3: "Carry electricity between components",
        q5o4: "Turn electricity on and off",
        checkQuiz: "Submit Quiz",
      },
      ex1: {
        notLabeled: "Not answered",
      },
      summary: {
        title: "🎉 Practice Complete!",
        totalScore: "Total Score:",
        exercisesCompleted: "Exercises Completed:",
        excellent: "Excellent work!",
        good: "Good job!",
        keepPracticing: "Keep practicing!",
        restart: "Restart Practice",
        backToLearn: "Back to Learn Mode",
        scoreLine:
          "{correct, number} / {total, number} correct ({percentage, number}%)",
        exerciseCount:
          "{count, plural, one {{count} exercise completed} other {{count} exercises completed}}",
      },
    },
    realworld: {
      title: "Real World Applications",
      tagline: "Discover how electricity powers our daily lives",
      usageCategories: "Electricity Usage Categories",
      keyFacts: "Key Facts About Electricity",
      cooking: "Cooking",
      lighting: "Lighting",
      transportation: "Transportation",
      heating: "Heating & Cooling",
      entertainment: "Entertainment",
      communication: "Communication",
      dc: {
        title: "Direct Current (DC)",
        desc: "Batteries provide DC electricity - current flows in one direction. Used in mobile phones, flashlights, and electric vehicles.",
      },
      ac: {
        title: "Alternating Current (AC)",
        desc: "Wall sockets provide AC electricity - current changes direction. Used in homes for most appliances and lighting.",
      },
      storage: {
        title: "Energy Storage",
        desc: "Batteries store electrical energy chemically, allowing portable devices to work without being plugged in.",
      },
      impact: {
        title: "Global Impact",
        desc: "Renewable sources like solar and hydroelectric power help protect our environment.",
      },
      desc: {
        cooking: "Electricity powers various cooking appliances",
        lighting: "Illuminating our homes and streets",
        transportation: "Electric vehicles and public transport",
        heating: "Climate control in buildings",
        entertainment: "Powering our entertainment devices",
        communication: "Connecting people worldwide",
      },
      example: {
        cooking: {
          stove: "Electric stove",
          microwave: "Microwave oven",
          kettle: "Electric kettle",
          toaster: "Toaster",
        },
        lighting: {
          bulbs: "LED bulbs",
          street: "Street lights",
          flashlight: "Flashlights",
          lamp: "Lamps",
        },
        transportation: {
          cars: "Electric cars",
          trains: "Trains",
          trams: "Trams",
          ebikes: "E-bikes",
        },
        heating: {
          ac: "Air conditioners",
          heater: "Heaters",
          blanket: "Electric blankets",
          fan: "Fans",
        },
        entertainment: {
          tv: "Television",
          computer: "Computers",
          console: "Gaming consoles",
          speakers: "Speakers",
        },
        communication: {
          phones: "Mobile phones",
          router: "Internet routers",
          radio: "Radios",
          satellite: "Satellites",
        },
      },
      safety: {
        "1": "Never experiment with household electricity",
        "2": "Use only batteries/cells for experiments",
        "3": "Never touch switches with wet hands",
        "4": "Don't use damaged electrical equipment",
        "5": "Always ask an adult for help with electrical work",
        title: "Safety First!",
      },
      stats: {
        title: "Localized stats",
        households: "Households with electricity",
        savings: "Avg monthly savings",
        updated: "Updated {date}",
      },
    },
    learn: {
      information: "Information",
      headerTitle: "Conductors & Insulators",
      headerSubtitle:
        "Drag items into the gap to complete the circuit. Does the bulb light up?",
      circuitTestArea: "Circuit Test Area",
      hideCurrent: "Hide Current",
      showCurrent: "Show Current",
      connectionMade: "Connection Made",
      dragObjectHere: "↓ Drag Object Here ↓",
      predYesConduct: "Yes, it will conduct!",
      predNoInsulator: "No, it's an insulator",
      resultCorrect: "That's Correct!",
      notQuite: "❌ Not quite!",
      explainerOnAlt:
        "Because it allows electrons to flow, the loop is closed and the bulb lights up! 💡",
      explainerOffAlt:
        "Because it blocks electron flow, the circuit remains broken and the bulb stays off. 🚫",
      dragMaterialToTest:
        "👆 Drag a material into the circuit gap to test if it conducts electricity!",
      materialsToTest: "Materials to Test (Drag into circuit gap)",
      cell: "Cell",
      bulb: "Bulb",
      makePrediction:
        "Make a Prediction: Will the {{label}} complete the circuit?",
      isAType: "{{label}} is a",
      materialInCircuit: "Material in Circuit:",
      type: "Type:",
      conductor: "⚡ Conductor",
      insulator: "🚫 Insulator",
      bulbStatus: "Bulb Status:",
      onGlowing: "ON (Glowing ✨)",
      offNotGlowing: "OFF (Not glowing)",
      isDescription: "is",
      explainerOn:
        " It allows electric current to pass through, so the bulb glows!",
      explainerOff:
        " It does not allow electric current to pass through, so the bulb stays off.",
      testResults: "Test Results",
      material: "Material",
      typeHeader: "Type",
      bulbHeader: "Bulb",
      clearResults: "Clear Results",
      materialNames: {
        iron: "Iron rod",
        copper: "Copper rod",
        graphite: "Pencil graphite",
        wood: "Wood",
        plastic: "Plastic",
        pencil: "Pencil",
        rubber: "Rubber",
        glass: "Glass",
      },
      materialDescriptions: {
        iron: "a metal that allows electricity to flow through it",
        copper: "an excellent conductor of electricity",
        graphite: "the 'lead' in pencils, which conducts electricity",
        wood: "a natural material that does not conduct electricity",
        plastic: "a synthetic material that blocks electricity",
        pencil:
          "the wooden body of a pencil, which does not conduct electricity",
        rubber: "used to cover wires because it stops electricity",
        glass: "transparent material that does not conduct electricity",
      },
    },
    conductors: {
      intro: {
        title: "Topic 3.4: Conductors & Insulators",
        subtitle:
          "Which materials let electricity pass through? Let's find out! 🔬",
        discoverTitle: "What We'll Discover Today",
        conductorsTitle: "⚡ Conductors",
        conductorsDesc: "Materials that allow electricity to flow",
        insulatorsTitle: "🛡️ Insulators",
        insulatorsDesc: "Materials that stop electricity",
        testingTitle: "🔬 Testing",
        testingDesc: "Use a tester to identify materials",
        safetyTitle: "⚠️ Safety",
        safetyDesc: "Why insulators protect us",
        startButton: "Let's Start Exploring!",
      },
      tester: {
        title: "⚡ Conduction Tester",
        subtitle: "Test which materials conduct electricity!",
        circuitSetup: "Circuit Setup",
        materialsToTest: "Materials to Test",
        conductors: "Conductors",
        semiconductors: "Semiconductors",
        insulators: "Insulators",
        resetTest: "Reset Test",
        battery: "Battery",
        bulb: "Bulb",
        probe1: "Probe 1",
        probe2: "Probe 2",
        currentFlow: "Current Flow →",
        return: "← Return",
        materialUnderTest: "← Material Under Test →",
        conductorDetected: "✓ Conductor Detected!",
        nonConductor: "✗ Non-Conductor (Insulator)",
        materialType: "Material Type:",
        currentFlowLabel: "Current Flow:",
        bulbBrightness: "Bulb Brightness:",
        resistance: "Resistance:",
        howItWorks: "How It Works",
        conductorsDesc:
          "Materials that allow electricity to flow easily. Metals like copper, aluminum, and iron have free electrons that can move through the material, creating an electrical current.",
        semiconductorsDesc:
          "Materials with conductivity between conductors and insulators. Examples include graphite and silicon. Their conductivity can be controlled and is useful in electronics.",
        insulatorsDesc:
          "Materials that resist the flow of electricity. Rubber, plastic, wood, and glass have tightly bound electrons that don't move easily, preventing current flow and keeping us safe.",
        diagramTitle: "Our Conduction Tester",
        cellLabel: "Cell (Battery)",
        wire1: "Wire 1",
        wire2: "Wire 2",
        wire3: "Wire 3",
        lampOn: "⚡ ON",
        lampOff: "○ OFF",
        freeEnd1: "Free End 1",
        freeEnd1Color: "(Red)",
        freeEnd2: "Free End 2",
        freeEnd2Color: "(Blue)",
        testingArea: "TESTING AREA",
        currentFlowPath: "Current Flow Path:",
        circuitComplete: "✓ Circuit Complete - Current Flowing!",
        testing: "Testing...",
        placeMaterial: "↓ Place Material Here ↓",
        touchInstructions1: "Touch both free ends to the material",
        touchInstructions2: "to test if it conducts electricity",
        buildTitle: "How to Build the Tester:",
        buildStep1:
          "Connect a <strong>cell</strong> and a <strong>lamp</strong> with wires",
        buildStep2: "Leave <strong>two wire ends free</strong> (not connected)",
        buildStep3: "<strong>Touch the free ends together</strong> momentarily",
        buildStep4: "If lamp glows, <strong>tester is ready! ✓</strong>",
        howItWorksTitle: "✨ How It Works:",
        howItWorksDesc: "When we touch an object with both free wire ends:",
        conductorResult:
          "If lamp glows: Object is a <strong>CONDUCTOR</strong>",
        insulatorResult:
          "If lamp doesn't glow: Object is an <strong>INSULATOR</strong>",
        tipsTitle: "Important Tips:",
        tip1: "Make sure the two free wires don't touch each other",
        tip2: "Touch both ends of the object being tested",
        tip3: "Hold for 1-2 seconds to observe the lamp",
        back: "Back",
        startTesting: "Start Testing Materials",
      },
      materials: {
        title: "🧪 Let's Test Different Materials!",
        resetAll: "Reset All",
        testing: "Testing...",
        lampGlows: "LAMP GLOWS!",
        conductor: "✓ CONDUCTOR",
        noGlow: "NO GLOW",
        insulator: "✗ INSULATOR",
        progress: "Progress: {tested} / {total} tested",
        clickToTest: "Click on any material to test it!",
        allTestedTitle: "🎉 All Materials Tested!",
        allTestedDesc:
          "Great job! You've identified {conductors} conductors and {insulators} insulators.",
        conductorLabel: "Conductor",
        insulatorLabel: "Insulator",
        back: "Back",
        seeResults: "See Results & Learn More",
        materialNames: {
          metalKey: "Metal Key",
          plasticScale: "Plastic Scale",
          coin: "Coin",
          rubberEraser: "Rubber Eraser",
          glassBangle: "Glass Bangle",
          ironNail: "Iron Nail",
          woodenStick: "Wooden Stick",
          aluminumFoil: "Aluminum Foil",
          paperStrip: "Paper Strip",
          copperWire: "Copper Wire",
          cork: "Cork",
          steelSpoon: "Steel Spoon",
        },
        materialTypes: {
          metalIron: "Metal (Iron)",
          plastic: "Plastic",
          metalCopper: "Metal (Copper)",
          rubber: "Rubber",
          glass: "Glass",
          wood: "Wood",
          metalAluminum: "Metal (Aluminum)",
          paper: "Paper",
          metalSteel: "Metal (Steel)",
          cork: "Cork",
        },
        materialDescriptions: {
          metalKey: "Keys are made of metal like iron or brass",
          plasticScale: "Rulers are usually made of plastic",
          coin: "Coins are made of copper, nickel, or other metals",
          rubberEraser: "Erasers are made from rubber material",
          glassBangle: "Bangles can be made of glass",
          ironNail: "Nails are made of iron or steel",
          woodenStick: "Wood comes from trees",
          aluminumFoil: "Kitchen foil is made of aluminum",
          paperStrip: "Paper is made from wood pulp",
          copperWire: "Electrical wires are usually copper",
          cork: "Cork comes from tree bark",
          steelSpoon: "Spoons are often made of steel",
          graphite: "Moderate conductor, used in pencils",
          saltWater: "Ionic conductor due to dissolved salts",
          plasticRuler: "Insulator, blocks electricity flow",
          glass: "Excellent insulator",
        },
        testMaterialNames: {
          copperWire: "Copper Wire",
          ironNail: "Iron Nail",
          aluminumFoil: "Aluminum Foil",
          graphite: "Graphite (Pencil Lead)",
          saltWater: "Salt Water",
          plasticRuler: "Plastic Ruler",
          rubberEraser: "Rubber Eraser",
          woodenStick: "Wooden Stick",
          glass: "Glass",
          paper: "Paper",
        },
        testMaterialDescriptions: {
          copperWire: "Excellent conductor used in electrical wiring",
          ironNail: "Good conductor, used in construction",
          aluminumFoil: "Lightweight conductor used in packaging",
          graphite: "Moderate conductor, used in pencils",
          saltWater: "Ionic conductor due to dissolved salts",
          plasticRuler: "Insulator, blocks electricity flow",
          rubberEraser: "Excellent insulator, used for safety",
          woodenStick: "Poor conductor when dry",
          glass: "Excellent insulator",
          paper: "Insulator when dry",
        },
      },
      results: {
        title: "📊 Test Results: Conductors vs Insulators",
        conductorsTitle: "Conductors",
        conductorsSubtitle: "Lamp GLOWED ✓",
        conductorsDesc:
          "Materials that <strong>allow electricity to flow</strong> through them easily.",
        insulatorsTitle: "Insulators",
        insulatorsSubtitle: "Lamp DID NOT glow ✗",
        insulatorsDesc:
          "Materials that <strong>do NOT allow electricity to flow</strong> through them.",
        patternConductors: "Pattern: All are <strong>METALS!</strong> 🔑",
        patternInsulators:
          "Pattern: <strong>Non-metals!</strong> (Plastic, Rubber, Wood, Glass, etc.) 🛡️",
        discoveriesTitle: "Key Discoveries:",
        conductorsListTitle: "✓ Conductors (Metals):",
        conductorsList1: "• Iron, Copper, Aluminum",
        conductorsList2: "• Steel, Brass, Silver, Gold",
        conductorsList3: "• All metals conduct electricity",
        insulatorsListTitle: "✗ Insulators (Non-metals):",
        insulatorsList1: "• Plastic, Rubber, Glass",
        insulatorsList2: "• Wood, Paper, Cork",
        insulatorsList3: "• Most non-metals are insulators",
        backToTesting: "Back to Testing",
        learnMoreConductors: "Learn More About Conductors",
      },
      conductorsDetail: {
        title: "⚡ All About Conductors",
        content: "Detailed conductor information...",
        next: "Next: Insulators",
      },
      insulatorsDetail: {
        title: "🛡️ All About Insulators",
        content: "Detailed insulator information...",
        next: "Next: Safety",
      },
      safetyDetail: {
        title: "⚠️ Safety Rules",
        content: "Safety information...",
        next: "Next: Applications",
      },
      applicationsDetail: {
        title: "🔌 Real-World Applications",
        intro:
          "Conductors and insulators are essential in our daily lives. Let's explore how they are used in real-world applications!",
        conductorsTitle: "Conductors in Daily Life",
        insulatorsTitle: "Insulators in Daily Life",
        conductor1: {
          title: "Electrical Wiring",
          desc: "Copper and aluminum wires carry electricity safely through our homes, powering lights, appliances, and devices.",
        },
        conductor2: {
          title: "Light Bulbs",
          desc: "Metal filaments inside bulbs conduct electricity to produce light. The filament glows when current passes through it.",
        },
        conductor3: {
          title: "Electronic Devices",
          desc: "Circuit boards use copper tracks to connect components in phones, computers, and tablets, allowing them to function.",
        },
        conductor4: {
          title: "Electric Vehicles",
          desc: "Batteries and motors use metal conductors to power electric cars, buses, and bikes, making transportation cleaner.",
        },
        conductor5: {
          title: "Power Transmission",
          desc: "High-voltage power lines use aluminum and steel conductors to transport electricity from power plants to cities.",
        },
        insulator1: {
          title: "Safety Equipment",
          desc: "Rubber gloves, boots, and mats protect electricians from electric shocks by preventing current from passing through their bodies.",
        },
        insulator2: {
          title: "Wire Coating",
          desc: "Plastic or rubber coating on electrical wires prevents short circuits and protects us from touching live wires.",
        },
        insulator3: {
          title: "Building Materials",
          desc: "Wood, glass, and plastic are used in construction to prevent electrical accidents and provide structural support.",
        },
        insulator4: {
          title: "Protective Gear",
          desc: "Insulating materials in tools and equipment keep workers safe when handling electrical systems and appliances.",
        },
        insulator5: {
          title: "Packaging & Storage",
          desc: "Plastic and cardboard containers safely store electronic devices, preventing static electricity and damage.",
        },
        keyTakeaways: "Key Takeaways",
        takeaway1:
          "Conductors allow electricity to flow, making them essential for powering devices and transmitting energy.",
        takeaway2:
          "Insulators prevent electricity from flowing, protecting us from electric shocks and preventing accidents.",
        takeaway3:
          "Both conductors and insulators work together to make electrical systems safe and functional in our daily lives.",
        back: "Back to Tester",
      },
      quiz: {
        title: "📝 Quiz Time!",
        content: "Quiz content...",
      },
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
      logo: "વાહક અને કુવાહક",
      learn: "શીખો",
      practice: "પ્રેક્ટિસ",
      applications: "વાસ્તવિક વિશ્વના ઉપયોગો",
    },
    common: {
      next: "આગળ",
      previous: "પાછળ",
      submit: "સબમિટ કરો",
      reset: "રીસેટ",
      gotIt: "સમજાયું!",
      correct: "સાચું",
      incorrect: "ખોટું",
      examples: "ઉદાહરણો",
      yourAnswer: "તમારો જવાબ:",
      answerPlaceholder: "અહિં તમારો જવાબ લખો...",
      ariaBack: "પાછળ જાઓ",
      ariaNext: "આગળ વધો",
    },
    component: {
      on: "ચાલુ",
      off: "બંધ",
    },
    torch: {
      intro: {
        title: "વિષય 3.1: એક ટોર્ચ",
        subtitle: "ચાલો જાણીએ કે ટોર્ચ કેવી રીતે કામ કરે છે! 🔦",
        learnHeading: "અમે શું શીખીશું:",
        start: "ચાલો શરૂ કરીએ!",
      },
      learn: {
        obsTitle: "પર્યવેક્ષણ કૌશલ્ય",
        obsDesc: "ટોર્ચના ભાગોને ઓળખો",
        partsTitle: "ભાગોને સમજો",
        partsDesc: "સેલ, બેટરી, લેમ્પ, સ્વીચ વિશે જાણો",
        glowTitle: "તે કેવી રીતે પ્રગટે છે",
        glowDesc: "જાણો લેમ્પ કેમ બળે છે",
        demoTitle: "ઇન્ટરેક્ટિવ ડેમો",
        demoDesc: "એનિમેશન અને પ્રવૃત્તિઓ અજમાવો",
      },
      safety: {
        title: "સુરક્ષા પ્રથમ!",
        line1: "ફક્ત ટોર્ચ અથવા રિમોટની નાની બેટરી ઉપયોગ કરો.",
        warning: "દીવાલના સોકેટની વીજળી સાથે ક્યારેય પ્રયોગ ન કરો!",
      },
      observe: {
        title: "પ્રવૃત્તિ 3.1: ટોર્ચનું નિરીક્ષણ કરો",
        clickTorch: "ટોર્ચ પર ક્લિક કરો!",
        lampGlowing: "✨ લેમ્પ પ્રગટે છે!",
        lampNotGlowing: "⭕ લેમ્પ પ્રગટતો નથી",
        whatNotice: "🔦 ટોર્ચ શું છે?",
        definition:
          "ટોર્ચ એક પોર્ટેબલ પ્રકાશ સ્ત્રોત છે જે વિદ્યુત સેલ (બેટરી), સ્વીચ, તાર અને લેમ્પ અથવા LED નો ઉપયોગ કરે છે. જ્યારે સ્વીચ ON હોય છે, સેલ તાર દ્વારા લેમ્પ/LED સુધી વીજ પ્રવાહ ધકેલી આપે છે, જેથી તે પ્રકાશ કરે છે અને તમે અંધારામાં જોઈ શકો છો.",
        nextQuestion: "🧐 આગળનો પ્રશ્ન:",
        questionText: "જો આપણે ટોર્ચ ખોલીએ તો અંદર શું મળશે?",
        exploreNext: "ચાલો વિવિધ ભાગો જાણીએ! →",
        back: "પાછળ",
        nextParts: "આગળ: ટોર્ચના ભાગો",
      },
      parts: {
        title: "🔍 ટોર્ચની અંદર શું છે?",
        lamp: "1. લેમ્પ",
        switch: "2. સ્વીચ",
        cells: "3. સેલ",
        wires: "4. તાર",
        lampCard: "લેમ્પ",
        lampDesc: "પ્રકાશ ઉત્પન્ન કરે છે",
        switchCard: "સ્વીચ",
        switchDesc: "ON/OFF નિયંત્રિત કરે છે",
        cellCard: "સેલ",
        cellDesc: "વીજળીનો સ્ત્રોત",
        wiresCard: "તાર",
        wiresDesc: "વીજળી વહન કરે છે",
        clickToLearn: "શીખવા માટે ક્લિક કરો →",
        back: "પાછળ",
        nextCell: "આગળ: સેલ વિશે શીખો",
      },
      cell: {
        title: "🔋 વિદ્યુત સેલ",
        content:
          "વિદ્યુત સેલ રાસાયણિક ઊર્જા સંગ્રહે છે અને સર્કિટ જોડાતા ધનાત્મક (+) ટર્મિનલથી ઋણાત્મક (−) ટર્મિનલ સુધી વીજ ચાર્જ ધકેલી આપે છે. ધાતુનું ટોપ (+) ધનાત્મક ટર્મિનલ છે અને સપાટ આધાર (−) ઋણાત્મક ટર્મિનલ છે. જ્યારે તમે + થી − તાર જોડો અને વચ્ચે લેમ્પ અથવા LED રાખો, ત્યારે સેલ તે ઊર્જા આપે છે જેથી લેમ્પ પ્રગટે છે.",
      },
      battery: {
        title: "🔋🔋 બેટરી",
        content: "બેટરી વિશે વિગતવાર માહિતી અહીં...",
      },
      lamp: {
        title: "💡 વિદ્યુત લેમ્પ",
        content: "લેમ્પ વિશે વિગતવાર માહિતી અહીં...",
      },
      switch: {
        title: "🔘 સ્વીચ",
        content: "સ્વીચ વિશે વિગતવાર માહિતી અહીં...",
      },
      complete: {
        title: "⚡ સંપૂર્ણ સર્કિટ",
        content: "અંતિમ અવલોકન...",
      },
      quiz: {
        title: "📝 ક્વિઝ સમય!",
        content: "તમારું જ્ઞાન તપાસો...",
      },
      nav: {
        back: "પાછળ",
        continue: "શીખવાનું ચાલુ રાખો",
      },
    },
    practice: {
      header: {
        title: "⚡ પ્રેક્ટિસ: ટોર્ચ સર્કિટ",
        subtitle: "જે શીખ્યું તે લાગુ કરો!",
      },
      practiceMode: "પ્રેક્ટિસ મોડ",
      topicSelection: "પ્રેક્ટિસ કરવા માટે વિષય પસંદ કરો",
      mixedPractice: "મિશ્ર પ્રેક્ટિસ",
      allTopics: "બધા વિષયો સાથે",
      questions: "પ્રશ્નો",
      submitAnswer: "જવાબ સબમિટ કરો",
      nextQuestion: "આગળનો પ્રશ્ન",
      finishPractice: "પ્રેક્ટિસ પૂર્ણ કરો",
      yourScore: "તમારો સ્કોર",
      tryAgain: "ફરી પ્રયાસ કરો",
      backToTopics: "વિષયો પર પાછા જાઓ",
      excellentWork: "ઉત્તમ કામ!",
      goodJob: "સારું કામ!",
      keepPracticing: "પ્રેક્ટિસ કરતા રહો!",
      explanation: "સમજૂતી:",
      correctAnswer: "સાચો જવાબ:",
      progress: "પ્રગતિ",
      easy: "સરળ",
      medium: "મધ્યમ",
      hard: "મુશ્કેલ",
      correct: "સાચું",
      incorrect: "ખોટું",
      total: "કુલ",
      outstandingWork: "ઉત્કૃષ્ટ કામ! તમે આ વિષયમાં નિપુણતા મેળવી લીધી છે!",
      goodWork: "સારું કામ! વધુ સુધારો કરવા માટે પ્રેક્ટિસ કરતા રહો.",
      dontGiveUp: "હાર ન માનો! તમારી સમજણ સુધારવા માટે વધુ પ્રેક્ટિસ કરો.",
      topics: {
        identification: {
          name: "મૂળભૂત ઓળખ",
          description: "સુવાહક અને કુવાહકને ઓળખો",
        },
        properties: {
          name: "ગુણધર્મો",
          description: "સામગ્રી ગુણધર્મોને સમજવા",
        },
        wires: {
          name: "તારો અને કેબલ",
          description: "તારો શા માટે બનાવવામાં અને ઢાંકવામાં આવે છે",
        },
        testing: {
          name: "પરીક્ષણ પદ્ધતિઓ",
          description: "વહન પરીક્ષકનો ઉપયોગ",
        },
        safety: {
          name: "સુરક્ષા નિયમો",
          description: "વિદ્યુત સુરક્ષા સાવચેતીઓ",
        },
        applications: {
          name: "વાસ્તવિક ઉપયોગો",
          description: "દૈનિક જીવનમાં ઉપયોગો",
        },
      },
      ex6: {
        question: "પ્રશ્ન",
        of: "ના",
        q1: "ટોર્ચમાં વિદ્યુત સેલનો હેતુ શું છે?",
        q1o1: "પ્રકાશ ઉત્પન્ન કરવા",
        q1o2: "વિદ્યુત ઊર્જા આપવા",
        q1o3: "વીજળીના પ્રવાહને નિયંત્રિત કરવા",
        q1o4: "ભાગોને જોડવા",
        q2: "કેટલા સેલ મળી બેટરી બને છે?",
        q2o1: "એક",
        q2o2: "બે અથવા વધુ",
        q2o3: "બિલ્કુલ ત્રણ",
        q2o4: "કોઈ નહીં",
        q3: "જ્યારે સ્વીચ ON કરીએ ત્યારે શું થાય છે?",
        q3o1: "સર્કિટ તૂટી જાય છે",
        q3o2: "સર્કિટ પૂર્ણ થાય છે અને લેમ્પ પ્રગટે છે",
        q3o3: "બેટરી તરત ખતમ થાય છે",
        q3o4: "કંઈ નથી થાય",
        q4: "ટોર્ચમાં ખરેખર કયું ભાગ પ્રકાશ ઉત્પન્ન કરે છે?",
        q4o1: "સેલ",
        q4o2: "બેટરી",
        q4o3: "વિદ્યુત લેમ્પ",
        q4o4: "સ્વીચ",
        q5: "જોડતાં તાર શું કરે છે?",
        q5o1: "વીજળી સંગ્રહ કરે છે",
        q5o2: "પ્રકાશ ઉત્પન્ન કરે છે",
        q5o3: "ઘટકો વચ્ચે વીજળી લઈ જાય છે",
        q5o4: "વીજળી ON અને OFF કરે છે",
        checkQuiz: "ક્વિઝ સબમિટ કરો",
      },
      ex1: {
        notLabeled: "જવાબ આપ્યો નથી",
      },
      summary: {
        title: "🎉 પ્રેક્ટિસ પૂર્ણ!",
        totalScore: "કુલ સ્કોર:",
        exercisesCompleted: "પૂર્ણ પ્રેક્ટિસ:",
        excellent: "ઉત્કૃષ્ટ કામ!",
        good: "સારું કામ!",
        keepPracticing: "પ્રેક્ટિસ ચાલુ રાખો!",
        restart: "પ્રેક્ટિસ ફરી શરૂ કરો",
        backToLearn: "શીખવાના મોડ પર પાછા જાઓ",
        scoreLine:
          "{correct, number} / {total, number} સાચા ({percentage, number}%)",
        exerciseCount:
          "{count, plural, one {{count} પ્રેક્ટિસ પૂર્ણ} other {{count} પ્રેક્ટિસ પૂર્ણ}}",
      },
    },
    realworld: {
      title: "વાસ્તવિક વિશ્વના ઉપયોગો",
      tagline: "જાણો કે વીજળી આપણા દૈનિક જીવનને કેવી રીતે શક્તિ આપે છે",
      usageCategories: "વીજળીના ઉપયોગની શ્રેણીઓ",
      keyFacts: "વીજળી અંગેના મુખ્ય તારણો",
      cooking: "રસોઈ",
      lighting: "લાઇટિંગ",
      transportation: "પરિવહન",
      heating: "હીટિંગ અને કૂલિંગ",
      entertainment: "મનોરંજન",
      communication: "સંદેશાવ્યવહાર",
      dc: {
        title: "ડાયરેક્ટ કરંટ (DC)",
        desc: "બેટરી DC વીજળી આપે છે - કરંટ એક દિશામાં વહે છે. મોબાઈલ, ટોર્ચ અને ઇલેક્ટ્રિક વાહનોમાં ઉપયોગી.",
      },
      ac: {
        title: "અલ્ટરનેટિંગ કરંટ (AC)",
        desc: "ભીંતના સોકેટ AC આપે છે - કરંટ દિશા બદલે છે. ઘરમાં મોટાભાગના ઉપકરણોમાં ઉપયોગી.",
      },
      storage: {
        title: "ઊર્જા સંગ્રહ",
        desc: "બેટરી વીજળીને રાસાયણિક રીતે સંગ્રહિત કરે છે, જેથી ઉપકરણોને પ્લગ વગર ચલાવી શકાય.",
      },
      impact: {
        title: "વૈશ્વિક અસર",
        desc: "સોલાર અને હાઇડ્રો જેવી નવીનીકરણીય ઊર્જા પર્યાવરણને બચાવવામાં મદદ કરે છે.",
      },
      desc: {
        cooking: "વીજળી વિવિધ રસોઈ ઉપકરણોને ચલાવે છે",
        lighting: "અમારા ઘર અને રસ્તાઓને પ્રકાશિત કરે છે",
        transportation: "ઇલેક્ટ્રિક વાહનો અને જાહેર પરિવહન",
        heating: "ઈમારતોમાં હવામાન નિયંત્રણ",
        entertainment: "મનોરંજન ઉપકરણોને શક્તિ આપે છે",
        communication: "વિશ્વભરના લોકોને જોડે છે",
      },
      example: {
        cooking: {
          stove: "ઇલેક્ટ્રિક સ્ટોવ",
          microwave: "માઇક્રોવેવ ઓવન",
          kettle: "ઇલેક્ટ્રિક કેટલ",
          toaster: "ટોસ્ટર",
        },
        lighting: {
          bulbs: "LED બલ્બ",
          street: "સ્ટ્રીટ લાઇટ",
          flashlight: "ટોર્ચ",
          lamp: "લેમ્પ",
        },
        transportation: {
          cars: "ઇલેક્ટ્રિક કાર",
          trains: "ટ્રેન",
          trams: "ટ્રામ",
          ebikes: "ઇ-બાઇક્સ",
        },
        heating: {
          ac: "એર કન્ડીશનર",
          heater: "હીટર",
          blanket: "ઇલેક્ટ્રિક બ્લેન્કેટ",
          fan: "પંખા",
        },
        entertainment: {
          tv: "ટેલિવિઝન",
          computer: "કમ્પ્યુટર",
          console: "ગેમિંગ કન્સોલ",
          speakers: "સ્પીકર્સ",
        },
        communication: {
          phones: "મોબાઇલ ફોન",
          router: "ઇન્ટરનેટ રાઉટર",
          radio: "રેડિયો",
          satellite: "સેટેલાઇટ",
        },
      },
      safety: {
        "1": "ઘરેલુ વીજળી સાથે ક્યારેય પ્રયોગ ન કરો",
        "2": "ફક્ત બેટરી/સેલથી પ્રયોગ કરો",
        "3": "ઓલા હાથથી સ્વીચ ન સ્પર્શો",
        "4": "નકામા ઉપકરણોનો ઉપયોગ ન કરો",
        "5": "વીજળીના કાર્યમાં હંમેશા વયસ્કની મદદ લો",
        title: "સુરક્ષા પ્રથમ!",
      },
      stats: {
        title: "સ્થાનિક આંકડા",
        households: "વીજળી ધરાવતાં ઘર",
        savings: "સરેરાશ માસિક બચત",
        updated: "{date}એ સુધારેલ",
      },
    },
    learn: {
      information: "માહિતી",
      headerTitle: "વાહક અને કુવાહક",
      headerSubtitle:
        "વસ્તુઓને ગેપમાં ખેંચો અને સર્કિટ પૂર્ણ કરો. દીવો પ્રગટશે?",
      circuitTestArea: "સર્કિટ ટેસ્ટ વિસ્તાર",
      hideCurrent: "કરન્ટ છુપાવો",
      showCurrent: "કરન્ટ બતાવો",
      connectionMade: "કનેક્શન બન્યું",
      dragObjectHere: "↓ વસ્તુ અહીં ખેંચો ↓",
      predYesConduct: "હા, તે ચાલન કરશે!",
      predNoInsulator: "ના, તે કુવાહક છે",
      resultCorrect: "સાચું છે!",
      notQuite: "❌ બિલકુલ નહીં!",
      explainerOnAlt:
        "તે ઇલેક્ટ્રોનના પ્રવાહને મંજૂરી આપે છે, તેથી લૂપ બંધ થાય છે અને દીવો પ્રગટે છે! 💡",
      explainerOffAlt:
        "તે ઇલેક્ટ્રોન પ્રવાહને અટકાવે છે, તેથી સર્કિટ તૂટી રહે છે અને દીવો નહીં પ્રગટે. 🚫",
      dragMaterialToTest: "👆 ચકાસવા માટે સામગ્રીને સર્કિટ ગેપમાં ખેંચો!",
      materialsToTest: "ચકાસવા માટેની સામગ્રી (ગેપમાં ખેંચો)",
      cell: "સેલ",
      bulb: "બલ્બ",
      makePrediction: "અનુમાન લગાવો: શું {{label}} સર્કિટ પૂર્ણ કરશે?",
      isAType: "{{label}} એક",
      materialInCircuit: "સર્કિટમાં સામગ્રી:",
      type: "પ્રકાર:",
      conductor: "⚡ વાહક",
      insulator: "🚫 કુવાહક",
      bulbStatus: "બલ્બ સ્થિતિ:",
      onGlowing: "ચાલુ (પ્રગટે છે ✨)",
      offNotGlowing: "બંધ (પ્રગટતો નથી)",
      isDescription: "છે",
      explainerOn: " તે વિદ્યુત પ્રવાહને પસાર થવા દે છે, તેથી બલ્બ પ્રગટે છે!",
      explainerOff:
        " તે વિદ્યુત પ્રવાહને પસાર થવા દેતું નથી, તેથી બલ્બ બંધ રહે છે.",
      testResults: "પરીક્ષણ પરિણામો",
      material: "સામગ્રી",
      typeHeader: "પ્રકાર",
      bulbHeader: "બલ્બ",
      clearResults: "પરિણામો સાફ કરો",
      materialNames: {
        iron: "લોખંડની લાકડી",
        copper: "તાંબાની લાકડી",
        graphite: "પેંસિલ ગ્રેફાઇટ",
        wood: "લાકડું",
        plastic: "પ્લાસ્ટિક",
        pencil: "પેંસિલ",
        rubber: "રબર",
        glass: "કાચ",
      },
      materialDescriptions: {
        iron: "એક ધાતુ જે વીજળીને વહેવા દે છે",
        copper: "વીજળીનો ઉત્કૃષ્ટ વાહક",
        graphite: "પેંસિલમાં 'લીડ', જે વીજળી વહન કરે છે",
        wood: "એક કુદરતી સામગ્રી જે વીજળી વહન કરતી નથી",
        plastic: "એક સિન્થેટિક સામગ્રી જે વીજળીને અવરોધે છે",
        pencil: "પેંસિલનું લાકડાનું શરીર, જે વીજળી વહન કરતું નથી",
        rubber: "તારોને ઢાંકવા માટે વપરાય છે કારણ કે તે વીજળીને અટકાવે છે",
        glass: "પારદર્શક સામગ્રી જે વીજળી વહન કરતી નથી",
      },
    },
    conductors: {
      intro: {
        title: "વિષય 3.4: વાહક અને કુવાહક",
        subtitle: "કઈ સામગ્રી વીજળીને પસાર થવા દે છે? ચાલો જાણીએ! 🔬",
        discoverTitle: "આજે આપણે શું શોધીશું",
        conductorsTitle: "⚡ વાહક",
        conductorsDesc: "સામગ્રી જે વીજળીને વહેવા દે છે",
        insulatorsTitle: "🛡️ કુવાહક",
        insulatorsDesc: "સામગ્રી જે વીજળીને અટકાવે છે",
        testingTitle: "🔬 પરીક્ષણ",
        testingDesc: "સામગ્રી ઓળખવા માટે ટેસ્ટરનો ઉપયોગ કરો",
        safetyTitle: "⚠️ સુરક્ષા",
        safetyDesc: "કુવાહક આપણને કેમ બચાવે છે",
        startButton: "ચાલો શોધવાનું શરૂ કરીએ!",
      },
      tester: {
        title: "⚡ વાહકતા ટેસ્ટર",
        subtitle: "પરીક્ષણ કરો કે કઈ સામગ્રી વીજળીનું વહન કરે છે!",
        circuitSetup: "સર્કિટ સેટઅપ",
        materialsToTest: "પરીક્ષણ કરવા માટે સામગ્રી",
        conductors: "વાહક",
        semiconductors: "અર્ધવાહક",
        insulators: "કુવાહક",
        resetTest: "પરીક્ષણ રીસેટ કરો",
        battery: "બેટરી",
        bulb: "બલ્બ",
        probe1: "પ્રોબ 1",
        probe2: "પ્રોબ 2",
        currentFlow: "પ્રવાહ →",
        return: "← પરત",
        materialUnderTest: "← પરીક્ષણ હેઠળ સામગ્રી →",
        conductorDetected: "✓ વાહક મળી આવ્યો!",
        nonConductor: "✗ બિન-વાહક (કુવાહક)",
        materialType: "સામગ્રી પ્રકાર:",
        currentFlowLabel: "પ્રવાહ:",
        bulbBrightness: "બલ્બ ચમક:",
        resistance: "પ્રતિરોધ:",
        howItWorks: "તે કેવી રીતે કામ કરે છે",
        conductorsDesc:
          "સામગ્રી જે વીજળીને સરળતાથી વહેવા દે છે. તાંબા, એલ્યુમિનિયમ અને લોખંડ જેવી ધાતુઓમાં મુક્ત ઇલેક્ટ્રોન હોય છે જે સામગ્રી દ્વારા ફરી શકે છે, વિદ્યુત પ્રવાહ બનાવે છે.",
        semiconductorsDesc:
          "વાહક અને કુવાહક વચ્ચે વાહકતા સાથે સામગ્રી. ઉદાહરણોમાં ગ્રેફાઇટ અને સિલિકોન શામેલ છે. તેમની વાહકતા નિયંત્રિત કરી શકાય છે અને ઇલેક્ટ્રોનિક્સમાં ઉપયોગી છે.",
        insulatorsDesc:
          "સામગ્રી જે વીજળીના પ્રવાહનો પ્રતિકાર કરે છે. રબર, પ્લાસ્ટિક, લાકડું અને કાચમાં ચુસ્તપણે બંધાયેલા ઇલેક્ટ્રોન હોય છે જે સરળતાથી ફરતા નથી, પ્રવાહને અટકાવે છે અને આપણને સુરક્ષિત રાખે છે.",
        diagramTitle: "અમારો વાહકતા ટેસ્ટર",
        cellLabel: "સેલ (બેટરી)",
        wire1: "તાર 1",
        wire2: "તાર 2",
        wire3: "તાર 3",
        lampOn: "⚡ ચાલુ",
        lampOff: "○ બંધ",
        freeEnd1: "મુક્ત છેડો 1",
        freeEnd1Color: "(લાલ)",
        freeEnd2: "મુક્ત છેડો 2",
        freeEnd2Color: "(નીલો)",
        testingArea: "પરીક્ષણ વિસ્તાર",
        currentFlowPath: "પ્રવાહ માર્ગ:",
        circuitComplete: "✓ સર્કિટ પૂર્ણ - પ્રવાહ વહે છે!",
        testing: "પરીક્ષણ કરી રહ્યા છીએ...",
        placeMaterial: "↓ અહીં સામગ્રી મૂકો ↓",
        touchInstructions1: "સામગ્રીના બંને મુક્ત છેડાઓને સ્પર્શ કરો",
        touchInstructions2: "તે વીજળીનું વહન કરે છે કે નહીં તે તપાસવા માટે",
        buildTitle: "ટેસ્ટર કેવી રીતે બનાવવો:",
        buildStep1:
          "તારોથી એક <strong>સેલ</strong> અને એક <strong>લેમ્પ</strong> જોડો",
        buildStep2: "<strong>બે તારના છેડા મુક્ત</strong> છોડો (જોડાયેલા નહીં)",
        buildStep3: "ક્ષણભર <strong>મુક્ત છેડાઓને એક સાથે સ્પર્શ કરો</strong>",
        buildStep4: "જો લેમ્પ પ્રગટે, તો <strong>ટેસ્ટર તૈયાર છે! ✓</strong>",
        howItWorksTitle: "✨ તે કેવી રીતે કામ કરે છે:",
        howItWorksDesc:
          "જ્યારે આપણે કોઈ વસ્તુને બંને મુક્ત તાર છેડાઓથી સ્પર્શ કરીએ છીએ:",
        conductorResult: "જો લેમ્પ પ્રગટે: વસ્તુ એક <strong>વાહક</strong> છે",
        insulatorResult:
          "જો લેમ્પ પ્રગટતો નથી: વસ્તુ એક <strong>કુવાહક</strong> છે",
        tipsTitle: "મહત્વપૂર્ણ ટિપ્સ:",
        tip1: "ખાતરી કરો કે બે મુક્ત તાર એકબીજાને સ્પર્શ ન કરે",
        tip2: "પરીક્ષણ કરવામાં આવતી વસ્તુના બંને છેડાઓને સ્પર્શ કરો",
        tip3: "લેમ્પ જોવા માટે 1-2 સેકંડ પકડો",
        back: "પાછળ",
        startTesting: "સામગ્રીનું પરીક્ષણ શરૂ કરો",
      },
      materials: {
        title: "🧪 ચાલો વિવિધ સામગ્રીનું પરીક્ષણ કરીએ!",
        resetAll: "બધું રીસેટ કરો",
        testing: "પરીક્ષણ કરી રહ્યા છીએ...",
        lampGlows: "લેમ્પ પ્રગટે છે!",
        conductor: "✓ વાહક",
        noGlow: "પ્રગટતો નથી",
        insulator: "✗ કુવાહક",
        progress: "પ્રગતિ: {tested} / {total} પરીક્ષણ કર્યું",
        clickToTest: "પરીક્ષણ કરવા માટે કોઈપણ સામગ્રી પર ક્લિક કરો!",
        allTestedTitle: "🎉 બધી સામગ્રીનું પરીક્ષણ થઈ ગયું!",
        allTestedDesc:
          "ઉત્કૃષ્ટ કામ! તમે {conductors} વાહક અને {insulators} કુવાહક ઓળખ્યા છે.",
        conductorLabel: "વાહક",
        insulatorLabel: "કુવાહક",
        back: "પાછળ",
        seeResults: "પરિણામો જુઓ અને વધુ શીખો",
        materialNames: {
          metalKey: "ધાતુની ચાવી",
          plasticScale: "પ્લાસ્ટિક સ્કેલ",
          coin: "સિક્કો",
          rubberEraser: "રબર ઇરેઝર",
          glassBangle: "કાચનો ચૂડો",
          ironNail: "લોખંડની ખીલી",
          woodenStick: "લાકડાની લાકડી",
          aluminumFoil: "એલ્યુમિનિયમ ફોઇલ",
          paperStrip: "કાગળની પટ્ટી",
          copperWire: "તાંબાનો તાર",
          cork: "કોર્ક",
          steelSpoon: "સ્ટીલનો ચમચો",
        },
        materialTypes: {
          metalIron: "ધાતુ (લોખંડ)",
          plastic: "પ્લાસ્ટિક",
          metalCopper: "ધાતુ (તાંબું)",
          rubber: "રબર",
          glass: "કાચ",
          wood: "લાકડું",
          metalAluminum: "ધાતુ (એલ્યુમિનિયમ)",
          paper: "કાગળ",
          metalSteel: "ધાતુ (સ્ટીલ)",
          cork: "કોર્ક",
        },
        materialDescriptions: {
          metalKey: "ચાવીઓ લોખંડ અથવા પિત્તળ જેવી ધાતુથી બનેલી હોય છે",
          plasticScale: "સ્કેલ સામાન્ય રીતે પ્લાસ્ટિકથી બનેલા હોય છે",
          coin: "સિક્કા તાંબા, નિકલ અથવા અન્ય ધાતુઓથી બનેલા હોય છે",
          rubberEraser: "ઇરેઝર રબર સામગ્રીથી બનેલા હોય છે",
          glassBangle: "ચૂડા કાચથી બનેલા હોઈ શકે છે",
          ironNail: "ખીલીઓ લોખંડ અથવા સ્ટીલથી બનેલી હોય છે",
          woodenStick: "લાકડું વૃક્ષોમાંથી આવે છે",
          aluminumFoil: "રસોઇ ફોઇલ એલ્યુમિનિયમથી બનેલી હોય છે",
          paperStrip: "કાગળ લાકડાના પલ્પથી બનેલો હોય છે",
          copperWire: "વિદ્યુત તાર સામાન્ય રીતે તાંબાના હોય છે",
          cork: "કોર્ક વૃક્ષની છાલમાંથી આવે છે",
          steelSpoon: "ચમચા ઘણીવાર સ્ટીલથી બનેલા હોય છે",
          graphite: "મધ્યમ વાહક, પેંસિલમાં વપરાય છે",
          saltWater: "ઓગળેલા મીઠાને કારણે આયનિક વાહક",
          plasticRuler: "કુવાહક, વીજળીના પ્રવાહને અવરોધે છે",
          glass: "ઉત્કૃષ્ટ કુવાહક",
        },
        testMaterialNames: {
          copperWire: "તાંબાનો તાર",
          ironNail: "લોખંડની ખીલી",
          aluminumFoil: "એલ્યુમિનિયમ ફોઇલ",
          graphite: "ગ્રેફાઇટ (પેંસિલ લીડ)",
          saltWater: "મીઠાનું પાણી",
          plasticRuler: "પ્લાસ્ટિક સ્કેલ",
          rubberEraser: "રબર ઇરેઝર",
          woodenStick: "લાકડાની લાકડી",
          glass: "કાચ",
          paper: "કાગળ",
        },
        testMaterialDescriptions: {
          copperWire: "વિદ્યુત વાયરિંગમાં વપરાતો ઉત્કૃષ્ટ વાહક",
          ironNail: "સારો વાહક, બાંધકામમાં વપરાય છે",
          aluminumFoil: "પેકેજિંગમાં વપરાતો હળવો વાહક",
          graphite: "મધ્યમ વાહક, પેંસિલમાં વપરાય છે",
          saltWater: "ઓગળેલા મીઠાને કારણે આયનિક વાહક",
          plasticRuler: "કુવાહક, વીજળીના પ્રવાહને અવરોધે છે",
          rubberEraser: "ઉત્કૃષ્ટ કુવાહક, સુરક્ષા માટે વપરાય છે",
          woodenStick: "સૂકા હોય ત્યારે ખરાબ વાહક",
          glass: "ઉત્કૃષ્ટ કુવાહક",
          paper: "સૂકા હોય ત્યારે કુવાહક",
        },
      },
      results: {
        title: "📊 પરીક્ષણ પરિણામો: વાહક વિરુદ્ધ કુવાહક",
        conductorsTitle: "વાહક",
        conductorsSubtitle: "લેમ્પ પ્રગટ્યું ✓",
        conductorsDesc:
          "સામગ્રી જે વીજળીને સરળતાથી <strong>વહેવા દે છે</strong>.",
        insulatorsTitle: "કુવાહક",
        insulatorsSubtitle: "લેમ્પ પ્રગટ્યું નથી ✗",
        insulatorsDesc: "સામગ્રી જે વીજળીને <strong>વહેવા દેતી નથી</strong>.",
        patternConductors: "પેટર્ન: બધા <strong>ધાતુઓ છે!</strong> 🔑",
        patternInsulators:
          "પેટર્ન: <strong>અધાતુ!</strong> (પ્લાસ્ટિક, રબર, લાકડું, કાચ, વગેરે) 🛡️",
        discoveriesTitle: "મુખ્ય શોધો:",
        conductorsListTitle: "✓ વાહક (ધાતુ):",
        conductorsList1: "• લોખંડ, તાંબું, એલ્યુમિનિયમ",
        conductorsList2: "• સ્ટીલ, પિત્તળ, ચાંદી, સોનું",
        conductorsList3: "• બધી ધાતુઓ વીજળીનું વહન કરે છે",
        insulatorsListTitle: "✗ કુવાહક (અધાતુ):",
        insulatorsList1: "• પ્લાસ્ટિક, રબર, કાચ",
        insulatorsList2: "• લાકડું, કાગળ, કોર્ક",
        insulatorsList3: "• મોટાભાગની અધાતુ કુવાહક હોય છે",
        backToTesting: "પરીક્ષણ પર પાછા",
        learnMoreConductors: "વાહક વિશે વધુ શીખો",
      },
      conductorsDetail: {
        title: "⚡ વાહક વિશે બધું",
        content: "વિગતવાર વાહક માહિતી...",
        next: "આગળ: કુવાહક",
      },
      insulatorsDetail: {
        title: "🛡️ કુવાહક વિશે બધું",
        content: "વિગતવાર કુવાહક માહિતી...",
        next: "આગળ: સુરક્ષા",
      },
      safetyDetail: {
        title: "⚠️ સુરક્ષા નિયમો",
        content: "સુરક્ષા માહિતી...",
        next: "આગળ: ઉપયોગો",
      },
      applicationsDetail: {
        title: "🔌 વાસ્તવિક વિશ્વના ઉપયોગો",
        intro:
          "વાહક અને કુવાહક આપણા દૈનિક જીવનમાં આવશ્યક છે. ચાલો જોઈએ કે તેઓ વાસ્તવિક વિશ્વના ઉપયોગોમાં કેવી રીતે વપરાય છે!",
        conductorsTitle: "દૈનિક જીવનમાં વાહક",
        insulatorsTitle: "દૈનિક જીવનમાં કુવાહક",
        conductor1: {
          title: "વિદ્યુત વાયરિંગ",
          desc: "તાંબા અને એલ્યુમિનિયમના તાર આપણા ઘરોમાં વીજળીને સુરક્ષિત રીતે લઈ જાય છે, લાઇટ, સાધનો અને ઉપકરણોને પાવર આપે છે.",
        },
        conductor2: {
          title: "લાઇટ બલ્બ",
          desc: "બલ્બની અંદર ધાતુના તંતુઓ પ્રકાશ ઉત્પન્ન કરવા માટે વીજળીનું વહન કરે છે. જ્યારે પ્રવાહ તેમાંથી પસાર થાય છે ત્યારે તંતુ પ્રગટે છે.",
        },
        conductor3: {
          title: "ઇલેક્ટ્રોનિક ઉપકરણો",
          desc: "સર્કિટ બોર્ડ ફોન, કમ્પ્યુટર અને ટેબ્લેટમાં ઘટકોને જોડવા માટે તાંબાના ટ્રેકનો ઉપયોગ કરે છે, જે તેમને કાર્ય કરવા દે છે.",
        },
        conductor4: {
          title: "ઇલેક્ટ્રિક વાહનો",
          desc: "બેટરી અને મોટર ઇલેક્ટ્રિક કારો, બસો અને બાઇકને પાવર આપવા માટે ધાતુ વાહકોનો ઉપયોગ કરે છે, પરિવહનને સ્વચ્છ બનાવે છે.",
        },
        conductor5: {
          title: "પાવર ટ્રાન્સમિશન",
          desc: "ઉચ્ચ વોલ્ટેજ પાવર લાઇનો પાવર પ્લાન્ટ્સથી શહેરો સુધી વીજળી લઈ જવા માટે એલ્યુમિનિયમ અને સ્ટીલ વાહકોનો ઉપયોગ કરે છે.",
        },
        insulator1: {
          title: "સુરક્ષા સાધનો",
          desc: "રબરના દસ્તાના, જૂતા અને ચટાઈ વીજળીના ઝટકાથી ઇલેક્ટ્રિશિયનોને બચાવે છે, પ્રવાહને તેમના શરીરમાંથી પસાર થતા અટકાવે છે.",
        },
        insulator2: {
          title: "વાયર કોટિંગ",
          desc: "વિદ્યુત તારો પર પ્લાસ્ટિક અથવા રબર કોટિંગ શોર્ટ સર્કિટને અટકાવે છે અને આપણને જીવંત તારોને સ્પર્શ કરવાથી બચાવે છે.",
        },
        insulator3: {
          title: "બિલ્ડિંગ સામગ્રી",
          desc: "લાકડું, કાચ અને પ્લાસ્ટિકનો ઉપયોગ બાંધકામમાં વિદ્યુત અકસ્માતોને અટકાવવા અને માળખાકીય સહાય પ્રદાન કરવા માટે થાય છે.",
        },
        insulator4: {
          title: "સુરક્ષાત્મક ગિયર",
          desc: "સાધનો અને ઉપકરણોમાં અવાહક સામગ્રી વિદ્યુત પ્રણાલીઓ અને સાધનોને હેન્ડલ કરતી વખતે કામદારોને સુરક્ષિત રાખે છે.",
        },
        insulator5: {
          title: "પેકેજિંગ અને સંગ્રહ",
          desc: "પ્લાસ્ટિક અને કાર્ડબોર્ડ કન્ટેનર ઇલેક્ટ્રોનિક ઉપકરણોને સુરક્ષિત રીતે સંગ્રહિત કરે છે, સ્થિર વીજળી અને નુકસાનને અટકાવે છે.",
        },
        keyTakeaways: "મુખ્ય બાબતો",
        takeaway1:
          "વાહક વીજળીને વહેવા દે છે, જે તેમને ઉપકરણોને પાવર આપવા અને ઊર્જા પ્રસારિત કરવા માટે આવશ્યક બનાવે છે.",
        takeaway2:
          "કુવાહક વીજળીને વહેવાથી અટકાવે છે, વીજળીના ઝટકાથી આપણને બચાવે છે અને અકસ્માતોને અટકાવે છે.",
        takeaway3:
          "વાહક અને કુવાહક બંને મળીને આપણા દૈનિક જીવનમાં વિદ્યુત પ્રણાલીઓને સુરક્ષિત અને કાર્યાત્મક બનાવે છે.",
        back: "ટેસ્ટર પર પાછા",
      },
      quiz: {
        title: "📝 ક્વિઝ સમય!",
        content: "ક્વિઝ સામગ્રી...",
      },
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
      logo: "चालक और कुचालक",
      learn: "सीखें",
      practice: "अभ्यास",
      applications: "वास्तविक दुनिया के अनुप्रयोग",
    },
    common: {
      next: "अगला",
      previous: "पिछला",
      submit: "जमा करें",
      reset: "रीसेट",
      gotIt: "समझ गया!",
      correct: "सही",
      incorrect: "गलत",
      examples: "उदाहरण",
      yourAnswer: "आपका उत्तर:",
      answerPlaceholder: "अपना उत्तर यहाँ लिखें...",
      ariaBack: "वापस जाएं",
      ariaNext: "आगे बढ़ें",
    },
    component: {
      on: "चालू",
      off: "बंद",
    },
    torch: {
      intro: {
        title: "विषय 3.1: एक टॉर्च",
        subtitle: "आइए जानें कि टॉर्च कैसे काम करती है! 🔦",
        learnHeading: "हम क्या सीखेंगे:",
        start: "चलो शुरू करें!",
      },
      learn: {
        obsTitle: "निरीक्षण कौशल",
        obsDesc: "टॉर्च के हिस्सों की पहचान करें",
        partsTitle: "पार्ट्स को समझें",
        partsDesc: "सेल, बैटरी, लैंप, स्विच के बारे में जानें",
        glowTitle: "यह कैसे चमकता है",
        glowDesc: "जानें लैंप क्यों जलता है",
        demoTitle: "इंटरैक्टिव डेमो",
        demoDesc: "एनीमेशन और गतिविधियाँ आज़माएँ",
      },
      safety: {
        title: "सुरक्षा पहले!",
        line1: "केवल टॉर्च या रिमोट की छोटी बैटरियाँ इस्तेमाल करें।",
        warning: "दीवार के सॉकेट की बिजली से कभी प्रयोग न करें!",
      },
      observe: {
        title: "गतिविधि 3.1: टॉर्च का निरीक्षण करें",
        clickTorch: "टॉर्च पर क्लिक करें!",
        lampGlowing: "✨ लैंप चमक रहा है!",
        lampNotGlowing: "⭕ लैंप नहीं चमक रहा",
        whatNotice: "🔦 टॉर्च क्या है?",
        definition:
          "टॉर्च एक पोर्टेबल प्रकाश स्रोत है जो विद्युत सेल (बैटरी), एक स्विच, तार और लैंप या LED का उपयोग करता है। जब स्विच ON होता है, सेल तारों के माध्यम से लैंप/LED तक विद्युत धारा भेजते हैं, जिससे वह चमकता है और आप अंधेरे में देख पाते हैं।",
        nextQuestion: "🧐 अगला प्रश्न:",
        questionText: "यदि हम टॉर्च खोलें, तो अंदर क्या मिलेगा?",
        exploreNext: "आइए विभिन्न भागों का पता लगाएं! →",
        back: "पीछे",
        nextParts: "अगला: टॉर्च के पार्ट्स",
      },
      parts: {
        title: "🔍 टॉर्च के अंदर क्या है?",
        lamp: "1. लैंप",
        switch: "2. स्विच",
        cells: "3. सेल",
        wires: "4. तार",
        lampCard: "लैंप",
        lampDesc: "रोशनी उत्पन्न करता है",
        switchCard: "स्विच",
        switchDesc: "ON/OFF नियंत्रित करता है",
        cellCard: "सेल",
        cellDesc: "बिजली का स्रोत",
        wiresCard: "तार",
        wiresDesc: "बिजली ले जाते हैं",
        clickToLearn: "सीखने के लिए क्लिक करें →",
        back: "पीछे",
        nextCell: "अगला: सेल के बारे में जानें",
      },
      cell: {
        title: "🔋 विद्युत सेल",
        content:
          "विद्युत सेल रासायनिक ऊर्जा को संग्रहीत करता है और परिपथ में जुड़ने पर धनात्मक (+) से ऋणात्मक (−) टर्मिनल तक विद्युत आवेश को धकेलता है। ऊपर की धातु टोपी धनात्मक टर्मिनल होती है और सपाट आधार ऋणात्मक टर्मिनल। जब आप तारों को + से − जोड़कर लैंप या LED लगाते हैं, तो सेल वही ऊर्जा देता है जिससे लैंप जलता है।",
      },
      battery: {
        title: "🔋🔋 बैटरी",
        content: "बैटरी की विस्तृत जानकारी यहाँ...",
      },
      lamp: {
        title: "💡 विद्युत लैंप",
        content: "लैंप की विस्तृत जानकारी यहाँ...",
      },
      switch: {
        title: "🔘 स्विच",
        content: "स्विच की विस्तृत जानकारी यहाँ...",
      },
      complete: {
        title: "⚡ पूर्ण परिपथ",
        content: "अंतिम अवलोकन...",
      },
      quiz: {
        title: "📝 क्विज़ समय!",
        content: "अपने ज्ञान का परीक्षण करें...",
      },
      nav: {
        back: "पीछे",
        continue: "सीखना जारी रखें",
      },
    },
    practice: {
      header: {
        title: "⚡ अभ्यास: टॉर्च परिपथ",
        subtitle: "जो सीखा उसे लागू करें!",
      },
      practiceMode: "अभ्यास मोड",
      topicSelection: "अभ्यास के लिए एक विषय चुनें",
      mixedPractice: "मिश्रित अभ्यास",
      allTopics: "सभी विषय एक साथ",
      questions: "प्रश्न",
      submitAnswer: "उत्तर जमा करें",
      nextQuestion: "अगला प्रश्न",
      finishPractice: "अभ्यास समाप्त करें",
      yourScore: "आपका स्कोर",
      tryAgain: "फिर से प्रयास करें",
      backToTopics: "विषयों पर वापस जाएं",
      excellentWork: "उत्कृष्ट काम!",
      goodJob: "अच्छा काम!",
      keepPracticing: "अभ्यास करते रहें!",
      explanation: "स्पष्टीकरण:",
      correctAnswer: "सही उत्तर:",
      progress: "प्रगति",
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन",
      correct: "सही",
      incorrect: "गलत",
      total: "कुल",
      outstandingWork: "शानदार काम! आपने इस विषय में महारत हासिल कर ली है!",
      goodWork: "अच्छा काम! आगे सुधार के लिए अभ्यास करते रहें।",
      dontGiveUp: "हार मत मानो! अपनी समझ सुधारने के लिए और अभ्यास करें।",
      topics: {
        identification: {
          name: "मूल पहचान",
          description: "सुचालक और कुचालक की पहचान करें",
        },
        properties: {
          name: "गुण",
          description: "सामग्री गुणों को समझना",
        },
        wires: {
          name: "तार और केबल",
          description: "तार क्यों बनाए और ढके जाते हैं",
        },
        testing: {
          name: "परीक्षण विधियां",
          description: "चालन परीक्षक का उपयोग",
        },
        safety: {
          name: "सुरक्षा नियम",
          description: "विद्युत सुरक्षा सावधानियां",
        },
        applications: {
          name: "वास्तविक उपयोग",
          description: "दैनिक जीवन में अनुप्रयोग",
        },
      },
      ex6: {
        question: "प्रश्न",
        of: "का",
        q1: "टॉर्च में विद्युत सेल का उद्देश्य क्या है?",
        q1o1: "रोशनी उत्पन्न करना",
        q1o2: "विद्युत ऊर्जा प्रदान करना",
        q1o3: "बिजली के प्रवाह को नियंत्रित करना",
        q1o4: "भागों को जोड़ना",
        q2: "कितने सेल मिलकर बैटरी बनाते हैं?",
        q2o1: "एक",
        q2o2: "दो या अधिक",
        q2o3: "बिल्कुल तीन",
        q2o4: "कोई नहीं",
        q3: "जब हम स्विच को ON स्थिति में स्लाइड करते हैं तो क्या होता है?",
        q3o1: "परिपथ टूट जाता है",
        q3o2: "परिपथ पूरा होता है और लैंप चमकता है",
        q3o3: "बैटरी तुरंत खत्म हो जाती है",
        q3o4: "कुछ नहीं होता",
        q4: "टॉर्च में वास्तव में कौन सा घटक रोशनी उत्पन्न करता है?",
        q4o1: "सेल",
        q4o2: "बैटरी",
        q4o3: "विद्युत लैंप",
        q4o4: "स्विच",
        q5: "जोड़ने वाले तार क्या करते हैं?",
        q5o1: "बिजली संग्रहीत करते हैं",
        q5o2: "रोशनी उत्पन्न करते हैं",
        q5o3: "घटकों के बीच बिजली ले जाते हैं",
        q5o4: "बिजली को ON और OFF करते हैं",
        checkQuiz: "क्विज़ जमा करें",
      },
      ex1: {
        notLabeled: "उत्तर नहीं दिया",
      },
      summary: {
        title: "🎉 अभ्यास पूर्ण!",
        totalScore: "कुल स्कोर:",
        exercisesCompleted: "पूर्ण अभ्यास:",
        excellent: "उत्कृष्ट काम!",
        good: "अच्छा काम!",
        keepPracticing: "अभ्यास जारी रखें!",
        restart: "अभ्यास पुनः आरंभ करें",
        backToLearn: "सीखने के मोड पर वापस जाएं",
        scoreLine:
          "{correct, number} / {total, number} सही ({percentage, number}%)",
        exerciseCount:
          "{count, plural, one {{count} अभ्यास पूरा} other {{count} अभ्यास पूरे}}",
      },
    },
    realworld: {
      title: "वास्तविक दुनिया के अनुप्रयोग",
      tagline: "जानें कि बिजली हमारे दैनिक जीवन को कैसे शक्ति देती है",
      usageCategories: "बिजली उपयोग की श्रेणियाँ",
      keyFacts: "बिजली के मुख्य तथ्य",
      cooking: "खाना पकाना",
      lighting: "प्रकाश",
      transportation: "परिवहन",
      heating: "तापन और शीतलन",
      entertainment: "मनोरंजन",
      communication: "संचार",
      dc: {
        title: "प्रत्यक्ष धारा (DC)",
        desc: "बैटरियाँ DC बिजली देती हैं - धारा एक दिशा में बहती है। मोबाइल फोन, टॉर्च और इलेक्ट्रिक वाहनों में उपयोग होती है।",
      },
      ac: {
        title: "परिवर्ती धारा (AC)",
        desc: "दीवार के सॉकेट AC बिजली देते हैं - धारा दिशा बदलती है। घरों में अधिकांश उपकरणों और रोशनी के लिए उपयोग होती है।",
      },
      storage: {
        title: "ऊर्जा भंडारण",
        desc: "बैटरियाँ विद्युत ऊर्जा को रासायनिक रूप से संचित करती हैं, जिससे उपकरण प्लग के बिना चल सकते हैं।",
      },
      impact: {
        title: "वैश्विक प्रभाव",
        desc: "सौर और जलविद्युत जैसे नवीकरणीय स्रोत पर्यावरण की रक्षा में मदद करते हैं।",
      },
      desc: {
        cooking: "बिजली विभिन्न खाना पकाने के उपकरणों को चलाती है",
        lighting: "हमारे घरों और सड़कों को रोशन करती है",
        transportation: "इलेक्ट्रिक वाहन और सार्वजनिक परिवहन",
        heating: "इमारतों में जलवायु नियंत्रण",
        entertainment: "मनोरंजन उपकरणों को शक्ति देती है",
        communication: "दुनिया भर के लोगों को जोड़ती है",
      },
      example: {
        cooking: {
          stove: "इलेक्ट्रिक स्टोव",
          microwave: "माइक्रोवेव ओवन",
          kettle: "इलेक्ट्रिक केतली",
          toaster: "टोस्टर",
        },
        lighting: {
          bulbs: "LED बल्ब",
          street: "सड़क की लाइटें",
          flashlight: "टॉर्च",
          lamp: "लैंप",
        },
        transportation: {
          cars: "इलेक्ट्रिक कारें",
          trains: "ट्रेन",
          trams: "ट्राम",
          ebikes: "ई-बाइक",
        },
        heating: {
          ac: "एयर कंडीशनर",
          heater: "हीटर",
          blanket: "इलेक्ट्रिक कंबल",
          fan: "पंखे",
        },
        entertainment: {
          tv: "टेलीविजन",
          computer: "कंप्यूटर",
          console: "गेमिंग कंसोल",
          speakers: "स्पीकर्स",
        },
        communication: {
          phones: "मोबाइल फोन",
          router: "इंटरनेट राउटर",
          radio: "रेडियो",
          satellite: "सैटेलाइट",
        },
      },
      safety: {
        "1": "घरेलू बिजली से कभी प्रयोग न करें",
        "2": "केवल बैटरी/सेल से प्रयोग करें",
        "3": "गीले हाथों से स्विच न छुएं",
        "4": "क्षतिग्रस्त उपकरणों का उपयोग न करें",
        "5": "बिजली कार्य में हमेशा वयस्क की मदद लें",
        title: "सुरक्षा पहले!",
      },
      stats: {
        title: "स्थानीयकृत आँकड़े",
        households: "बिजली वाले घर",
        savings: "औसत मासिक बचत",
        updated: "{date} को अद्यतन",
      },
    },
    learn: {
      information: "जानकारी",
      headerTitle: "सुचालक और कुचालक",
      headerSubtitle:
        "वस्तुओं को गैप में खींचें और सर्किट पूरा करें। क्या बल्ब जलेगा?",
      circuitTestArea: "सर्किट परीक्षण क्षेत्र",
      hideCurrent: "करंट छिपाएँ",
      showCurrent: "करंट दिखाएँ",
      connectionMade: "कनेक्शन बना",
      dragObjectHere: "↓ वस्तु यहाँ खींचें ↓",
      predYesConduct: "हाँ, यह चालन करेगा!",
      predNoInsulator: "नहीं, यह कुचालक है",
      resultCorrect: "सही है!",
      notQuite: "❌ बिल्कुल नहीं!",
      explainerOnAlt:
        "यह इलेक्ट्रॉनों के प्रवाह की अनुमति देता है, इसलिए लूप बंद होता है और बल्ब जलता है! 💡",
      explainerOffAlt:
        "यह इलेक्ट्रॉनों के प्रवाह को रोकता है, इसलिए सर्किट टूटा रहता है और बल्ब नहीं जलता। 🚫",
      dragMaterialToTest:
        "👆 जाँच करने के लिए सामग्री को सर्किट गैप में खींचें!",
      materialsToTest: "जाँच के लिए सामग्री (गैप में खींचें)",
      cell: "सेल",
      bulb: "बल्ब",
      makePrediction: "अनुमान लगाएँ: क्या {{label}} सर्किट पूरा करेगा?",
      isAType: "{{label}} एक",
      materialInCircuit: "सर्किट में सामग्री:",
      type: "प्रकार:",
      conductor: "⚡ चालक",
      insulator: "🚫 कुचालक",
      bulbStatus: "बल्ब स्थिति:",
      onGlowing: "चालू (चमक रहा है ✨)",
      offNotGlowing: "बंद (चमक नहीं रहा)",
      isDescription: "है",
      explainerOn: " यह विद्युत धारा को गुजरने देता है, इसलिए बल्ब चमकता है!",
      explainerOff:
        " यह विद्युत धारा को गुजरने नहीं देता, इसलिए बल्ब बंद रहता है।",
      testResults: "परीक्षण परिणाम",
      material: "सामग्री",
      typeHeader: "प्रकार",
      bulbHeader: "बल्ब",
      clearResults: "परिणाम साफ करें",
      materialNames: {
        iron: "लोहे की छड़",
        copper: "तांबे की छड़",
        graphite: "पेंसिल ग्रेफाइट",
        wood: "लकड़ी",
        plastic: "प्लास्टिक",
        pencil: "पेंसिल",
        rubber: "रबर",
        glass: "कांच",
      },
      materialDescriptions: {
        iron: "एक धातु जो बिजली को प्रवाहित होने देती है",
        copper: "बिजली का एक उत्कृष्ट चालक",
        graphite: "पेंसिल में 'लीड', जो बिजली का संचालन करती है",
        wood: "एक प्राकृतिक सामग्री जो बिजली का संचालन नहीं करती",
        plastic: "एक सिंथेटिक सामग्री जो बिजली को अवरुद्ध करती है",
        pencil: "पेंसिल का लकड़ी का शरीर, जो बिजली का संचालन नहीं करता",
        rubber:
          "तारों को ढकने के लिए उपयोग किया जाता है क्योंकि यह बिजली को रोकता है",
        glass: "पारदर्शी सामग्री जो बिजली का संचालन नहीं करती",
      },
    },
    conductors: {
      intro: {
        title: "विषय 3.4: चालक और कुचालक",
        subtitle: "कौन सी सामग्री बिजली को गुजरने देती है? आइए पता करें! 🔬",
        discoverTitle: "आज हम क्या खोजेंगे",
        conductorsTitle: "⚡ चालक",
        conductorsDesc: "सामग्री जो बिजली को बहने देती है",
        insulatorsTitle: "🛡️ कुचालक",
        insulatorsDesc: "सामग्री जो बिजली को रोकती है",
        testingTitle: "🔬 परीक्षण",
        testingDesc: "सामग्री की पहचान के लिए टेस्टर का उपयोग करें",
        safetyTitle: "⚠️ सुरक्षा",
        safetyDesc: "कुचालक हमें क्यों बचाते हैं",
        startButton: "चलो खोजना शुरू करें!",
      },
      tester: {
        title: "⚡ चालकता टेस्टर",
        subtitle: "परीक्षण करें कि कौन सी सामग्री बिजली का संचालन करती है!",
        circuitSetup: "सर्किट सेटअप",
        materialsToTest: "परीक्षण करने के लिए सामग्री",
        conductors: "चालक",
        semiconductors: "अर्धचालक",
        insulators: "कुचालक",
        resetTest: "परीक्षण रीसेट करें",
        battery: "बैटरी",
        bulb: "बल्ब",
        probe1: "प्रोब 1",
        probe2: "प्रोब 2",
        currentFlow: "धारा प्रवाह →",
        return: "← वापसी",
        materialUnderTest: "← परीक्षण के तहत सामग्री →",
        conductorDetected: "✓ चालक का पता चला!",
        nonConductor: "✗ गैर-चालक (कुचालक)",
        materialType: "सामग्री प्रकार:",
        currentFlowLabel: "धारा प्रवाह:",
        bulbBrightness: "बल्ब चमक:",
        resistance: "प्रतिरोध:",
        howItWorks: "यह कैसे काम करता है",
        conductorsDesc:
          "सामग्री जो बिजली को आसानी से बहने देती है। तांबा, एल्यूमीनियम और लोहे जैसी धातुओं में मुक्त इलेक्ट्रॉन होते हैं जो सामग्री के माध्यम से चल सकते हैं, एक विद्युत धारा बनाते हैं।",
        semiconductorsDesc:
          "चालक और कुचालक के बीच चालकता वाली सामग्री। उदाहरणों में ग्रेफाइट और सिलिकॉन शामिल हैं। उनकी चालकता को नियंत्रित किया जा सकता है और इलेक्ट्रॉनिक्स में उपयोगी है।",
        insulatorsDesc:
          "सामग्री जो बिजली के प्रवाह का विरोध करती है। रबर, प्लास्टिक, लकड़ी और कांच में कसकर बंधे इलेक्ट्रॉन होते हैं जो आसानी से नहीं चलते, धारा प्रवाह को रोकते हैं और हमें सुरक्षित रखते हैं।",
        diagramTitle: "हमारा चालकता टेस्टर",
        cellLabel: "सेल (बैटरी)",
        wire1: "तार 1",
        wire2: "तार 2",
        wire3: "तार 3",
        lampOn: "⚡ चालू",
        lampOff: "○ बंद",
        freeEnd1: "मुक्त सिरा 1",
        freeEnd1Color: "(लाल)",
        freeEnd2: "मुक्त सिरा 2",
        freeEnd2Color: "(नीला)",
        testingArea: "परीक्षण क्षेत्र",
        currentFlowPath: "धारा प्रवाह पथ:",
        circuitComplete: "✓ परिपथ पूर्ण - धारा बह रही है!",
        testing: "परीक्षण कर रहे हैं...",
        placeMaterial: "↓ यहाँ सामग्री रखें ↓",
        touchInstructions1: "सामग्री के दोनों मुक्त सिरों को छुएं",
        touchInstructions2:
          "यह जांचने के लिए कि यह बिजली का संचालन करती है या नहीं",
        buildTitle: "टेस्टर कैसे बनाएं:",
        buildStep1:
          "तारों से एक <strong>सेल</strong> और एक <strong>लैंप</strong> जोड़ें",
        buildStep2: "<strong>दो तार के सिरे मुक्त</strong> छोड़ें (जुड़े नहीं)",
        buildStep3:
          "क्षण भर के लिए <strong>मुक्त सिरों को एक साथ छुएं</strong>",
        buildStep4: "यदि लैंप जलता है, तो <strong>टेस्टर तैयार है! ✓</strong>",
        howItWorksTitle: "✨ यह कैसे काम करता है:",
        howItWorksDesc:
          "जब हम किसी वस्तु को दोनों मुक्त तार सिरों से छूते हैं:",
        conductorResult: "यदि लैंप जलता है: वस्तु एक <strong>चालक</strong> है",
        insulatorResult:
          "यदि लैंप नहीं जलता: वस्तु एक <strong>कुचालक</strong> है",
        tipsTitle: "महत्वपूर्ण सुझाव:",
        tip1: "सुनिश्चित करें कि दो मुक्त तार एक दूसरे को न छुएं",
        tip2: "परीक्षण की जा रही वस्तु के दोनों सिरों को छुएं",
        tip3: "लैंप को देखने के लिए 1-2 सेकंड तक पकड़ें",
        back: "वापस",
        startTesting: "सामग्री का परीक्षण शुरू करें",
      },
      materials: {
        title: "🧪 आइए विभिन्न सामग्रियों का परीक्षण करें!",
        resetAll: "सभी रीसेट करें",
        testing: "परीक्षण कर रहे हैं...",
        lampGlows: "लैंप जल रहा है!",
        conductor: "✓ चालक",
        noGlow: "नहीं जला",
        insulator: "✗ कुचालक",
        progress: "प्रगति: {tested} / {total} परीक्षण किया गया",
        clickToTest: "परीक्षण करने के लिए किसी भी सामग्री पर क्लिक करें!",
        allTestedTitle: "🎉 सभी सामग्रियों का परीक्षण हो गया!",
        allTestedDesc:
          "बहुत बढ़िया! आपने {conductors} चालक और {insulators} कुचालक की पहचान की है।",
        conductorLabel: "चालक",
        insulatorLabel: "कुचालक",
        back: "वापस",
        seeResults: "परिणाम देखें और अधिक जानें",
        materialNames: {
          metalKey: "धातु की चाबी",
          plasticScale: "प्लास्टिक स्केल",
          coin: "सिक्का",
          rubberEraser: "रबर इरेज़र",
          glassBangle: "कांच का चूड़ा",
          ironNail: "लोहे की कील",
          woodenStick: "लकड़ी की छड़ी",
          aluminumFoil: "एल्यूमीनियम फॉइल",
          paperStrip: "कागज की पट्टी",
          copperWire: "तांबे का तार",
          cork: "कॉर्क",
          steelSpoon: "स्टील का चम्मच",
        },
        materialTypes: {
          metalIron: "धातु (लोहा)",
          plastic: "प्लास्टिक",
          metalCopper: "धातु (तांबा)",
          rubber: "रबर",
          glass: "कांच",
          wood: "लकड़ी",
          metalAluminum: "धातु (एल्यूमीनियम)",
          paper: "कागज",
          metalSteel: "धातु (स्टील)",
          cork: "कॉर्क",
        },
        materialDescriptions: {
          metalKey: "चाबियां लोहे या पीतल जैसी धातु से बनी होती हैं",
          plasticScale: "स्केल आमतौर पर प्लास्टिक से बने होते हैं",
          coin: "सिक्के तांबे, निकल या अन्य धातुओं से बने होते हैं",
          rubberEraser: "इरेज़र रबर सामग्री से बने होते हैं",
          glassBangle: "चूड़े कांच से बने हो सकते हैं",
          ironNail: "कीलें लोहे या स्टील से बनी होती हैं",
          woodenStick: "लकड़ी पेड़ों से आती है",
          aluminumFoil: "रसोई फॉइल एल्यूमीनियम से बनी होती है",
          paperStrip: "कागज लकड़ी के गूदे से बनता है",
          copperWire: "विद्युत तार आमतौर पर तांबे के होते हैं",
          cork: "कॉर्क पेड़ की छाल से आता है",
          steelSpoon: "चम्मच अक्सर स्टील से बने होते हैं",
          graphite: "मध्यम चालक, पेंसिल में उपयोग किया जाता है",
          saltWater: "घुली हुई नमक के कारण आयनिक चालक",
          plasticRuler: "कुचालक, बिजली के प्रवाह को अवरुद्ध करता है",
          glass: "उत्कृष्ट कुचालक",
        },
        testMaterialNames: {
          copperWire: "तांबे का तार",
          ironNail: "लोहे की कील",
          aluminumFoil: "एल्यूमीनियम फॉइल",
          graphite: "ग्रेफाइट (पेंसिल लीड)",
          saltWater: "नमक का पानी",
          plasticRuler: "प्लास्टिक स्केल",
          rubberEraser: "रबर इरेज़र",
          woodenStick: "लकड़ी की छड़ी",
          glass: "कांच",
          paper: "कागज",
        },
        testMaterialDescriptions: {
          copperWire: "विद्युत वायरिंग में उपयोग किया जाने वाला उत्कृष्ट चालक",
          ironNail: "अच्छा चालक, निर्माण में उपयोग किया जाता है",
          aluminumFoil: "पैकेजिंग में उपयोग किया जाने वाला हल्का चालक",
          graphite: "मध्यम चालक, पेंसिल में उपयोग किया जाता है",
          saltWater: "घुली हुई नमक के कारण आयनिक चालक",
          plasticRuler: "कुचालक, बिजली के प्रवाह को अवरुद्ध करता है",
          rubberEraser: "उत्कृष्ट कुचालक, सुरक्षा के लिए उपयोग किया जाता है",
          woodenStick: "सूखा होने पर खराब चालक",
          glass: "उत्कृष्ट कुचालक",
          paper: "सूखा होने पर कुचालक",
        },
      },
      results: {
        title: "📊 परीक्षण परिणाम: चालक बनाम कुचालक",
        conductorsTitle: "चालक",
        conductorsSubtitle: "लैंप जला ✓",
        conductorsDesc:
          "सामग्री जो बिजली को आसानी से <strong>बहने देती है</strong>।",
        insulatorsTitle: "कुचालक",
        insulatorsSubtitle: "लैंप नहीं जला ✗",
        insulatorsDesc: "सामग्री जो बिजली को <strong>बहने नहीं देती</strong>।",
        patternConductors: "पैटर्न: सभी <strong>धातुएं हैं!</strong> 🔑",
        patternInsulators:
          "पैटर्न: <strong>अधातु!</strong> (प्लास्टिक, रबर, लकड़ी, कांच, आदि) 🛡️",
        discoveriesTitle: "मुख्य खोजें:",
        conductorsListTitle: "✓ चालक (धातु):",
        conductorsList1: "• लोहा, तांबा, एल्यूमीनियम",
        conductorsList2: "• स्टील, पीतल, चांदी, सोना",
        conductorsList3: "• सभी धातुएं बिजली का संचालन करती हैं",
        insulatorsListTitle: "✗ कुचालक (अधातु):",
        insulatorsList1: "• प्लास्टिक, रबर, कांच",
        insulatorsList2: "• लकड़ी, कागज, कॉर्क",
        insulatorsList3: "• अधिकांश अधातु कुचालक होते हैं",
        backToTesting: "परीक्षण पर वापस",
        learnMoreConductors: "चालक के बारे में अधिक जानें",
      },
      conductorsDetail: {
        title: "⚡ चालक के बारे में सब कुछ",
        content: "विस्तृत चालक जानकारी...",
        next: "अगला: कुचालक",
      },
      insulatorsDetail: {
        title: "🛡️ कुचालक के बारे में सब कुछ",
        content: "विस्तृत कुचालक जानकारी...",
        next: "अगला: सुरक्षा",
      },
      safetyDetail: {
        title: "⚠️ सुरक्षा नियम",
        content: "सुरक्षा जानकारी...",
        next: "अगला: अनुप्रयोग",
      },
      applicationsDetail: {
        title: "🔌 वास्तविक दुनिया के अनुप्रयोग",
        intro:
          "चालक और कुचालक हमारे दैनिक जीवन में आवश्यक हैं। आइए देखें कि वे वास्तविक दुनिया के अनुप्रयोगों में कैसे उपयोग किए जाते हैं!",
        conductorsTitle: "दैनिक जीवन में चालक",
        insulatorsTitle: "दैनिक जीवन में कुचालक",
        conductor1: {
          title: "विद्युत वायरिंग",
          desc: "तांबे और एल्यूमीनियम के तार हमारे घरों में बिजली को सुरक्षित रूप से ले जाते हैं, रोशनी, उपकरणों और उपकरणों को बिजली प्रदान करते हैं।",
        },
        conductor2: {
          title: "लाइट बल्ब",
          desc: "बल्बों के अंदर धातु के तंतु प्रकाश उत्पन्न करने के लिए बिजली का संचालन करते हैं। जब धारा इससे गुजरती है तो तंतु चमकता है।",
        },
        conductor3: {
          title: "इलेक्ट्रॉनिक उपकरण",
          desc: "सर्किट बोर्ड फोन, कंप्यूटर और टैबलेट में घटकों को जोड़ने के लिए तांबे के ट्रैक का उपयोग करते हैं, जिससे वे कार्य कर सकें।",
        },
        conductor4: {
          title: "इलेक्ट्रिक वाहन",
          desc: "बैटरी और मोटर इलेक्ट्रिक कारों, बसों और बाइक को बिजली देने के लिए धातु चालकों का उपयोग करती हैं, परिवहन को स्वच्छ बनाती हैं।",
        },
        conductor5: {
          title: "बिजली संचरण",
          desc: "उच्च वोल्टेज बिजली लाइनें बिजली संयंत्रों से शहरों तक बिजली ले जाने के लिए एल्यूमीनियम और स्टील चालकों का उपयोग करती हैं।",
        },
        insulator1: {
          title: "सुरक्षा उपकरण",
          desc: "रबर के दस्ताने, जूते और चटाई बिजली के झटके से बिजलीविदों की रक्षा करती हैं, धारा को उनके शरीर से गुजरने से रोकती हैं।",
        },
        insulator2: {
          title: "तार कोटिंग",
          desc: "विद्युत तारों पर प्लास्टिक या रबर कोटिंग शॉर्ट सर्किट को रोकती है और हमें लाइव तारों को छूने से बचाती है।",
        },
        insulator3: {
          title: "निर्माण सामग्री",
          desc: "लकड़ी, कांच और प्लास्टिक का उपयोग निर्माण में विद्युत दुर्घटनाओं को रोकने और संरचनात्मक सहायता प्रदान करने के लिए किया जाता है।",
        },
        insulator4: {
          title: "सुरक्षात्मक गियर",
          desc: "उपकरणों और उपकरणों में अवरोधक सामग्री विद्युत प्रणालियों और उपकरणों को संभालते समय श्रमिकों को सुरक्षित रखती है।",
        },
        insulator5: {
          title: "पैकेजिंग और भंडारण",
          desc: "प्लास्टिक और कार्डबोर्ड कंटेनर इलेक्ट्रॉनिक उपकरणों को सुरक्षित रूप से संग्रहीत करते हैं, स्थैतिक बिजली और क्षति को रोकते हैं।",
        },
        keyTakeaways: "मुख्य बातें",
        takeaway1:
          "चालक बिजली को बहने देते हैं, जिससे वे उपकरणों को बिजली देने और ऊर्जा संचारित करने के लिए आवश्यक हो जाते हैं।",
        takeaway2:
          "कुचालक बिजली को बहने से रोकते हैं, बिजली के झटके से हमारी रक्षा करते हैं और दुर्घटनाओं को रोकते हैं।",
        takeaway3:
          "चालक और कुचालक दोनों मिलकर हमारे दैनिक जीवन में विद्युत प्रणालियों को सुरक्षित और कार्यात्मक बनाते हैं।",
        back: "टेस्टर पर वापस",
      },
      quiz: {
        title: "📝 क्विज़ समय!",
        content: "क्विज़ सामग्री...",
      },
    },
  },
};
export default translations;


export type Language = 'en' | 'hi' | 'gu';
export type Mode = 'demonstration' | 'practice' | 'assessment' | 'mixed';
export type StepType = 'explanation' | 'visualization' | 'interaction' | 'assessment';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Circuit component types
export interface CircuitComponent {
  id: string;
  type: 'cell' | 'battery' | 'lamp' | 'led' | 'switch' | 'wire' | 'conductor' | 'insulator';
  position: { x: number; y: number };
  connections: string[]; // IDs of connected components
  state?: 'on' | 'off' | 'open' | 'closed';
  polarity?: 'correct' | 'incorrect' | 'neutral';
}


export interface DemonstrationStep {
  step_number: number;
  title: string;
  description: string;
  type: StepType;
  visual_state: {
    components: CircuitComponent[];
    circuit_complete: boolean;
    current_flowing: boolean;
  };
  interactions?: {
    type: 'click' | 'drag' | 'input' | 'select';
    target: string;
    expectedValue?: any;
    hint?: string;
  }[];
  completion_criteria?: {
    type: 'automatic' | 'user_confirm' | 'assessment';
    condition?: any;
  };
  learning_notes?: string;
  common_mistakes?: string[];
}
export interface PracticeExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  problem_data: {
    circuit_setup: CircuitComponent[];
    question_type: 'build_circuit' | 'identify_component' | 'test_conductor' | 'troubleshoot';
    correct_solution: any;
  };
  solution: {
    correct_answer: any;
    solution_steps?: any[];
    multiple_solutions?: boolean;
  };
  interaction_config: {
    input_methods: string[];
    max_attempts?: number;
    hint_system?: boolean;
    progressive_hints?: string[];
  };
  assessment: {
    accuracy_weight: number;
    time_weight?: number;
    attempt_weight?: number;
  };
}

// Tool data from backend
export interface CircuitToolData {
  tool_type: string;
  session_id: string;
  mode: Mode;
  demonstration?: {
    steps: DemonstrationStep[];
    auto_progression: boolean;
    step_duration: number;
  };
  practice?: {
    exercises: PracticeExercise[];
    session_config: {
      max_exercises: number;
      difficulty_adaptation: boolean;
      immediate_feedback: boolean;
    };
  };
  student_context: {
    current_level: string;
    learning_preferences: string[];
    previous_performance?: {
      accuracy: number;
      avg_time: number;
      completed_exercises: number;
    };
  };
  metadata: {
    learning_objectives: string[];
    estimated_duration: number;
    prerequisite_skills: string[];
    difficulty_level: string;
  };
}

// UI Configuration
export interface CircuitUIConfig {
  theme: 'light' | 'dark' | 'modern' | 'playful';
  layout: 'standard' | 'compact' | 'immersive';
  auto_play: boolean;
  step_duration: number;
  show_controls: boolean;
  show_progress: boolean;
  hint_system: boolean;
  progressive_difficulty: boolean;
  immediate_feedback: boolean;
  celebration_animations: boolean;
  high_contrast: boolean;
  large_text: boolean;
  keyboard_navigation: boolean;
  screen_reader_support: boolean;
}

// Component props interface
export interface CircuitToolProps {
  data: CircuitToolData;
  title: string;
  ui_config: CircuitUIConfig;
  onStepChange?: (stepIndex: number, stepData: DemonstrationStep) => void;
  onPracticeComplete?: (results: PracticeResults) => void;
  onAssessmentSubmit?: (assessment: AssessmentData) => void;
  onProgress?: (progress: ProgressData) => void;
  onInterrupt?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  currentStep?: number;
  isInterrupted?: boolean;
}

// Practice results tracking
export interface PracticeResults {
  exercise_id: string;
  student_answer: any;
  correct_answer: any;
  is_correct: boolean;
  attempts: number;
  time_taken: number;
  hints_used: number;
  confidence_level?: number;
  feedback: string;
}

// Assessment data
export interface AssessmentData {
  overall_score: number;
  accuracy: number;
  speed_score: number;
  understanding_indicators: {
    concept: string;
    mastery_level: number;
  }[];
  recommendations: string[];
}

// Progress tracking
export interface ProgressData {
  current_step: number;
  total_steps: number;
  completion_percentage: number;
  time_spent: number;
  exercises_completed: number;
  current_difficulty: string;
  mastery_indicators: {
    skill: string;
    level: number;
  }[];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format a number according to the current locale
 */
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Format a date according to the current locale
 */
export const formatDate = (date: Date | number | string, options?: Intl.DateTimeFormatOptions): string => {
  const locale = i18n.language || 'en';
  const dateObj = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format currency according to the current locale
 */
export const formatCurrency = (value: number, currency: string = 'INR', options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    ...options,
  }).format(value / 100);
};

// Lightweight Intl formatting helpers bound to the current i18n language
export function intlFormatDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(i18n.language, options).format(d);
}

export function intlFormatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(i18n.language, options).format(value);
}

export function intlFormatCurrency(
  value: number,
  currency: string = 'INR',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(i18n.language, { style: 'currency', currency, ...options }).format(value);
}

// ============================================================================
// CONTEXT PROVIDERS
// ============================================================================

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const initialLanguage = (i18n.language?.split('-')[0] as Language) || 'en';
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const base = (lng?.split('-')[0] as Language) || 'en';
      setLanguageState(base);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
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

type ModeType = 'demonstration' | 'practice';

interface ModeContextType {
  currentMode: ModeType;
  setCurrentMode: (mode: ModeType) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<ModeType>('demonstration');

  return (
    <ModeContext.Provider value={{ currentMode, setCurrentMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
};

// ============================================================================
// COMPONENTS
// ============================================================================

// LanguageSelector Component
export const LanguageSelector: React.FC = () => {
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
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-4 py-2 pr-8 w-48 text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="fill-current h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// Navbar Component
export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { currentMode, setCurrentMode } = useMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isApplicationsPage = location.pathname === '/applications';

  const handleModeClick = (mode: 'demonstration' | 'practice') => {
    if (isHomePage) {
      setCurrentMode(mode);
    } else {
      navigate('/');
      // Use setTimeout to ensure navigation happens before mode change
      setTimeout(() => setCurrentMode(mode), 0);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              ⚡ {t('nav.logo')}
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Learn Button */}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick('demonstration')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentMode === 'demonstration'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-teal-700 hover:bg-teal-100/50'
                }`}
              >
                📚 {t('nav.learn')}
              </button>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 rounded-lg font-medium text-teal-700 hover:bg-teal-100/50 transition-all duration-200"
              >
                📚 {t('nav.learn')}
              </Link>
            )}

            {/* Practice Button */}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick('practice')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentMode === 'practice'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100/50'
                }`}
              >
                🎯 {t('nav.practice')}
              </button>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 rounded-lg font-medium text-purple-700 hover:bg-purple-100/50 transition-all duration-200"
              >
                🎯 {t('nav.practice')}
              </Link>
            )}

            {/* Real World Applications Link */}
            <Link
              to="/applications"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isApplicationsPage
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              🌍 {t('nav.applications')}
            </Link>

            {/* Language Selector */}
            <div className="ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// RealWorldApplications Component
export const RealWorldApplications: React.FC = () => {
  const { t } = useLanguage();

  const applicationCards = [
    {
      id: 'cooking',
      icon: '🍳',
      title: t('realworld.cooking'),
      description: t('realworld.desc.cooking'),
      examples: [
        t('realworld.example.cooking.stove'),
        t('realworld.example.cooking.microwave'),
        t('realworld.example.cooking.kettle'),
        t('realworld.example.cooking.toaster'),
      ],
      color: 'from-orange-400 to-red-500',
    },
    {
      id: 'lighting',
      icon: '💡',
      title: t('realworld.lighting'),
      description: t('realworld.desc.lighting'),
      examples: [
        t('realworld.example.lighting.bulbs'),
        t('realworld.example.lighting.street'),
        t('realworld.example.lighting.flashlight'),
        t('realworld.example.lighting.lamp'),
      ],
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'transportation',
      icon: '🚗',
      title: t('realworld.transportation'),
      description: t('realworld.desc.transportation'),
      examples: [
        t('realworld.example.transportation.cars'),
        t('realworld.example.transportation.trains'),
        t('realworld.example.transportation.trams'),
        t('realworld.example.transportation.ebikes'),
      ],
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 'heating',
      icon: '❄️',
      title: t('realworld.heating'),
      description: t('realworld.desc.heating'),
      examples: [
        t('realworld.example.heating.ac'),
        t('realworld.example.heating.heater'),
        t('realworld.example.heating.blanket'),
        t('realworld.example.heating.fan'),
      ],
      color: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'entertainment',
      icon: '📺',
      title: t('realworld.entertainment'),
      description: t('realworld.desc.entertainment'),
      examples: [
        t('realworld.example.entertainment.tv'),
        t('realworld.example.entertainment.computer'),
        t('realworld.example.entertainment.console'),
        t('realworld.example.entertainment.speakers'),
      ],
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'communication',
      icon: '📱',
      title: t('realworld.communication'),
      description: t('realworld.desc.communication'),
      examples: [
        t('realworld.example.communication.phones'),
        t('realworld.example.communication.router'),
        t('realworld.example.communication.radio'),
        t('realworld.example.communication.satellite'),
      ],
      color: 'from-teal-400 to-green-500',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {applicationCards.map((app, index) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`bg-gradient-to-r ${app.color} p-6 text-center`}>
                <div className="text-6xl mb-2">{app.icon}</div>
                <h2 className="text-2xl font-bold text-white">{app.title}</h2>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{app.description}</p>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('common.examples')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {app.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// TorchlightLearning Component (ConductorInsulatorSimulation)
type MaterialType = "conductor" | "insulator";

interface Material {
  id: string;
  label: string;
  type: MaterialType;
  color: string;
  description: string;
}

interface Position {
  x: number;
  y: number;
}

// Material definitions with realistic colors
const materials: Material[] = [
  { id: "iron", label: "Iron rod", type: "conductor", color: "#333333", description: "a metal that allows electricity to flow through it" },
  { id: "copper", label: "Copper rod", type: "conductor", color: "#C98A5A", description: "an excellent conductor of electricity" },
  { id: "graphite", label: "Pencil graphite", type: "conductor", color: "#808080", description: "the 'lead' in pencils, which conducts electricity" },
  { id: "wood", label: "Wood", type: "insulator", color: "#8B5A2B", description: "a natural material that does not conduct electricity" },
  { id: "plastic", label: "Plastic", type: "insulator", color: "#1E90FF", description: "a synthetic material that blocks electricity" },
  { id: "pencil", label: "Pencil", type: "insulator", color: "#FF3333", description: "the wooden body of a pencil, which does not conduct electricity" },
  { id: "rubber", label: "Rubber", type: "insulator", color: "#FF69B4", description: "used to cover wires because it stops electricity" },
  { id: "glass", label: "Glass", type: "insulator", color: "#87CEEB", description: "transparent material that does not conduct electricity" }
];

const GAP_POSITION = { x: 230, y: 150 };
const SNAP_DISTANCE = 40;

export const TorchlightLearning: React.FC = () => {
  const { t } = useLanguage();
  
  // State for material positions - initialized near the circuit gap
  const [materialPositions, setMaterialPositions] = useState<Record<string, Position>>(() => {
    const positions: Record<string, Position> = {};
    materials.forEach((material, index) => {
      // Arrange materials in two rows below the gap
      const row = Math.floor(index / 4);
      const col = index % 4;
      positions[material.id] = {
        x: 120 + col * 80,
        y: 270 + row * 50
      };
    });
    return positions;
  });

  const [draggedMaterial, setDraggedMaterial] = useState<Material | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [materialInGap, setMaterialInGap] = useState<Material | null>(null);
  const [prediction, setPrediction] = useState<MaterialType | null>(null);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [testedMaterials, setTestedMaterials] = useState<Material[]>([]);
  const [showCurrentFlow, setShowCurrentFlow] = useState<boolean>(true);
  const [nearGap, setNearGap] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const isBulbOn = materialInGap?.type === "conductor";

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = useCallback((clientX: number, clientY: number): Position => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;

    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return { x: 0, y: 0 };

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(screenCTM.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  // Check if position is near the gap
  const isNearGap = useCallback((x: number, y: number): boolean => {
    const distance = Math.sqrt(
      Math.pow(x - GAP_POSITION.x, 2) + Math.pow(y - GAP_POSITION.y, 2)
    );
    return distance < SNAP_DISTANCE;
  }, []);

  // Handle mouse down on material
  const handleMouseDown = useCallback((e: React.MouseEvent, material: Material) => {
    e.preventDefault();
    const svgCoords = screenToSVG(e.clientX, e.clientY);
    const pos = materialPositions[material.id];
    setDraggedMaterial(material);
    setDragOffset({
      x: svgCoords.x - pos.x,
      y: svgCoords.y - pos.y
    });
  }, [materialPositions, screenToSVG]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedMaterial) return;
    e.preventDefault();

    const svgCoords = screenToSVG(e.clientX, e.clientY);
    const newX = svgCoords.x - dragOffset.x;
    const newY = svgCoords.y - dragOffset.y;

    // Constrain within circuit area (with some padding)
    const constrainedX = Math.max(50, Math.min(450, newX));
    const constrainedY = Math.max(50, Math.min(370, newY));

    setMaterialPositions(prev => ({
      ...prev,
      [draggedMaterial.id]: { x: constrainedX, y: constrainedY }
    }));

    // Check if near gap for visual feedback
    setNearGap(isNearGap(constrainedX, constrainedY));
  }, [draggedMaterial, dragOffset, isNearGap, screenToSVG]);

  // Handle mouse up
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!draggedMaterial) return;
    e.preventDefault();

    const pos = materialPositions[draggedMaterial.id];

    // Check if should snap to gap
    if (isNearGap(pos.x, pos.y)) {
      // Snap to gap position
      setMaterialPositions(prev => ({
        ...prev,
        [draggedMaterial.id]: { x: GAP_POSITION.x, y: GAP_POSITION.y }
      }));

      // Set as active material in circuit
      if (materialInGap && materialInGap.id !== draggedMaterial.id) {
        // Move previous material away from gap
        setMaterialPositions(prev => ({
          ...prev,
          [materialInGap.id]: { x: prev[materialInGap.id].x + 60, y: prev[materialInGap.id].y + 40 }
        }));
      }

      setMaterialInGap(draggedMaterial);
      setPrediction(null);
      setShowPrediction(false);

      // Add to tested materials
      if (!testedMaterials.find(m => m.id === draggedMaterial.id)) {
        setTestedMaterials(prev => [...prev, draggedMaterial]);
      }
    } else {
      // If material was in gap and dragged away, remove it from circuit
      if (materialInGap && materialInGap.id === draggedMaterial.id) {
        setMaterialInGap(null);
        setPrediction(null);
        setShowPrediction(false);
      }
    }

    setDraggedMaterial(null);
    setNearGap(false);
  }, [draggedMaterial, materialPositions, isNearGap, materialInGap, testedMaterials]);

  useEffect(() => {
    if (draggedMaterial) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedMaterial, handleMouseMove, handleMouseUp]);

  const handlePrediction = (predictedType: MaterialType) => {
    if (!materialInGap) return;
    setPrediction(predictedType);
    setShowPrediction(true);
  };

  const resetSimulation = () => {
    // Reset all material positions to initial state
    const positions: Record<string, Position> = {};
    materials.forEach((material, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      positions[material.id] = {
        x: 120 + col * 80,
        y: 270 + row * 50
      };
    });
    setMaterialPositions(positions);
    setMaterialInGap(null);
    setPrediction(null);
    setShowPrediction(false);
    setDraggedMaterial(null);
    setTestedMaterials([]);
  };

  const isPredictionCorrect = prediction === materialInGap?.type;

  // Localization helpers for material labels/descriptions
  const getMat = useCallback((id: string) => materials.find(m => m.id === id)!, []);
  const getMatLabel = useCallback((id: string) => {
    const base = getMat(id);
    return t(`learn.materialNames.${id}`, { defaultValue: base.label });
  }, [getMat, t]);
  const getMatDescription = useCallback((id: string) => {
    const base = getMat(id);
    return t(`learn.materialDescriptions.${id}`, { defaultValue: base.description });
  }, [getMat, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circuit Visualization */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-900">{t('learn.circuitTestArea', { defaultValue: 'Circuit Test Area' })}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCurrentFlow(!showCurrentFlow)}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  {showCurrentFlow
                    ? t('learn.hideCurrent', { defaultValue: 'Hide Current' })
                    : t('learn.showCurrent', { defaultValue: 'Show Current' })}
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {t('common.reset', { defaultValue: 'Reset' })}
                </button>
              </div>
            </div>

            {/* Circuit SVG */}
            <svg
              ref={svgRef}
              viewBox="0 0 500 370"
              className="w-full border-2 border-gray-200 rounded-lg bg-gray-50"
              style={{ cursor: draggedMaterial ? 'grabbing' : 'default' }}
            >
              {/* Battery */}
              <g transform="translate(80, 150)">
                <defs>
                  <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#2c3e50', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#34495e', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="-15" y="-35" width="30" height="70" rx="3" fill="url(#batteryGrad)" stroke="#1a252f" strokeWidth="2" />
                <rect x="-5" y="-42" width="10" height="7" rx="1" fill="#c0c0c0" stroke="#888" strokeWidth="1" />
                <text x="-15" y="-48" fontSize="16" fill="#e74c3c" fontWeight="bold" textAnchor="middle">+</text>
                <text x="-15" y="55" fontSize="16" fill="#3498db" fontWeight="bold" textAnchor="middle">−</text>
                <rect x="-8" y="-15" width="16" height="8" fill="#3498db" opacity="0.6" rx="1" />
                <rect x="-8" y="7" width="16" height="8" fill="#e74c3c" opacity="0.6" rx="1" />
                
                {/* Connection terminals */}
                <circle cx="0" cy="-35" r="3" fill="#D4AF37" stroke="#B87333" strokeWidth="1" />
                <circle cx="0" cy="35" r="3" fill="#D4AF37" stroke="#B87333" strokeWidth="1" />
              </g>

              {/* Wire from battery negative terminal to gap (bottom-left side) */}
              <line x1="80" y1="185" x2="80" y2="220" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="185" x2="80" y2="220" stroke="#D4AF37" strokeWidth="2" />
              <line x1="80" y1="220" x2="180" y2="220" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="220" x2="180" y2="220" stroke="#D4AF37" strokeWidth="2" />
              <line x1="180" y1="220" x2="180" y2="150" stroke="#B87333" strokeWidth="4" />
              <line x1="180" y1="220" x2="180" y2="150" stroke="#D4AF37" strokeWidth="2" />

              {/* Left terminal of gap */}
              <circle cx="180" cy="150" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="2" />

              {/* Gap area with snap highlight */}
              <circle
                cx={GAP_POSITION.x}
                cy={GAP_POSITION.y}
                r={SNAP_DISTANCE}
                fill={nearGap ? "#4caf50" : "transparent"}
                opacity="0.1"
                stroke={nearGap ? "#4caf50" : "#ddd"}
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Right terminal of gap */}
              <circle cx="280" cy="150" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="2" />

              {/* Wire from gap to bulb */}
              <line x1="280" y1="150" x2="360" y2="150" stroke="#B87333" strokeWidth="4" />
              <line x1="280" y1="150" x2="360" y2="150" stroke="#D4AF37" strokeWidth="2" />
              <line x1="360" y1="150" x2="360" y2="80" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="150" x2="360" y2="80" stroke="#D4AF37" strokeWidth="2" />

              {/* Bulb */}
              <g transform="translate(360, 80)">
                <defs>
                  <radialGradient id="bulbGrad">
                    <stop offset="0%" style={{ stopColor: isBulbOn ? '#FFFF00' : '#E0E0E0', stopOpacity: 1 }} />
                    <stop offset="70%" style={{ stopColor: isBulbOn ? '#FFA500' : '#C0C0C0', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: isBulbOn ? '#FF8C00' : '#A0A0A0', stopOpacity: 1 }} />
                  </radialGradient>
                </defs>

                {isBulbOn && (
                  <>
                    <circle cx="0" cy="0" r="35" fill="yellow" opacity="0.2" />
                    <circle cx="0" cy="0" r="40" fill="yellow" opacity="0.1" />
                    <circle cx="0" cy="0" r="45" fill="yellow" opacity="0.05" />
                  </>
                )}

                <circle cx="0" cy="0" r="25" fill="url(#bulbGrad)" stroke="#555" strokeWidth="2" />
                <path
                  d="M -8,-8 L -4,-4 L -8,0 L -4,4 L -8,8 M 8,-8 L 4,-4 L 8,0 L 4,4 L 8,8 M -4,-4 L 4,-4 M -4,4 L 4,4"
                  stroke={isBulbOn ? "#FF4500" : "#666"}
                  strokeWidth="2"
                  fill="none"
                />
                <rect x="-8" y="20" width="16" height="3" fill="#A0A0A0" />
                <rect x="-8" y="23" width="16" height="2" fill="#888" />
                <rect x="-8" y="25" width="16" height="3" fill="#A0A0A0" />
                <rect x="-6" y="28" width="12" height="4" fill="#777" />
              </g>

              {/* Wire from bulb back to battery positive terminal */}
              <line x1="360" y1="55" x2="360" y2="30" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="55" x2="360" y2="30" stroke="#D4AF37" strokeWidth="2" />
              <line x1="360" y1="30" x2="80" y2="30" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="30" x2="80" y2="30" stroke="#D4AF37" strokeWidth="2" />
              <line x1="80" y1="30" x2="80" y2="115" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="30" x2="80" y2="115" stroke="#D4AF37" strokeWidth="2" />

              {/* Current flow animation */}
              {isBulbOn && showCurrentFlow && (
                <>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M80,115 L80,30 L360,30 L360,55" />
                  </circle>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M360,80 L360,150 L280,150" />
                  </circle>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="2s" path="M180,150 L180,220 L80,220 L80,185" />
                  </circle>
                </>
              )}

              {/* Labels */}
              <text x="50" y="150" fontSize="13" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('learn.cell', { defaultValue: 'Cell' })}</text>
              <text x="360" y="15" fontSize="13" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('learn.bulb', { defaultValue: 'Bulb' })}</text>
              <text x="230" y="175" fontSize="11" fill="#666" textAnchor="middle" fontStyle="italic">
                {materialInGap
                  ? t('learn.connectionMade', { defaultValue: 'Connection Made' })
                  : t('learn.dragObjectHere', { defaultValue: '↓ Drag Object Here ↓' })}
              </text>

              {/* Instruction text */}
              <text x="250" y="245" fontSize="12" fill="#555" textAnchor="middle" fontWeight="bold">
                {t('learn.materialsToTest', { defaultValue: 'Materials to Test (Drag into circuit gap)' })}
              </text>

              {/* Draggable materials */}
              {materials.map((material) => {
                const pos = materialPositions[material.id];
                const isInGap = materialInGap?.id === material.id;
                const isDragging = draggedMaterial?.id === material.id;
                const localizedLabel = getMatLabel(material.id);

                return (
                  <g
                    key={material.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={(e) => handleMouseDown(e, material)}
                    opacity={isDragging ? 0.7 : 1}
                  >
                    <defs>
                      <linearGradient id={`materialGrad-${material.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: material.color, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: material.color, stopOpacity: 0.7 }} />
                      </linearGradient>
                    </defs>

                    {/* Material body */}
                    <rect
                      x="-30"
                      y="-12"
                      width="60"
                      height="24"
                      rx="3"
                      fill={`url(#materialGrad-${material.id})`}
                      stroke={isInGap ? "#4caf50" : "#333"}
                      strokeWidth={isInGap ? "3" : "2"}
                    />

                    {/* Highlight effect */}
                    <rect
                      x="-26"
                      y="-9"
                      width="18"
                      height="6"
                      rx="2"
                      fill="white"
                      opacity="0.4"
                    />

                    {/* Label */}
                    <text
                      x="0"
                      y="3"
                      fontSize="8"
                      fill="white"
                      textAnchor="middle"
                      fontWeight="bold"
                      style={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        pointerEvents: 'none'
                      }}
                    >
                      {localizedLabel.length > 10 ? localizedLabel.substring(0, 9) + '...' : localizedLabel}
                    </text>

                    {/* Connection indicator when in gap */}
                    {isInGap && (
                      <>
                        <line x1="-30" y1="0" x2="-50" y2="0" stroke="#4caf50" strokeWidth="3" />
                        <line x1="30" y1="0" x2="50" y2="0" stroke="#4caf50" strokeWidth="3" />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Prediction Section */}
            {materialInGap && !showPrediction && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900 mb-3">
                  {t('learn.makePrediction', { defaultValue: 'Make a Prediction: Will the' })} {getMatLabel(materialInGap.id)} {t('learn.completeCircuit', { defaultValue: 'complete the circuit?' })}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePrediction("conductor")}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                  >
                    {t('learn.predYesConduct', { defaultValue: 'Yes, it will conduct!' })}
                  </button>
                  <button
                    onClick={() => handlePrediction("insulator")}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                  >
                    {t('learn.predNoInsulator', { defaultValue: "No, it's an insulator" })}
                  </button>
                </div>
              </div>
            )}

            {/* Prediction Result */}
            {materialInGap && showPrediction && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${isPredictionCorrect
                  ? 'bg-green-50 border-green-400'
                  : 'bg-red-50 border-red-400'
                }`}>
                <p className="font-bold text-lg mb-2">
                  {isPredictionCorrect
                    ? t('learn.resultCorrect', { defaultValue: "That's Correct!" })
                    : t('learn.notQuite', { defaultValue: '❌ Not quite!' })}
                </p>
                <p className="text-sm">
                  {materialInGap && (
                    <>
                      {getMatLabel(materialInGap.id)} {t('learn.isAType', { defaultValue: 'is a' })} <strong>{materialInGap.type}</strong>. {getMatDescription(materialInGap.id)}
                      <br />
                      {isPredictionCorrect
                        ? t('learn.explainerOnAlt', { defaultValue: 'Because it allows electrons to flow, the loop is closed and the bulb lights up! 💡' })
                        : t('learn.explainerOffAlt', { defaultValue: 'Because it blocks electron flow, the circuit remains broken and the bulb stays off. 🚫' })}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Info size={20} />
                {t('learn.information', { defaultValue: 'Information' })}
              </h2>

              {materialInGap ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.materialInCircuit', { defaultValue: 'Material in Circuit:' })}</p>
                    <p className="font-bold text-lg text-indigo-900">{getMatLabel(materialInGap.id)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.type', { defaultValue: 'Type:' })}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${materialInGap.type === "conductor"
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {materialInGap.type === "conductor"
                        ? t('learn.conductor', { defaultValue: '⚡ Conductor' })
                        : t('learn.insulator', { defaultValue: '🚫 Insulator' })}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.bulbStatus', { defaultValue: 'Bulb Status:' })}</p>
                    <div className="flex items-center gap-2">
                      <Lightbulb size={20} className={isBulbOn ? "text-yellow-500" : "text-gray-400"} />
                      <span className={`font-semibold ${isBulbOn ? "text-green-600" : "text-gray-500"}`}>
                        {isBulbOn
                          ? t('learn.onGlowing', { defaultValue: 'ON (Glowing ✨)' })
                          : t('learn.offNotGlowing', { defaultValue: 'OFF (Not glowing)' })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>{getMatLabel(materialInGap.id)}</strong> {t('learn.isDescription', { defaultValue: 'is' })} {getMatDescription(materialInGap.id)}.
                      {isBulbOn
                        ? t('learn.explainerOn', { defaultValue: ' It allows electric current to pass through, so the bulb glows!' })
                        : t('learn.explainerOff', { defaultValue: ' It does not allow electric current to pass through, so the bulb stays off.' })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  {t('learn.dragMaterialToTest', { defaultValue: '👆 Drag a material into the circuit gap to test if it conducts electricity!' })}
                </p>
              )}
            </div>

            {/* Tested Materials Table */}
            {testedMaterials.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">{t('learn.testResults', { defaultValue: 'Test Results' })}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-2 px-2">{t('learn.material', { defaultValue: 'Material' })}</th>
                        <th className="text-center py-2 px-2">{t('learn.typeHeader', { defaultValue: 'Type' })}</th>
                        <th className="text-center py-2 px-2">{t('learn.bulbHeader', { defaultValue: 'Bulb' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testedMaterials.map((material) => (
                        <tr key={material.id} className="border-b border-gray-100">
                          <td className="py-2 px-2">{getMatLabel(material.id)}</td>
                          <td className="text-center py-2 px-2">
                            <span className={`text-xs px-2 py-1 rounded ${material.type === "conductor" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                              {material.type === "conductor" ? "C" : "I"}
                            </span>
                          </td>
                          <td className="text-center py-2 px-2">
                            {material.type === "conductor" ? "✓" : "✗"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => setTestedMaterials([])}
                  className="mt-3 w-full py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                >
                  {t('learn.clearResults', { defaultValue: 'Clear Results' })}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// TorchlightPractice Component
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

export const TorchlightPractice: React.FC = () => {
  const { t, language } = useLanguage();
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
        english: ['Because they are cheap', 'Because they are good conductors', 'Because they are colorful', 'Because they are light'],
        hindi: ['क्योंकि वे सस्ते हैं', 'क्योंकि वे अच्छे सुचालक हैं', 'क्योंकि वे रंगीन हैं', 'क्योंकि वे हल्के हैं'],
        gujarati: ['કારણ કે તેઓ સસ્તા છે', 'કારણ કે તેઓ સારા સુવાહક છે', 'કારણ કે તેઓ રંગીન છે', 'કારણ કે તેઓ હલકા છે']
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
        english: ['To make them look colorful', 'To protect us from electric shock', 'To make them stronger', 'To make them waterproof'],
        hindi: ['उन्हें रंगीन दिखाने के लिए', 'हमें बिजली के झटके से बचाने के लिए', 'उन्हें मजबूत बनाने के लिए', 'उन्हें जलरोधी बनाने के लिए'],
        gujarati: ['તેમને રંગીન બનાવવા માટે', 'આપણને વીજળીના આંચકાથી બચાવવા માટે', 'તેમને વધુ મજબૂત બનાવવા માટે', 'તેમને પાણીરોધક બનાવવા માટે']
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
        english: ['The lamp will glow brighter', 'The lamp will not glow', 'The circuit will work better', 'Nothing will change'],
        hindi: ['लैंप अधिक चमकेगा', 'लैंप नहीं चमकेगा', 'सर्किट बेहतर काम करेगा', 'कुछ नहीं बदलेगा'],
        gujarati: ['દીવો વધુ તેજસ્વી થશે', 'દીવો પ્રકાશશે નહીં', 'સર્કિટ વધુ સારી રીતે કામ કરશે', 'કંઈ બદલાશે નહીં']
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
        english: ['The object is an insulator', 'The object is a conductor', 'The tester is broken', 'The battery is dead'],
        hindi: ['वस्तु एक कुचालक है', 'वस्तु एक सुचालक है', 'परीक्षक टूट गया है', 'बैटरी खत्म हो गई है'],
        gujarati: ['વસ્તુ કુવાહક છે', 'વસ્તુ સુવાહક છે', 'પરીક્ષક તૂટી ગયું છે', 'બેટરી ખતમ થઈ ગઈ છે']
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
        english: ['Cell, lamp, and wires', 'Only a battery', 'Switch and bulb only', 'Magnet and compass'],
        hindi: ['सेल, लैंप और तार', 'केवल बैटरी', 'केवल स्विच और बल्ब', 'चुंबक और कम्पास'],
        gujarati: ['સેલ, દીવો અને તારો', 'ફક્ત બેટરી', 'ફક્ત સ્વીચ અને બલ્બ', 'ચુંબક અને હોકાયંત્ર']
      },
      correctAnswer: 0,
      explanation: {
        english: 'A conduction tester needs a cell (battery) for power, a lamp to show when current flows, and wires to connect everything with free ends for testing.',
        hindi: 'चालन परीक्षक को बिजली के लिए एक सेल (बैटरी), धारा प्रवाहित होने पर दिखाने के लिए एक लैंप, और सब कुछ जोड़ने के लिए तारों की आवश्यकता होती है जिनके मुक्त सिरे परीक्षण के लिए हों।',
        gujarati: 'વહન પરીક્ષકને પાવર માટે સેલ (બેટરી), પ્રવાહ વહે ત્યારે બતાવવા માટે દીવો, અને બધું જોડવા માટે તારોની જરૂર છે જેના મુક્ત છેડાઓ પરીક્ષણ માટે હોય.'
      },
      topic: 'testing'
    },
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
        english: ['Water makes appliances dirty', 'Water is a conductor and increases risk of electric shock', 'It damages the appliance', 'It wastes electricity'],
        hindi: ['पानी उपकरणों को गंदा करता है', 'पानी एक सुचालक है और बिजली के झटके का खतरा बढ़ाता है', 'यह उपकरण को नुकसान पहुंचाता है', 'यह बिजली बर्बाद करता है'],
        gujarati: ['પાણી ઉપકરણોને ગંદા બનાવે છે', 'પાણી સુવાહક છે અને વીજળીના આંચકાનું જોખમ વધારે છે', 'તે ઉપકરણને નુકસાન પહોંચાડે છે', 'તે વીજળી બગાડે છે']
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
        english: ['Touch it to check if it works', 'Leave it as it is', 'Inform an adult and do not touch it', 'Try to repair it yourself'],
        hindi: ['इसे छूकर देखें कि यह काम करता है या नहीं', 'इसे जैसा है वैसा ही छोड़ दें', 'किसी वयस्क को सूचित करें और इसे न छुएं', 'इसे स्वयं ठीक करने का प्रयास करें'],
        gujarati: ['તે કામ કરે છે કે નહીં તે તપાસવા માટે તેને સ્પર્શ કરો', 'તેને જેમ છે તેમ છોડી દો', 'કોઈ પુખ્ત વયના વ્યક્તિને જાણ કરો અને તેને સ્પર્શ ન કરો', 'તેને જાતે સરખું કરવાનો પ્રયાસ કરો']
      },
      correctAnswer: 2,
      explanation: {
        english: 'Damaged insulation exposes the conducting wire, which can cause electric shock. Always inform an adult and never touch or try to repair it yourself.',
        hindi: 'क्षतिग्रस्त इन्सुलेशन सुचालक तार को उजागर कर देता है, जिससे बिजली का झटका लग सकता है। हमेशा किसी वयस्क को सूचित करें और इसे कभी भी खुद न छुएं या ठीक करने का प्रयास न करें।',
        gujarati: 'ક્ષતિગ્રસ્ત ઇન્સ્યુલેશન સુવાહક તારને ખુલ્લો પાડે છે, જે વીજળીનો આંચકો આપી શકે છે. હંમેશા પુખ્ત વયના વ્યક્તિને જાણ કરો અને ક્યારેય જાતે સ્પર્શ કરો નહીં અથવા સારું કરવાનો પ્રયાસ કરો નહીં.'
      },
      topic: 'safety'
    },
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
        english: ['To make them comfortable to hold', 'To protect from electric shock', 'To make them look nice', 'To make them cheaper'],
        hindi: ['उन्हें पकड़ने में आरामदायक बनाने के लिए', 'बिजली के झटके से बचाने के लिए', 'उन्हें अच्छा दिखाने के लिए', 'उन्हें सस्ता बनाने के लिए'],
        gujarati: ['તેમને પકડવામાં આરામદાયક બનાવવા માટે', 'વીજળીના આંચકાથી બચાવવા માટે', 'તેમને સુંદર બનાવવા માટે', 'તેમને સસ્તા બનાવવા માટે']
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
        english: ['Birds are insulators', 'Birds have thick feathers', 'Current needs a complete path to flow', 'The wire has low voltage'],
        hindi: ['पक्षी कुचालक होते हैं', 'पक्षियों के मोटे पंख होते हैं', 'धारा को प्रवाहित होने के लिए पूर्ण पथ की आवश्यकता होती है', 'तार में कम वोल्टेज होता है'],
        gujarati: ['પક્ષીઓ કુવાહક છે', 'પક્ષીઓને જાડા પીંછાં હોય છે', 'પ્રવાહને વહેવા માટે સંપૂર્ણ માર્ગની જરૂર છે', 'તારમાં ઓછું વોલ્ટેજ છે']
      },
      correctAnswer: 2,
      explanation: {
        english: 'Electric current needs a complete circuit to flow. The bird touches only one wire, so current has no complete path to flow through its body.',
        hindi: 'विद्युत धारा को प्रवाहित होने के लिए पूर्ण सर्किट की आवश्यकता होती है। पक्षी केवल एक तार को छूता है, इसलिए धारा के पास उसके शरीर से प्रवाहित होने के लिए कोई पूर्ण पथ नहीं है।',
        gujarati: 'વિદ્યુત પ્રવાહને વહેવા માટે સંપૂર્ણ સર્કિટની જરૂર છે. પક્ષી ફક્ત એક તારને સ્પર્શે છે, તેથી પ્રવાહને તેના શરીરમાંથી વહેવા માટે કોઈ સંપૂર્ણ માર્ગ નથી.'
      },
      topic: 'applications'
    },
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
        english: ['The coin is not a conductor', 'The battery may be dead or wires may be loose', 'Coins cannot conduct electricity', 'The lamp is too bright'],
        hindi: ['सिक्का सुचालक नहीं है', 'बैटरी खत्म हो सकती है या तार ढीले हो सकते हैं', 'सिक्के विद्युत का संचालन नहीं कर सकते', 'लैंप बहुत चमकीला है'],
        gujarati: ['સિક્કો સુવાહક નથી', 'બેટરી ખતમ થઈ ગઈ હશે અથવા તારો ઢીલા હશે', 'સિક્કા વીજળી વહન કરી શકતા નથી', 'દીવો ખૂબ તેજસ્વી છે']
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
        english: ['Metal pins with plastic body', 'All plastic', 'All metal', 'Wood pins with metal body'],
        hindi: ['प्लास्टिक बॉडी के साथ धातु की पिन', 'सभी प्लास्टिक', 'सभी धातु', 'धातु की बॉडी के साथ लकड़ी की पिन'],
        gujarati: ['પ્લાસ્ટિક બોડી સાથે ધાતુની પિન', 'બધું પ્લાસ્ટિક', 'બધી ધાતુ', 'ધાતુના શરીર સાથે લાકડાની પિન']
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

    setCurrentQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
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
    startPractice('mixed');
  };

  // Initialize questions on first render
  useEffect(() => {
    if (currentQuestions.length === 0) {
      startPractice('mixed');
    }
  }, []);

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const percentage = Math.round((score / currentQuestions.length) * 100);


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

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={resetPractice}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
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
        {renderPractice()}
      </div>
    </div>
  );
};

// CircuitVisualization Component
export const CircuitVisualization: React.FC = () => {
  const { currentMode } = useMode();

  // Render based on current mode
  if (currentMode === 'practice') {
    return <TorchlightPractice />;
  }

  // Default to demonstration/learn mode
  return <TorchlightLearning />;
};