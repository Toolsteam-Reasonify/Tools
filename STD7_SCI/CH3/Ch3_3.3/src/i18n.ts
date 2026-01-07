import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

// Inlined translations - English, Gujarati, Hindi
const translations = {
  en: {
    language: { en: "English", hi: "हिंदी", gu: "ગુજરાતી", selectorLabel: "Choose language" },
    nav: { logo: "Circuit Diagrams", learn: "Learn", practice: "Practice", applications: "Real World Applications" },
    learn: {
      footer: "Keep learning and exploring! 🚀",
      why: { title: "Why Circuit Diagrams?", body1: "Circuit diagrams use standardized symbols to represent electrical components.", body2: "Organizations like IEC, ANSI, and IEEE create these standard symbols." },
      symbols: {
        title: "Electrical Component Symbols",
        cell: { name: "Electric Cell", description: "A portable source of electrical energy" },
        battery: { name: "Battery", description: "Multiple cells connected in series" },
        lamp: { name: "Electric Lamp", description: "Incandescent lamp with filament" },
        led: { name: "LED", description: "Light Emitting Diode" },
        switchOn: { name: "Switch (ON)", description: "Completes the circuit" },
        switchOff: { name: "Switch (OFF)", description: "Breaks the circuit" },
        wire: { name: "Wire", description: "Conductor that connects components" }
      },
      examples: { title: "Example Circuit Diagrams", labels: { positive: "+", negative: "−" }, lamp: { title: "Simple Lamp Circuit", desc: "A simple circuit with a battery, lamp, and switch." }, led: { title: "LED Circuit", desc: "LED circuit with two cells." } }
    },
    practice: {
      ui: { selectInstruction: "Select the correct circuit diagram", showHint: "Show Hint", hideHint: "Hide Hint", checkAnswer: "Check Answer", selectPrompt: "Select a circuit to continue", correctTitle: "🎉 Excellent Work!", incorrectTitle: "📚 Learning Opportunity", correct: "Correct", wrong: "Wrong", previous: "Previous", next: "Next Question", footer: "💡 Practice makes perfect!" },
      svg: { positive: "+", negative: "−", longLine: "Long line", shortLine: "Short line", switchOn: "Switch ON", switchOff: "Switch OFF", currentFlow: "Current flow →" },
      questions: { p1: { question: "Draw the correct circuit diagram", explanation: "The correct circuit uses a lamp symbol.", hint: "Look at the output component." }, p2: { question: "Which circuit shows a battery connected to an LED?", explanation: "The correct circuit shows a battery with two cells.", hint: "Count the cells." }, p3: { question: "Identify the circuit where the lamp will NOT glow", explanation: "Switch is OFF creating a gap.", hint: "Check the switch position." }, p4: { question: "Which terminal marking is correct?", explanation: "Long line = positive, short line = negative.", hint: "Remember: Long = Positive." }, p5: { question: "Which circuit shows correct current direction?", explanation: "Current flows from positive to negative.", hint: "Follow the arrow!" } },
      header: { title: "⚡ Practice: Torchlight Circuit", subtitle: "Apply what you learned!" },
      ex6: { question: "Question", of: "of", q1: "What is the purpose of an electric cell?", q1o1: "To produce light", q1o2: "To provide electrical energy", q1o3: "To control flow", q1o4: "To connect parts", q2: "How many cells make a battery?", q2o1: "One", q2o2: "Two or more", q2o3: "Three", q2o4: "None", q3: "What happens when switch is ON?", q3o1: "Circuit breaks", q3o2: "Circuit completes and lamp glows", q3o3: "Battery drains", q3o4: "Nothing", q4: "What produces light?", q4o1: "Cell", q4o2: "Battery", q4o3: "Electric lamp", q4o4: "Switch", q5: "What do wires do?", q5o1: "Store electricity", q5o2: "Produce light", q5o3: "Carry electricity", q5o4: "Turn on/off", checkQuiz: "Submit Quiz" },
      ex1: { notLabeled: "Not answered" },
      summary: { title: "🎉 Practice Complete!", totalScore: "Total Score:", exercisesCompleted: "Exercises Completed:", excellent: "Excellent!", good: "Good job!", keepPracticing: "Keep practicing!", restart: "Restart", backToLearn: "Back to Learn", scoreLine: "{correct} / {total} correct", exerciseCount: "{count} exercises" }
    },
    common: { next: "Next", previous: "Previous", submit: "Submit", reset: "Reset", gotIt: "Got it!", correct: "Correct", incorrect: "Incorrect", examples: "Examples", yourAnswer: "Your Answer:", answerPlaceholder: "Type your answer...", ariaBack: "Go back", ariaNext: "Go forward" },
    component: { on: "ON", off: "OFF" },
    torch: {
      intro: { title: "Topic 3.1: A Torchlight", subtitle: "Let's explore how a torchlight works! 🔦", learnHeading: "What We'll Learn:", start: "Let's Start!" },
      learn: { obsTitle: "Observation Skills", obsDesc: "Identify parts", partsTitle: "Understanding Parts", partsDesc: "Learn about components", glowTitle: "How It Glows", glowDesc: "Discover why lamp lights", demoTitle: "Interactive Demo", demoDesc: "Try animations" },
      safety: { title: "Safety First!", line1: "Use only small batteries.", warning: "Never experiment with wall sockets!" },
      observe: { title: "Activity 3.1: Observe", clickTorch: "Click the Torch!", lampGlowing: "✨ Lamp is GLOWING!", lampNotGlowing: "⭕ Lamp is NOT glowing", whatNotice: "🔦 What is a Torchlight?", definition: "A torchlight is a portable light source.", nextQuestion: "🧐 Next:", questionText: "What's inside?", exploreNext: "Explore parts! →", back: "Back", nextParts: "Next: Torch Parts" },
      parts: { title: "🔍 What's Inside?", lamp: "1. Lamp", switch: "2. Switch", cells: "3. Cells", wires: "4. Wires", lampCard: "Lamp", lampDesc: "Produces light", switchCard: "Switch", switchDesc: "Controls ON/OFF", cellCard: "Cell", cellDesc: "Power source", wiresCard: "Wires", wiresDesc: "Carry electricity", clickToLearn: "Click to learn →", back: "Back", nextCell: "Next: Learn About Cells" },
      cell: { title: "🔋 Electric Cell", content: "An electric cell stores chemical energy." },
      battery: { title: "🔋🔋 Battery", content: "Battery info..." },
      lamp: { title: "💡 Electric Lamp", content: "Lamp info..." },
      switch: { title: "🔘 Switch", content: "Switch info..." },
      complete: { title: "⚡ Complete Circuit", content: "Overview..." },
      quiz: { title: "📝 Quiz Time!", content: "Test knowledge..." },
      nav: { back: "Back", continue: "Continue Learning" }
    },
    realworld: {
      title: "Real World Applications", tagline: "Discover electricity in daily life", usageCategories: "Electricity Usage", keyFacts: "Key Facts",
      cooking: "Cooking", lighting: "Lighting", transportation: "Transportation", heating: "Heating & Cooling", entertainment: "Entertainment", communication: "Communication",
      dc: { title: "Direct Current (DC)", desc: "Batteries provide DC." }, ac: { title: "Alternating Current (AC)", desc: "Wall sockets provide AC." }, storage: { title: "Energy Storage", desc: "Batteries store energy." }, impact: { title: "Global Impact", desc: "Renewable sources help environment." },
      desc: { cooking: "Powers cooking appliances", lighting: "Illuminating homes", transportation: "Electric vehicles", heating: "Climate control", entertainment: "Powering devices", communication: "Connecting people" },
      example: { cooking: { stove: "Electric stove", microwave: "Microwave", kettle: "Kettle", toaster: "Toaster" }, lighting: { bulbs: "LED bulbs", street: "Street lights", flashlight: "Flashlights", lamp: "Lamps" }, transportation: { cars: "Electric cars", trains: "Trains", trams: "Trams", ebikes: "E-bikes" }, heating: { ac: "AC", heater: "Heater", blanket: "Electric blanket", fan: "Fan" }, entertainment: { tv: "TV", computer: "Computer", console: "Gaming console", speakers: "Speakers" }, communication: { phones: "Mobile phones", router: "Router", radio: "Radio", satellite: "Satellite" } },
      safety: { title: "Safety First!", "1": "Never experiment with household electricity", "2": "Use only batteries", "3": "Never touch with wet hands", "4": "Don't use damaged equipment", "5": "Ask an adult for help" },
      stats: { title: "Stats", households: "Households with electricity", savings: "Avg savings", updated: "Updated {date}" }
    },
    learnSymbols: {
      header: { title: "Electrical Component Symbols", subtitle: "Standard circuit diagram symbols" },
      categories: { power: "Power Source", output: "Output Device", control: "Control Device", conductor: "Conductor" },
      aria: { page: "Symbols page", symbolsGrid: "Symbols grid", symbolPreview: "{component} preview" },
      example: { title: "Example: Simple Circuit", batteryLabel: "Battery", currentFlow: "→ Current Flow", circuitHeading: "Circuit Explanation:", circuitExplanation: "When switch is closed, current flows." },
      helper: { rules: { title: "📏 Drawing Rules", items: ["Use straight lines", "Space components evenly", "Use standard size", "Mark terminals"] }, notes: { title: "⚠️ Important Notes", items: ["Long line = +", "Short line = −", "LED triangle = direction", "Switch gap = broken"] }, best: { title: "✅ Best Practices", items: ["Label clearly", "Show direction", "Use dots", "Keep simple"] } }
    }
  },
  gu: {
    language: { en: "English", hi: "હિન્દી", gu: "ગુજરાતી", selectorLabel: "ભાષા પસંદ કરો" },
    nav: { logo: "સર્કિટ આકૃતિઓ", learn: "શીખો", practice: "પ્રેક્ટિસ", applications: "વાસ્તવિક વિશ્વના ઉપયોગો" },
    learn: { footer: "શીખતા રહો! 🚀", why: { title: "સર્કિટ આકૃતિઓ શા માટે?", body1: "સર્કિટ આકૃતિઓ માનક ચિહ્નો ઉપયોગ કરે છે.", body2: "IEC, ANSI અને IEEE માનક ચિહ્નો બનાવે છે." }, symbols: { title: "વિદ્યુત ઘટક ચિહ્નો", cell: { name: "વિદ્યુત સેલ", description: "ચાલક વિદ્યુત સ્ત્રોત" }, battery: { name: "બેટરી", description: "શ્રેણીમાં જોડાયેલા સેલ" }, lamp: { name: "લેમ્પ", description: "ફિલામેન્ટ લેમ્પ" }, led: { name: "એલઇડી", description: "લાઇટ એમિટિંગ ડાયોડ" }, switchOn: { name: "સ્વીચ (ચાલુ)", description: "સર્કિટ પૂરી કરે છે" }, switchOff: { name: "સ્વીચ (બંધ)", description: "સર્કિટ તોડે છે" }, wire: { name: "તાર", description: "ઘટકોને જોડે છે" } }, examples: { title: "ઉદાહરણ આકૃતિઓ", labels: { positive: "+", negative: "−" }, lamp: { title: "સરળ લેમ્પ સર્કિટ", desc: "બેટરી, લેમ્પ અને સ્વીચ સર્કિટ." }, led: { title: "એલઇડી સર્કિટ", desc: "બે સેલનો એલઇડી સર્કિટ." } } },
    practice: { ui: { selectInstruction: "યોગ્ય સર્કિટ પસંદ કરો", showHint: "સંકેત બતાવો", hideHint: "સંકેત છુપાવો", checkAnswer: "જવાબ ચકાસો", selectPrompt: "સર્કિટ પસંદ કરો", correctTitle: "🎉 સરસ!", incorrectTitle: "📚 શીખો", correct: "સાચું", wrong: "ખોટું", previous: "પાછળ", next: "આગળ", footer: "💡 પ્રેક્ટિસ કરો!" }, svg: { positive: "+", negative: "−", longLine: "લાંબી રેખા", shortLine: "નાની રેખા", switchOn: "સ્વીચ ચાલુ", switchOff: "સ્વીચ બંધ", currentFlow: "પ્રવાહ →" }, questions: { p1: { question: "યોગ્ય સર્કિટ પસંદ કરો", explanation: "લેમ્પ ચિહ્ન વાપરો.", hint: "આઉટપુટ જુઓ." }, p2: { question: "બેટરી-એલઇડી સર્કિટ", explanation: "બે સેલ જોઈએ.", hint: "સેલ ગણો." }, p3: { question: "લેમ્પ નહિ પ્રગટે?", explanation: "સ્વીચ બંધ છે.", hint: "સ્વીચ જુઓ." }, p4: { question: "ટર્મિનલ નિશાન", explanation: "લાંબી = ધન.", hint: "યાદ રાખો." }, p5: { question: "પ્રવાહ દિશા", explanation: "ધનથી ઋણ.", hint: "તીર જુઓ!" } }, header: { title: "⚡ પ્રેક્ટિસ", subtitle: "શીખો!" }, ex6: { question: "પ્રશ્ન", of: "ના", q1: "સેલનો હેતુ?", q1o1: "પ્રકાશ", q1o2: "ઊર્જા", q1o3: "નિયંત્રણ", q1o4: "જોડાણ", q2: "બેટરીમાં સેલ?", q2o1: "એક", q2o2: "બે+", q2o3: "ત્રણ", q2o4: "કોઈ નહીં", q3: "ON પર?", q3o1: "તૂટે", q3o2: "પ્રગટે", q3o3: "ખતમ", q3o4: "કંઈ નહીં", q4: "પ્રકાશ?", q4o1: "સેલ", q4o2: "બેટરી", q4o3: "લેમ્પ", q4o4: "સ્વીચ", q5: "તાર?", q5o1: "સંગ્રહ", q5o2: "પ્રકાશ", q5o3: "વહન", q5o4: "ON/OFF", checkQuiz: "સબમિટ" }, ex1: { notLabeled: "જવાબ નથી" }, summary: { title: "🎉 પૂર્ણ!", totalScore: "સ્કોર:", exercisesCompleted: "પૂર્ણ:", excellent: "ઉત્કૃષ્ટ!", good: "સારું!", keepPracticing: "ચાલુ રાખો!", restart: "ફરી શરૂ", backToLearn: "પાછા", scoreLine: "{correct}/{total}", exerciseCount: "{count} પૂર્ણ" } },
    common: { next: "આગળ", previous: "પાછળ", submit: "સબમિટ", reset: "રીસેટ", gotIt: "સમજાયું!", correct: "સાચું", incorrect: "ખોટું", examples: "ઉદાહરણો", yourAnswer: "જવાબ:", answerPlaceholder: "લખો...", ariaBack: "પાછળ", ariaNext: "આગળ" },
    component: { on: "ચાલુ", off: "બંધ" },
    torch: { intro: { title: "વિષય 3.1: ટોર્ચ", subtitle: "ટોર્ચ કેવી રીતે કામ કરે! 🔦", learnHeading: "શું શીખીશું:", start: "શરૂ કરીએ!" }, learn: { obsTitle: "નિરીક્ષણ", obsDesc: "ભાગો ઓળખો", partsTitle: "ભાગો", partsDesc: "ઘટકો શીખો", glowTitle: "પ્રગટે", glowDesc: "કેમ બળે", demoTitle: "ડેમો", demoDesc: "અજમાવો" }, safety: { title: "સુરક્ષા!", line1: "નાની બેટરી વાપરો.", warning: "સોકેટ નહીં!" }, observe: { title: "પ્રવૃત્તિ 3.1", clickTorch: "ક્લિક કરો!", lampGlowing: "✨ પ્રગટે!", lampNotGlowing: "⭕ નથી", whatNotice: "🔦 ટોર્ચ?", definition: "પોર્ટેબલ પ્રકાશ.", nextQuestion: "🧐 આગળ:", questionText: "અંદર શું?", exploreNext: "જાણો! →", back: "પાછળ", nextParts: "આગળ: ભાગો" }, parts: { title: "🔍 અંદર?", lamp: "1. લેમ્પ", switch: "2. સ્વીચ", cells: "3. સેલ", wires: "4. તાર", lampCard: "લેમ્પ", lampDesc: "પ્રકાશ", switchCard: "સ્વીચ", switchDesc: "ON/OFF", cellCard: "સેલ", cellDesc: "સ્ત્રોત", wiresCard: "તાર", wiresDesc: "વહન", clickToLearn: "શીખો →", back: "પાછળ", nextCell: "આગળ: સેલ" }, cell: { title: "🔋 સેલ", content: "રાસાયણિક ઊર્જા." }, battery: { title: "🔋🔋 બેટરી", content: "માહિતી..." }, lamp: { title: "💡 લેમ્પ", content: "માહિતી..." }, switch: { title: "🔘 સ્વીચ", content: "માહિતી..." }, complete: { title: "⚡ સર્કિટ", content: "અવલોકન..." }, quiz: { title: "📝 ક્વિઝ!", content: "તપાસો..." }, nav: { back: "પાછળ", continue: "ચાલુ" } },
    realworld: { title: "વાસ્તવિક ઉપયોગો", tagline: "વીજળી શક્તિ", usageCategories: "શ્રેણીઓ", keyFacts: "તથ્યો", cooking: "રસોઈ", lighting: "લાઇટિંગ", transportation: "પરિવહન", heating: "હીટિંગ", entertainment: "મનોરંજન", communication: "સંદેશાવ્યવહાર", dc: { title: "DC", desc: "બેટરી DC." }, ac: { title: "AC", desc: "સોકેટ AC." }, storage: { title: "સંગ્રહ", desc: "બેટરી સંગ્રહ." }, impact: { title: "અસર", desc: "નવીનીકરણીય." }, desc: { cooking: "રસોઈ ઉપકરણો", lighting: "પ્રકાશ", transportation: "વાહનો", heating: "હવામાન", entertainment: "ઉપકરણો", communication: "જોડાણ" }, example: { cooking: { stove: "સ્ટોવ", microwave: "માઇક્રોવેવ", kettle: "કેટલ", toaster: "ટોસ્ટર" }, lighting: { bulbs: "LED", street: "સ્ટ્રીટ", flashlight: "ટોર્ચ", lamp: "લેમ્પ" }, transportation: { cars: "કાર", trains: "ટ્રેન", trams: "ટ્રામ", ebikes: "ઇ-બાઇક" }, heating: { ac: "AC", heater: "હીટર", blanket: "બ્લેન્કેટ", fan: "પંખા" }, entertainment: { tv: "TV", computer: "કમ્પ્યુટર", console: "કન્સોલ", speakers: "સ્પીકર" }, communication: { phones: "ફોન", router: "રાઉટર", radio: "રેડિયો", satellite: "સેટેલાઇટ" } }, safety: { title: "સુરક્ષા!", "1": "ઘરેલુ નહીં", "2": "બેટરી વાપરો", "3": "ઓલા હાથ નહીં", "4": "નકામા નહીં", "5": "મદદ લો" }, stats: { title: "આંકડા", households: "ઘર", savings: "બચત", updated: "{date}" } },
    learnSymbols: { header: { title: "ચિહ્નો", subtitle: "માનક ચિહ્નો" }, categories: { power: "સ્ત્રોત", output: "આઉટપુટ", control: "નિયંત્રણ", conductor: "ચાલક" }, aria: { page: "પાનું", symbolsGrid: "ગ્રીડ", symbolPreview: "{component}" }, example: { title: "ઉદાહરણ", batteryLabel: "બેટરી", currentFlow: "→ પ્રવાહ", circuitHeading: "સમજણ:", circuitExplanation: "બંધ સ્વિચ પર પ્રવાહ." }, helper: { rules: { title: "📏 નિયમો", items: ["સીધી રેખા", "સમાન અંતર", "માનક કદ", "ટર્મિનલ"] }, notes: { title: "⚠️ નોંધો", items: ["લાંબી = +", "નાની = −", "ત્રિકોણ = દિશા", "ખાડો = તૂટે"] }, best: { title: "✅ શ્રેષ્ઠ", items: ["લેબલ", "દિશા", "બિંદુ", "સરળ"] } } }
  },
  hi: {
    language: { en: "English", hi: "हिंदी", gu: "ગુજરાતી", selectorLabel: "भाषा चुनें" },
    nav: { logo: "सर्किट डायग्राम", learn: "सीखें", practice: "अभ्यास", applications: "वास्तविक अनुप्रयोग" },
    learn: { footer: "सीखते रहें! 🚀", why: { title: "सर्किट आरेख क्यों?", body1: "सर्किट आरेख मानक प्रतीक उपयोग करते हैं.", body2: "IEC, ANSI और IEEE मानक बनाते हैं." }, symbols: { title: "विद्युत घटक प्रतीक", cell: { name: "विद्युत सेल", description: "विद्युत स्रोत" }, battery: { name: "बैटरी", description: "श्रृंखला में सेल" }, lamp: { name: "लैंप", description: "फिलामेंट लैंप" }, led: { name: "एलईडी", description: "लाइट एमिटिंग डायोड" }, switchOn: { name: "स्विच (चालू)", description: "परिपथ पूरा" }, switchOff: { name: "स्विच (बंद)", description: "परिपथ टूटा" }, wire: { name: "तार", description: "घटकों को जोड़ता" } }, examples: { title: "उदाहरण आरेख", labels: { positive: "+", negative: "−" }, lamp: { title: "सरल लैंप सर्किट", desc: "बैटरी, लैंप और स्विच सर्किट." }, led: { title: "एलईडी सर्किट", desc: "दो सेल का एलईडी सर्किट." } } },
    practice: { ui: { selectInstruction: "सही सर्किट चुनें", showHint: "संकेत दिखाएं", hideHint: "संकेत छिपाएं", checkAnswer: "जांचें", selectPrompt: "सर्किट चुनें", correctTitle: "🎉 शानदार!", incorrectTitle: "📚 सीखें", correct: "सही", wrong: "गलत", previous: "पिछला", next: "अगला", footer: "💡 अभ्यास करें!" }, svg: { positive: "+", negative: "−", longLine: "लंबी रेखा", shortLine: "छोटी रेखा", switchOn: "स्विच चालू", switchOff: "स्विच बंद", currentFlow: "धारा →" }, questions: { p1: { question: "सही सर्किट चुनें", explanation: "लैंप प्रतीक.", hint: "आउटपुट देखें." }, p2: { question: "बैटरी-एलईडी", explanation: "दो सेल चाहिए.", hint: "सेल गिनें." }, p3: { question: "लैंप नहीं जलेगा?", explanation: "स्विच बंद.", hint: "स्विच देखें." }, p4: { question: "टर्मिनल चिन्ह", explanation: "लंबी = धन.", hint: "याद रखें." }, p5: { question: "धारा दिशा", explanation: "धन से ऋण.", hint: "तीर देखें!" } }, header: { title: "⚡ अभ्यास", subtitle: "सीखें!" }, ex6: { question: "प्रश्न", of: "का", q1: "सेल का उद्देश्य?", q1o1: "रोशनी", q1o2: "ऊर्जा", q1o3: "नियंत्रण", q1o4: "जोड़ना", q2: "बैटरी में सेल?", q2o1: "एक", q2o2: "दो+", q2o3: "तीन", q2o4: "कोई नहीं", q3: "ON पर?", q3o1: "टूटा", q3o2: "जलता", q3o3: "खत्म", q3o4: "कुछ नहीं", q4: "रोशनी?", q4o1: "सेल", q4o2: "बैटरी", q4o3: "लैंप", q4o4: "स्विच", q5: "तार?", q5o1: "संग्रह", q5o2: "रोशनी", q5o3: "ले जाना", q5o4: "ON/OFF", checkQuiz: "जमा" }, ex1: { notLabeled: "उत्तर नहीं" }, summary: { title: "🎉 पूर्ण!", totalScore: "स्कोर:", exercisesCompleted: "पूर्ण:", excellent: "उत्कृष्ट!", good: "अच्छा!", keepPracticing: "जारी!", restart: "पुनः", backToLearn: "वापस", scoreLine: "{correct}/{total}", exerciseCount: "{count} पूर्ण" } },
    common: { next: "अगला", previous: "पिछला", submit: "जमा", reset: "रीसेट", gotIt: "समझा!", correct: "सही", incorrect: "गलत", examples: "उदाहरण", yourAnswer: "उत्तर:", answerPlaceholder: "लिखें...", ariaBack: "वापस", ariaNext: "आगे" },
    component: { on: "चालू", off: "बंद" },
    torch: { intro: { title: "विषय 3.1: टॉर्च", subtitle: "टॉर्च कैसे काम करती! 🔦", learnHeading: "क्या सीखेंगे:", start: "शुरू!" }, learn: { obsTitle: "निरीक्षण", obsDesc: "भाग पहचानें", partsTitle: "भाग", partsDesc: "घटक सीखें", glowTitle: "चमकता", glowDesc: "क्यों जलता", demoTitle: "डेमो", demoDesc: "आज़माएं" }, safety: { title: "सुरक्षा!", line1: "छोटी बैटरी.", warning: "सॉकेट नहीं!" }, observe: { title: "गतिविधि 3.1", clickTorch: "क्लिक करें!", lampGlowing: "✨ जल रहा!", lampNotGlowing: "⭕ नहीं", whatNotice: "🔦 टॉर्च?", definition: "पोर्टेबल प्रकाश.", nextQuestion: "🧐 अगला:", questionText: "अंदर क्या?", exploreNext: "जानें! →", back: "पीछे", nextParts: "अगला: भाग" }, parts: { title: "🔍 अंदर?", lamp: "1. लैंप", switch: "2. स्विच", cells: "3. सेल", wires: "4. तार", lampCard: "लैंप", lampDesc: "रोशनी", switchCard: "स्विच", switchDesc: "ON/OFF", cellCard: "सेल", cellDesc: "स्रोत", wiresCard: "तार", wiresDesc: "ले जाते", clickToLearn: "सीखें →", back: "पीछे", nextCell: "अगला: सेल" }, cell: { title: "🔋 सेल", content: "रासायनिक ऊर्जा." }, battery: { title: "🔋🔋 बैटरी", content: "जानकारी..." }, lamp: { title: "💡 लैंप", content: "जानकारी..." }, switch: { title: "🔘 स्विच", content: "जानकारी..." }, complete: { title: "⚡ परिपथ", content: "अवलोकन..." }, quiz: { title: "📝 क्विज़!", content: "परीक्षण..." }, nav: { back: "पीछे", continue: "जारी" } },
    realworld: { title: "वास्तविक अनुप्रयोग", tagline: "बिजली शक्ति", usageCategories: "श्रेणियाँ", keyFacts: "तथ्य", cooking: "खाना", lighting: "प्रकाश", transportation: "परिवहन", heating: "तापन", entertainment: "मनोरंजन", communication: "संचार", dc: { title: "DC", desc: "बैटरी DC." }, ac: { title: "AC", desc: "सॉकेट AC." }, storage: { title: "संग्रह", desc: "बैटरी संग्रह." }, impact: { title: "प्रभाव", desc: "नवीकरणीय." }, desc: { cooking: "खाना उपकरण", lighting: "रोशनी", transportation: "वाहन", heating: "जलवायु", entertainment: "उपकरण", communication: "जोड़ना" }, example: { cooking: { stove: "स्टोव", microwave: "माइक्रोवेव", kettle: "केतली", toaster: "टोस्टर" }, lighting: { bulbs: "LED", street: "सड़क", flashlight: "टॉर्च", lamp: "लैंप" }, transportation: { cars: "कार", trains: "ट्रेन", trams: "ट्राम", ebikes: "ई-बाइक" }, heating: { ac: "AC", heater: "हीटर", blanket: "कंबल", fan: "पंखे" }, entertainment: { tv: "TV", computer: "कंप्यूटर", console: "कंसोल", speakers: "स्पीकर" }, communication: { phones: "फोन", router: "राउटर", radio: "रेडियो", satellite: "सैटेलाइट" } }, safety: { title: "सुरक्षा!", "1": "घरेलू नहीं", "2": "बैटरी उपयोग", "3": "गीले हाथ नहीं", "4": "क्षतिग्रस्त नहीं", "5": "मदद लें" }, stats: { title: "आँकड़े", households: "घर", savings: "बचत", updated: "{date}" } },
    learnSymbols: { header: { title: "प्रतीक", subtitle: "मानक प्रतीक" }, categories: { power: "स्रोत", output: "आउटपुट", control: "नियंत्रण", conductor: "सुचालक" }, aria: { page: "पृष्ठ", symbolsGrid: "ग्रिड", symbolPreview: "{component}" }, example: { title: "उदाहरण", batteryLabel: "बैटरी", currentFlow: "→ धारा", circuitHeading: "व्याख्या:", circuitExplanation: "स्विच बंद पर धारा." }, helper: { rules: { title: "📏 नियम", items: ["सीधी रेखा", "समान दूरी", "मानक आकार", "टर्मिनल"] }, notes: { title: "⚠️ नोट्स", items: ["लंबी = +", "छोटी = −", "त्रिभुज = दिशा", "गैप = टूटा"] }, best: { title: "✅ सर्वोत्तम", items: ["लेबल", "दिशा", "बिंदु", "सरल"] } } }
  }
};

const resources = {
  en: { translation: translations.en },
  hi: { translation: translations.hi },
  gu: { translation: translations.gu },
};

// Initialize i18n with proper error handling
if (!i18n.isInitialized) {
  i18n
    .use(ICU)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'hi', 'gu'],
      detection: {
        order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
        lookupQuerystring: 'lang',
        caches: ['localStorage'],
      },
      interpolation: {
        escapeValue: false,
      },
      returnObjects: true,
      saveMissing: true,
      missingKeyHandler: (lng, _ns, key) => {
        console.warn(`[i18n] Missing translation for key "${key}" in ${lng}`);
      },
    })
    .catch((error) => {
      console.error('i18n initialization error:', error);
    });
}

export default i18n;
