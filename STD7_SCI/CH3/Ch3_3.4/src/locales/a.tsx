// translations.tsx

export type Language = 'en' | 'hi' | 'gu';

export interface LanguageSelector {
  en: string;
  hi: string;
  gu: string;
  selectorLabel: string;
}

export interface NavTranslations {
  logo: string;
  learn: string;
  practice: string;
  applications: string;
}

export interface CommonTranslations {
  next: string;
  previous: string;
  submit: string;
  reset: string;
  gotIt: string;
  correct: string;
  incorrect: string;
  examples: string;
  yourAnswer: string;
  answerPlaceholder: string;
  ariaBack: string;
  ariaNext: string;
}

export interface ComponentTranslations {
  on: string;
  off: string;
}

export interface TorchIntroTranslations {
  title: string;
  subtitle: string;
  learnHeading: string;
  start: string;
}

export interface TorchLearnTranslations {
  obsTitle: string;
  obsDesc: string;
  partsTitle: string;
  partsDesc: string;
  glowTitle: string;
  glowDesc: string;
  demoTitle: string;
  demoDesc: string;
}

export interface TorchSafetyTranslations {
  title: string;
  line1: string;
  warning: string;
}

export interface TorchObserveTranslations {
  title: string;
  clickTorch: string;
  lampGlowing: string;
  lampNotGlowing: string;
  whatNotice: string;
  definition: string;
  nextQuestion: string;
  questionText: string;
  exploreNext: string;
  back: string;
  nextParts: string;
}

export interface TorchPartsTranslations {
  title: string;
  lamp: string;
  switch: string;
  cells: string;
  wires: string;
  lampCard: string;
  lampDesc: string;
  switchCard: string;
  switchDesc: string;
  cellCard: string;
  cellDesc: string;
  wiresCard: string;
  wiresDesc: string;
  clickToLearn: string;
  back: string;
  nextCell: string;
}

export interface TorchComponentTranslations {
  title: string;
  content: string;
}

export interface TorchNavTranslations {
  back: string;
  continue: string;
}

export interface TorchTranslations {
  intro: TorchIntroTranslations;
  learn: TorchLearnTranslations;
  safety: TorchSafetyTranslations;
  observe: TorchObserveTranslations;
  parts: TorchPartsTranslations;
  cell: TorchComponentTranslations;
  battery: TorchComponentTranslations;
  lamp: TorchComponentTranslations;
  switch: TorchComponentTranslations;
  complete: TorchComponentTranslations;
  quiz: TorchComponentTranslations;
  nav: TorchNavTranslations;
}

export interface PracticeHeaderTranslations {
  title: string;
  subtitle: string;
}

export interface PracticeEx6Translations {
  question: string;
  of: string;
  q1: string;
  q1o1: string;
  q1o2: string;
  q1o3: string;
  q1o4: string;
  q2: string;
  q2o1: string;
  q2o2: string;
  q2o3: string;
  q2o4: string;
  q3: string;
  q3o1: string;
  q3o2: string;
  q3o3: string;
  q3o4: string;
  q4: string;
  q4o1: string;
  q4o2: string;
  q4o3: string;
  q4o4: string;
  q5: string;
  q5o1: string;
  q5o2: string;
  q5o3: string;
  q5o4: string;
  checkQuiz: string;
}

export interface PracticeEx1Translations {
  notLabeled: string;
}

export interface PracticeSummaryTranslations {
  title: string;
  totalScore: string;
  exercisesCompleted: string;
  excellent: string;
  good: string;
  keepPracticing: string;
  restart: string;
  backToLearn: string;
  scoreLine: string;
  exerciseCount: string;
}

export interface PracticeTopicTranslations {
  name: string;
  description: string;
}

export interface PracticeTopicsTranslations {
  identification: PracticeTopicTranslations;
  properties: PracticeTopicTranslations;
  wires: PracticeTopicTranslations;
  testing: PracticeTopicTranslations;
  safety: PracticeTopicTranslations;
  applications: PracticeTopicTranslations;
}

export interface PracticeTranslations {
  header: PracticeHeaderTranslations;
  practiceMode: string;
  topicSelection: string;
  mixedPractice: string;
  allTopics: string;
  questions: string;
  submitAnswer: string;
  nextQuestion: string;
  finishPractice: string;
  yourScore: string;
  tryAgain: string;
  backToTopics: string;
  excellentWork: string;
  goodJob: string;
  keepPracticing: string;
  explanation: string;
  correctAnswer: string;
  progress: string;
  easy: string;
  medium: string;
  hard: string;
  correct: string;
  incorrect: string;
  total: string;
  outstandingWork: string;
  goodWork: string;
  dontGiveUp: string;
  topics: PracticeTopicsTranslations;
  ex6: PracticeEx6Translations;
  ex1: PracticeEx1Translations;
  summary: PracticeSummaryTranslations;
}

export interface RealWorldDCACTranslations {
  title: string;
  desc: string;
}

export interface RealWorldExamplesTranslations {
  stove?: string;
  microwave?: string;
  kettle?: string;
  toaster?: string;
  bulbs?: string;
  street?: string;
  flashlight?: string;
  lamp?: string;
  cars?: string;
  trains?: string;
  trams?: string;
  ebikes?: string;
  ac?: string;
  heater?: string;
  blanket?: string;
  fan?: string;
  tv?: string;
  computer?: string;
  console?: string;
  speakers?: string;
  phones?: string;
  router?: string;
  radio?: string;
  satellite?: string;
}

export interface RealWorldSafetyTranslations {
  '1': string;
  '2': string;
  '3': string;
  '4': string;
  '5': string;
  title: string;
}

export interface RealWorldStatsTranslations {
  title: string;
  households: string;
  savings: string;
  updated: string;
}

export interface RealWorldTranslations {
  title: string;
  tagline: string;
  usageCategories: string;
  keyFacts: string;
  cooking: string;
  lighting: string;
  transportation: string;
  heating: string;
  entertainment: string;
  communication: string;
  dc: RealWorldDCACTranslations;
  ac: RealWorldDCACTranslations;
  storage: RealWorldDCACTranslations;
  impact: RealWorldDCACTranslations;
  desc: {
    cooking: string;
    lighting: string;
    transportation: string;
    heating: string;
    entertainment: string;
    communication: string;
  };
  example: {
    cooking: RealWorldExamplesTranslations;
    lighting: RealWorldExamplesTranslations;
    transportation: RealWorldExamplesTranslations;
    heating: RealWorldExamplesTranslations;
    entertainment: RealWorldExamplesTranslations;
    communication: RealWorldExamplesTranslations;
  };
  safety: RealWorldSafetyTranslations;
  stats: RealWorldStatsTranslations;
}

export interface MaterialNamesTranslations {
  iron: string;
  copper: string;
  graphite: string;
  wood: string;
  plastic: string;
  pencil: string;
  rubber: string;
  glass: string;
}

export interface LearnTranslations {
  information: string;
  headerTitle: string;
  headerSubtitle: string;
  circuitTestArea: string;
  hideCurrent: string;
  showCurrent: string;
  connectionMade: string;
  dragObjectHere: string;
  predYesConduct: string;
  predNoInsulator: string;
  resultCorrect: string;
  notQuite: string;
  explainerOnAlt: string;
  explainerOffAlt: string;
  dragMaterialToTest: string;
  materialsToTest: string;
  cell: string;
  bulb: string;
  makePrediction: string;
  isAType: string;
  materialInCircuit: string;
  type: string;
  conductor: string;
  insulator: string;
  bulbStatus: string;
  onGlowing: string;
  offNotGlowing: string;
  isDescription: string;
  explainerOn: string;
  explainerOff: string;
  testResults: string;
  material: string;
  typeHeader: string;
  bulbHeader: string;
  clearResults: string;
  materialNames: MaterialNamesTranslations;
  materialDescriptions: MaterialNamesTranslations;
}

export interface ConductorsIntroTranslations {
  title: string;
  subtitle: string;
  discoverTitle: string;
  conductorsTitle: string;
  conductorsDesc: string;
  insulatorsTitle: string;
  insulatorsDesc: string;
  testingTitle: string;
  testingDesc: string;
  safetyTitle: string;
  safetyDesc: string;
  startButton: string;
}

export interface ConductorsTesterTranslations {
  title: string;
  subtitle: string;
  circuitSetup: string;
  materialsToTest: string;
  conductors: string;
  semiconductors: string;
  insulators: string;
  resetTest: string;
  battery: string;
  bulb: string;
  probe1: string;
  probe2: string;
  currentFlow: string;
  return: string;
  materialUnderTest: string;
  conductorDetected: string;
  nonConductor: string;
  materialType: string;
  currentFlowLabel: string;
  bulbBrightness: string;
  resistance: string;
  howItWorks: string;
  conductorsDesc: string;
  semiconductorsDesc: string;
  insulatorsDesc: string;
  diagramTitle: string;
  cellLabel: string;
  wire1: string;
  wire2: string;
  wire3: string;
  lampOn: string;
  lampOff: string;
  freeEnd1: string;
  freeEnd1Color: string;
  freeEnd2: string;
  freeEnd2Color: string;
  testingArea: string;
  currentFlowPath: string;
  circuitComplete: string;
  testing: string;
  placeMaterial: string;
  touchInstructions1: string;
  touchInstructions2: string;
  buildTitle: string;
  buildStep1: string;
  buildStep2: string;
  buildStep3: string;
  buildStep4: string;
  howItWorksTitle: string;
  howItWorksDesc: string;
  conductorResult: string;
  insulatorResult: string;
  tipsTitle: string;
  tip1: string;
  tip2: string;
  tip3: string;
  back: string;
  startTesting: string;
}

export interface ConductorsMaterialNamesTranslations {
  metalKey: string;
  plasticScale: string;
  coin: string;
  rubberEraser: string;
  glassBangle: string;
  ironNail: string;
  woodenStick: string;
  aluminumFoil: string;
  paperStrip: string;
  copperWire: string;
  cork: string;
  steelSpoon: string;
}

export interface ConductorsMaterialTypesTranslations {
  metalIron: string;
  plastic: string;
  metalCopper: string;
  rubber: string;
  glass: string;
  wood: string;
  metalAluminum: string;
  paper: string;
  metalSteel: string;
  cork: string;
}

export interface ConductorsTestMaterialNamesTranslations {
  copperWire: string;
  ironNail: string;
  aluminumFoil: string;
  graphite: string;
  saltWater: string;
  plasticRuler: string;
  rubberEraser: string;
  woodenStick: string;
  glass: string;
  paper: string;
}

export interface ConductorsMaterialsTranslations {
  title: string;
  resetAll: string;
  testing: string;
  lampGlows: string;
  conductor: string;
  noGlow: string;
  insulator: string;
  progress: string;
  clickToTest: string;
  allTestedTitle: string;
  allTestedDesc: string;
  conductorLabel: string;
  insulatorLabel: string;
  back: string;
  seeResults: string;
  materialNames: ConductorsMaterialNamesTranslations;
  materialTypes: ConductorsMaterialTypesTranslations;
  materialDescriptions: ConductorsMaterialNamesTranslations & {
    graphite: string;
    saltWater: string;
    plasticRuler: string;
    glass: string;
  };
  testMaterialNames: ConductorsTestMaterialNamesTranslations;
  testMaterialDescriptions: ConductorsTestMaterialNamesTranslations;
}

export interface ConductorsResultsTranslations {
  title: string;
  conductorsTitle: string;
  conductorsSubtitle: string;
  conductorsDesc: string;
  insulatorsTitle: string;
  insulatorsSubtitle: string;
  insulatorsDesc: string;
  patternConductors: string;
  patternInsulators: string;
  discoveriesTitle: string;
  conductorsListTitle: string;
  conductorsList1: string;
  conductorsList2: string;
  conductorsList3: string;
  insulatorsListTitle: string;
  insulatorsList1: string;
  insulatorsList2: string;
  insulatorsList3: string;
  backToTesting: string;
  learnMoreConductors: string;
}

export interface ConductorsDetailTranslations {
  title: string;
  content: string;
  next: string;
}

export interface ConductorsApplicationDetailTranslations {
  title: string;
  desc: string;
}

export interface ConductorsApplicationsDetailTranslations {
  title: string;
  intro: string;
  conductorsTitle: string;
  insulatorsTitle: string;
  conductor1: ConductorsApplicationDetailTranslations;
  conductor2: ConductorsApplicationDetailTranslations;
  conductor3: ConductorsApplicationDetailTranslations;
  conductor4: ConductorsApplicationDetailTranslations;
  conductor5: ConductorsApplicationDetailTranslations;
  insulator1: ConductorsApplicationDetailTranslations;
  insulator2: ConductorsApplicationDetailTranslations;
  insulator3: ConductorsApplicationDetailTranslations;
  insulator4: ConductorsApplicationDetailTranslations;
  insulator5: ConductorsApplicationDetailTranslations;
  keyTakeaways: string;
  takeaway1: string;
  takeaway2: string;
  takeaway3: string;
  back: string;
}

export interface ConductorsQuizTranslations {
  title: string;
  content: string;
}

export interface ConductorsTranslations {
  intro: ConductorsIntroTranslations;
  tester: ConductorsTesterTranslations;
  materials: ConductorsMaterialsTranslations;
  results: ConductorsResultsTranslations;
  conductorsDetail: ConductorsDetailTranslations;
  insulatorsDetail: ConductorsDetailTranslations;
  safetyDetail: ConductorsDetailTranslations;
  applicationsDetail: ConductorsApplicationsDetailTranslations;
  quiz: ConductorsQuizTranslations;
}

export interface Translations {
  language: LanguageSelector;
  nav: NavTranslations;
  common: CommonTranslations;
  component: ComponentTranslations;
  torch: TorchTranslations;
  practice: PracticeTranslations;
  realworld: RealWorldTranslations;
  learn: LearnTranslations;
  conductors: ConductorsTranslations;
}

export interface AllTranslations {
  en: Translations;
  hi: Translations;
  gu: Translations;
}

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
      applications: "Real World Applications",
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