import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Content authored from the provided images (NCERT-style section on Circles)
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    appTitle: 'Circles: Circumference & Area',
    selectLanguage: 'Select Language',

    // Navigation
    learn: 'Learn',
    practice: 'Practice',
    realWorld: 'Real World',

    // Common
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    tryAgain: 'Try Again',
    showHint: 'Show Hint',
    hideHint: 'Hide Hint',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    yourAnswer: 'Your Answer',
    correct: 'Correct! ',
    incorrect: 'Incorrect. Try again!',
    score: 'Score',
    attempts: 'Attempts',
    solution: 'Solution',
    viewAssessment: 'View Assessment',
    answerLabel: 'Answer',
    placeholderAnswer: 'Type your answer here... ✍️',
    questionLabel: 'Question',
    attemptLabel: 'attempt(s)',
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: "You've finished all circle exercises!",
    practiceAgain: 'Practice Again',
    practiceTitle: 'Practice',
    practiceSubtitle: 'Test your understanding of circumference and area',
    prompt: 'Data',
    of: 'of',

    // Learn - Steps
    step1Title: 'Circumference of a Circle',
    step1Desc: 'Explore how to find the distance around a circle',
    step1Concept:
      'The distance around a circular region is called its circumference. Using a string around the edge gives an estimate. The exact relation is C = πd = 2πr.',

    // Step 1 key points (to present as 5 mini-steps)
    circKey1: 'Definition: Distance around the circle = circumference',
    circKey2: 'Measure idea: Wrap a string once around, then straighten to estimate length',
    circKey3: 'Diameter link: C = π × d',
    circKey4: 'Radius link: C = 2 × π × r',
    circKey5: 'Units: Same as length (cm, m). Use π = 22/7 or 3.14',

    step2Title: 'Circumference Formula',
    step2Desc: 'Connect diameter, radius and π (pi)',
    step2Concept:
      'For any circle: circumference C = π × diameter = 2π × radius. Take π ≈ 22/7 or 3.14 as needed.',
    step2Step1: 'For any circle: circumference C = π × diameter = 2π × radius',
    step2Step2: 'Take π ≈ 22/7 or 3.14 as needed',

    step3Title: 'Understanding Area of a Circle',
    step3Desc: 'Build intuition by rearranging circle sectors',
    step3Concept:
      'Cut a circle into many equal sectors and arrange alternately to form a rectangle. Its breadth is r and length is about half the circumference (πr). Hence Area = πr².',
    step3Step1: 'Cut a circle into many equal sectors and arrange alternately to form a rectangle',
    step3Step2: 'Its breadth is r and length is about half the circumference (πr)',
    step3Step3: 'Hence Area = πr²',

    step4Title: 'Area Formula and Keys',
    step4Desc: 'Apply Area = πr² and relate to diameter',
    step4Concept:
      'Given diameter d = 2r, area can also be written as A = π (d/2)². Use the same π values as for circumference.',
    step4Step1: 'Given diameter d = 2r, area can also be written as A = π (d/2)²',
    step4Step2: 'Use the same π values as for circumference',
    step4Step3: 'A = πr²',
    step4Step4: 'If d given: A = π(d/2)²',

    step5Title: 'Working with π and Units',
    step5Desc: 'Choose π smartly and keep units consistent',
    step5Concept:
      'Use π = 22/7 when radius/diameter involves 7 or multiples for exact values; use π ≈ 3.14 for decimal answers. Circumference uses linear units (cm, m) while area uses square units (cm², m²).',
    step5Step1: 'Use π = 22/7 when radius/diameter involves 7 or multiples for exact values',
    step5Step2: 'Use π ≈ 3.14 for decimal answers',
    step5Step3: 'Circumference uses linear units (cm, m)',
    step5Step4: 'Area uses square units (cm², m²)',
    step5Step5: 'Convert units before calculation',

    // Labels used in visuals
    radius: 'Radius (r)',
    diameter: 'Diameter (d)',
    pi: 'π (Pi)',
    cm: 'cm',
    m: 'm',
    cm2: 'cm²',
    m2: 'm²',
    circumferenceVisual: 'Circumference Visual',
    areaVisual: 'Area Visual',
    diameterTwice: 'Diameter is twice the radius',
    diameterFormula: 'd = 2r',
    usePiApprox: 'Use π ≈ 22/7 or 3.14',
    circleSectorsDesc: 'Circle sectors arranged into a near-rectangle → breadth r, length πr',
    formulaCirc: 'C = πd = 2πr',
    formulaArea: 'A = πr²',

    // Practice questions (pulled from images, adapted)
    q1Title: 'Find circumference for d = 14 cm (π = 22/7)',
    q1Answer: '44',
    q1Hint: 'Use C = πd',
    q1Solution: 'C = (22/7) × 14 = 44 cm',

    q2Title: 'Find circumference for r = 10.5 cm (π = 22/7)',
    q2Answer: '66',
    q2Hint: 'Use C = 2πr',
    q2Solution: 'C = 2 × (22/7) × 10.5 = 66 cm',

    q3Title: 'Area of circle with r = 7 cm (π = 22/7)',
    q3Answer: '154',
    q3Hint: 'Use A = πr²',
    q3Solution: 'A = (22/7) × 7 × 7 = 154 cm²',

    q4Title: 'Area of circle with d = 9.8 cm (π = 22/7)',
    q4Answer: '75.46',
    q4Hint: 'r = d/2',
    q4Solution: 'r = 4.9 cm, A = (22/7) × 4.9 × 4.9 ≈ 75.46 cm²',

    q5Title: 'Circumference is 31.4 cm. Find radius (π = 3.14).',
    q5Answer: '5',
    q5Hint: 'C = 2πr ⇒ r = C/(2π)',
    q5Solution: 'r = 31.4 / (2 × 3.14) = 5 cm; Area = πr² = 78.5 cm²',

    q6Title: 'How many rotations for wheel r = 28 cm to cover 352 m? (π = 22/7)',
    q6Answer: '200',
    q6Hint: 'One rotation covers distance = circumference',
    q6Solution: 'C = 2 × (22/7) × 28 = 176 cm = 1.76 m. 352 / 1.76 = 200 rotations',

    // Real world
    realWorldTitle: 'Real World Applications',
    realWorldSubtitle: 'Where circumference and area matter',

    ex1Title: 'Racing Track with Semicircular Ends',
    ex1Context: 'Track is rectangular in the middle with semicircles at both ends. Distance in two rounds needs total curved lengths.',
    ex1Question: 'Which formula gives the curved part length?',
    ex1Answer: 'Two semicircles make a full circle: length = πd = 2πr',

    ex2Title: 'Rope Around Circular Garden',
    ex2Context: 'Find rope length to go once around a circular garden of diameter 21 m.',
    ex2Question: 'How much rope is needed?',
    ex2Answer: 'C = πd = (22/7) × 21 = 66 m',

    ex3Title: 'Polishing a Circular Table-top',
    ex3Context: 'Cost depends on area. Table radius 1.6 m; polishing cost Rs 15/m².',
    ex3Question: 'What is the cost?',
    ex3Answer: 'A = πr² = 3.14 × 1.6² ≈ 8.0384 m² → Rs 120.6',

    ex4Title: 'Sprinkler in Circular Garden',
    ex4Context: 'Garden area 314 m²; sprinkler reaches r = 10 m.',
    ex4Question: 'Will it cover the garden?',
    ex4Answer: 'Area covered = πr² = 3.14 × 10² = 314 m² → Yes',

    ex5Title: 'Wheel Rotations',
    ex5Context: 'How many rotations to cover a distance of 352 m for wheel r = 28 cm?',
    ex5Question: 'Find number of rotations',
    ex5Answer: 'One rotation = circumference = 1.76 m; 352 / 1.76 = 200 rotations',

    ex6Title: 'Minute Hand Travel',
    ex6Context: 'A clock minute hand of length 15 cm moves in a circle.',
    ex6Question: 'How far does the tip move in 1 hour?',
    ex6Answer: 'Distance in one revolution = circumference = 2πr = 2 × 3.14 × 15 ≈ 94.2 cm',

    // Why/Pro Tip sections (to match Triangle tool UI)
    whyMatterTitle: 'Why Circumference & Area Matter?',
    whyMatterPoint1: 'Practical Uses: Tracks, garden fencing, wheels, and circular designs.',
    whyMatterPoint2: 'Foundation: Builds understanding for sectors, arcs, and mensuration.',
    whyMatterPoint3: 'Unit Sense: Linear (cm/m) vs square (cm²/m²) prevents mistakes.',
    whyMatterPoint4: 'Choice of π: 22/7 for exact fractions with 7; 3.14 for decimals.',

    proTipTitle: 'Pro Tip!',
    proTipText: 'If diameter is given, use C = πd and A = π(d/2)². Keep units consistent and round answers sensibly based on the π you choose.',

    // Buttons
    pause: '⏸️ Pause',
    play: '▶️ Play',
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
  },
  // Hindi translations for Real World + info sections
  hi: {
    // Header
    appTitle: 'वृत्त: परिधि और क्षेत्रफल',

    // Navigation
    learn: 'सीखें',
    practice: 'अभ्यास',
    realWorld: 'वास्तविक दुनिया',
    
    // Common
    previous: 'पिछला',
    next: 'अगला',
    play: '▶️ चलाएं',
    pause: '⏸️ रोकें',
    
    // Practice/UI
    practiceTitle: 'अभ्यास',
    practiceSubtitle: 'परिधि और क्षेत्रफल की समझ को परखें',
    practiceAgain: 'फिर से अभ्यास करें',
    submit: 'जमा करें',
    tryAgain: 'पुनः प्रयास करें',
    showHint: 'संकेत दिखाएं',
    hideHint: 'संकेत छिपाएं',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छिपाएं',
    score: 'अंक',
    placeholderAnswer: 'अपना जवाब यहाँ टाइप करें... ✍️',
    prompt: 'दिया गया डेटा',
    of: 'का',
    questionLabel: 'प्रश्न',
    answerLabel: 'उत्तर',

    // Learn - Steps
    step1Title: 'वृत्त की परिधि',
    step1Desc: 'वृत्त के चारों ओर की दूरी कैसे ज्ञात करें',
    step1Concept:
      'एक वृत्ताकार क्षेत्र के चारों ओर की दूरी को उसकी परिधि कहा जाता है। किनारे के चारों ओर एक धागा लगाकर अनुमान लगाया जा सकता है। सटीक संबंध C = πd = 2πr है।',

    // Step 1 key points
    circKey1: 'परिभाषा: वृत्त के चारों ओर की दूरी = परिधि',
    circKey2: 'माप का विचार: एक बार किनारे के चारों ओर धागा लपेटें, फिर लंबाई का अनुमान लगाने के लिए सीधा करें',
    circKey3: 'व्यास संबंध: C = π × d',
    circKey4: 'त्रिज्या संबंध: C = 2 × π × r',
    circKey5: 'एकम: लंबाई के समान (सेमी, मी)। π = 22/7 या 3.14 का उपयोग करें',

    // Step 2
    step2Title: 'परिधि सूत्र',
    step2Desc: 'व्यास, त्रिज्या और π (पाई) को जोड़ें',

    // Step 3
    step3Title: 'वृत्त के क्षेत्रफल को समझना',
    step3Desc: 'वृत्त क्षेत्रों को पुनर्व्यवस्थित करके अंतर्ज्ञान बनाएं',

    // Step 4
    step4Title: 'क्षेत्रफल सूत्र और कुंजी',
    step4Desc: 'क्षेत्रफल = πr² लागू करें और व्यास से संबंधित करें',

    // Step 2 translations
    step2Step1: 'किसी भी वृत्त के लिए: परिधि C = π × व्यास = 2π × त्रिज्या',
    step2Step2: 'आवश्यकतानुसार π ≈ 22/7 या 3.14 लें',

    // Step 3 translations
    step3Step1: 'एक वृत्त को कई समान क्षेत्रों में काटें और वैकल्पिक रूप से व्यवस्थित करें ताकि एक आयत बन सके',
    step3Step2: 'इसकी चौड़ाई r है और लंबाई लगभग आधी परिधि (πr) है',
    step3Step3: 'अतः क्षेत्रफल = πr²',

    // Step 4 translations
    step4Step1: 'दिया गया व्यास d = 2r, क्षेत्रफल को A = π (d/2)² के रूप में भी लिखा जा सकता है',
    step4Step2: 'परिधि के लिए समान π मानों का उपयोग करें',
    step4Step3: 'A = πr²',
    step4Step4: 'यदि d दिया हो: A = π(d/2)²',

    // Practice questions (Hindi)
    q1Title: 'Find circumference for d = 14 cm (π = 22/7)',
    q1Answer: '44',
    q1Hint: 'Use C = πd',
    q1Solution: 'C = (22/7) × 14 = 44 cm',

    q2Title: 'Find circumference for r = 10.5 cm (π = 22/7)',
    q2Answer: '66',
    q2Hint: 'Use C = 2πr',
    q2Solution: 'C = 2 × (22/7) × 10.5 = 66 cm',

    q3Title: 'Area of circle with r = 7 cm (π = 22/7)',
    q3Answer: '154',
    q3Hint: 'Use A = πr²',
    q3Solution: 'A = (22/7) × 7 × 7 = 154 cm²',

    q4Title: 'Area of circle with d = 9.8 cm (π = 22/7)',
    q4Answer: '75.46',
    q4Hint: 'r = d/2',
    q4Solution: 'r = 4.9 cm, A = (22/7) × 4.9 × 4.9 ≈ 75.46 cm²',

    q5Title: 'Circumference is 31.4 cm. Find radius (π = 3.14).',
    q5Answer: '5',
    q5Hint: 'C = 2πr ⇒ r = C/(2π)',
    q5Solution: 'r = 31.4 / (2 × 3.14) = 5 cm; Area = πr² = 78.5 cm²',

    q6Title: 'How many rotations for wheel r = 28 cm to cover 352 m? (π = 22/7)',
    q6Answer: '200',
    q6Hint: 'One rotation covers distance = circumference',
    q6Solution: 'C = 2 × (22/7) × 28 = 176 cm = 1.76 m. 352 / 1.76 = 200 rotations',

    // Real world
    realWorldTitle: 'वास्तविक दुनिया के अनुप्रयोग',
    realWorldSubtitle: 'Where circumference and area matter',

    ex1Title: 'Racing Track with Semicircular Ends',
    ex1Context: 'Track is rectangular in the middle with semicircles at both ends. Distance in two rounds needs total curved lengths.',
    ex1Question: 'Which formula gives the curved part length?',
    ex1Answer: 'Two semicircles make a full circle: length = πd = 2πr',

    ex2Title: 'Rope Around Circular Garden',
    ex2Context: 'Find rope length to go once around a circular garden of diameter 21 m.',
    ex2Question: 'How much rope is needed?',
    ex2Answer: 'C = πd = (22/7) × 21 = 66 m',

    ex3Title: 'Polishing a Circular Table-top',
    ex3Context: 'Cost depends on area. Table radius 1.6 m; polishing cost Rs 15/m².',
    ex3Question: 'What is the cost?',
    ex3Answer: 'A = πr² = 3.14 × 1.6² ≈ 8.0384 m² → Rs 120.6',

    ex4Title: 'Sprinkler in Circular Garden',
    ex4Context: 'Garden area 314 m²; sprinkler reaches r = 10 m.',
    ex4Question: 'Will it cover the garden?',
    ex4Answer: 'Area covered = πr² = 3.14 × 10² = 314 m² → Yes',

    ex5Title: 'Wheel Rotations',
    ex5Context: 'How many rotations to cover a distance of 352 m for wheel r = 28 cm?',
    ex5Question: 'Find number of rotations',
    ex5Answer: 'One rotation = circumference = 1.76 m; 352 / 1.76 = 200 rotations',

    ex6Title: 'Minute Hand Travel',
    ex6Context: 'A clock minute hand of length 15 cm moves in a circle.',
    ex6Question: 'How far does the tip move in 1 hour?',
    ex6Answer: 'Distance in one revolution = circumference = 2πr = 2 × 3.14 × 15 ≈ 94.2 cm',

    // Why/Pro Tip sections (to match Triangle tool UI)
    whyMatterTitle: 'Why Circumference & Area Matter?',
    whyMatterPoint1: 'Practical Uses: Tracks, garden fencing, wheels, and circular designs.',
    whyMatterPoint2: 'Foundation: Builds understanding for sectors, arcs, and mensuration.',
    whyMatterPoint3: 'Unit Sense: Linear (cm/m) vs square (cm²/m²) prevents mistakes.',
    whyMatterPoint4: 'Choice of π: 22/7 for exact fractions with 7; 3.14 for decimals.',

    proTipTitle: 'Pro Tip!',
    proTipText: 'If diameter is given, use C = πd and A = π(d/2)². Keep units consistent and round answers sensibly based on the π you choose.',

    // Buttons
    pause: '⏸️ Pause',
    play: '▶️ Play',
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',

    // Step 2 translations
    step2Step1: 'किसी भी वृत्त के लिए: परिधि C = π × व्यास = 2π × त्रिज्या',
    step2Step2: 'आवश्यकतानुसार π ≈ 22/7 या 3.14 लें',

    // Step 3 translations
    step3Step1: 'एक वृत्त को कई समान क्षेत्रों में काटें और वैकल्पिक रूप से व्यवस्थित करें ताकि एक आयत बन सके',
    step3Step2: 'इसकी चौड़ाई r है और लंबाई लगभग आधी परिधि (πr) है',
    step3Step3: 'अतः क्षेत्रफल = πr²',

    // Step 4 translations
    step4Step1: 'दिया गया व्यास d = 2r, क्षेत्रफल को A = π (d/2)² के रूप में भी लिखा जा सकता है',
    step4Step2: 'परिधि के लिए समान π मानों का उपयोग करें',
    step4Step3: 'A = πr²',
    step4Step4: 'यदि d दिया हो: A = π(d/2)²',

    // Step 5 translations
    step5Step1: 'जब त्रिज्या/व्यास में 7 या उसके गुणक शामिल हों तो सटीक मानों के लिए π = 22/7 का उपयोग करें',
    step5Step2: 'दशमलव उत्तरों के लिए π ≈ 3.14 का उपयोग करें',
    step5Step3: 'परिधि रैखिक इकाइयों (सेमी, मी) का उपयोग करती है',
    step5Step4: 'क्षेत्रफल वर्ग इकाइयों (सेमी², मी²) का उपयोग करता है',
    step5Step5: 'गणना से पहले इकाइयों को परिवर्तित करें',

    // Practice questions (Hindi)
    q1Title: 'व्यास 14 सेमी के लिए परिधि ज्ञात करें (π = 22/7)',
    q1Hint: 'सूत्र C = πd का उपयोग करें',
    q1Solution: 'C = (22/7) × 14 = 44 सेमी',
    q1Answer: '44',

    q2Title: 'त्रिज्या 10.5 सेमी के लिए परिधि ज्ञात करें (π = 22/7)',
    q2Hint: 'C = 2πr का उपयोग करें',
    q2Solution: 'C = 2 × (22/7) × 10.5 = 66 सेमी',
    q2Answer: '66',

    q3Title: 'त्रिज्या 7 सेमी वाले वृत्त का क्षेत्रफल ज्ञात करें (π = 22/7)',
    q3Hint: 'A = πr² का उपयोग करें',
    q3Solution: 'A = (22/7) × 7 × 7 = 154 सेमी²',
    q3Answer: '154',

    q4Title: 'व्यास 9.8 सेमी वाले वृत्त का क्षेत्रफल ज्ञात करें (π = 22/7)',
    q4Hint: 'r = d/2 लें',
    q4Solution: 'r = 4.9 सेमी, A = (22/7) × 4.9 × 4.9 ≈ 75.46 सेमी²',
    q4Answer: '75.46',

    q5Title: 'किसी वृत्त की परिधि 31.4 सेमी है (π = 3.14)। त्रिज्या ज्ञात करें।',
    q5Hint: 'C = 2πr ⇒ r = C/(2π)',
    q5Solution: 'r = 31.4 / (2 × 3.14) = 5 सेमी; क्षेत्रफल = πr² = 78.5 सेमी²',
    q5Answer: '5',

    q6Title: 'त्रिज्या 28 सेमी के पहिये को 352 मीटर चलने के लिए कितने चक्कर लगेंगे? (π = 22/7)',
    q6Hint: 'एक चक्कर में चली दूरी = परिधि',
    q6Solution: 'C = 2 × (22/7) × 28 = 176 सेमी = 1.76 मी. 352 / 1.76 = 200 चक्कर',
    q6Answer: '200',

    // Visual labels
    radius: 'त्रिज्या (r)',
    diameter: 'व्यास (d)',
    pi: 'π (पाई)',
    cm: 'सेमी',
    m: 'मी',
    cm2: 'सेमी²',
    m2: 'मी²',
    circumferenceVisual: 'परिधि दृश्य',
    areaVisual: 'क्षेत्रफल दृश्य',
    diameterTwice: 'व्यास त्रिज्या से दोगुना है',
    diameterFormula: 'd = 2r',
    usePiApprox: 'π ≈ 22/7 या 3.14 का उपयोग करें',
    circleSectorsDesc: 'वृत्त के क्षेत्रों को एक निकट-आयत में व्यवस्थित किया गया → चौड़ाई r, लंबाई πr',
    formulaCirc: 'C = πd = 2πr',
    formulaArea: 'A = πr²',
  },

  // Gujarati translations for Real World + info sections
  gu: {
    // Header
    appTitle: 'વર્તુળ: પરિઘ અને ક્ષેત્રફળ',

    // Navigation
    learn: 'શીખો',
    practice: 'પ્રેક્ટિસ',
    realWorld: 'વાસ્તવિક દુનિયા',
    
    // Common
    previous: 'પાછળ',
    next: 'આગળ',
    play: '▶️ ચલાવો',
    pause: '⏸️ રોકો',
    
    // Practice/UI
    practiceTitle: 'પ્રેક્ટિસ',
    practiceSubtitle: 'પરિઘ અને ક્ષેત્રફળની સમજને પરખો',
    practiceAgain: 'ફરીથી પ્રેક્ટિસ કરો',
    submit: 'સબમિટ કરો',
    tryAgain: 'ફરી પ્રયાસ કરો',
    showHint: 'સંકેત બતાવો',
    hideHint: 'સંકેત છુપાવો',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    score: 'સ્કોર',
    placeholderAnswer: 'તમારો જવાબ અહીં લખો... ✍️',
    prompt: 'આપેલ ડેટા',
    of: 'નો',
    questionLabel: 'પ્રશ્ન',
    answerLabel: 'જવાબ',

    // Learn - Steps
    step1Title: 'વર્તુળની પરિઘ',
    step1Desc: 'વર્તુળની આસપાસની દૂરી કેવી રીતે શોધવી',
    step1Concept:
      'વર્તુળાકાર પ્રદેશની આસપાસની દૂરીને તેની પરિઘ કહેવામાં આવે છે. કિનારી આસપાસ દોરડું વાપરીને અંદાજ મળે છે. સચોટ સંબંધ C = πd = 2πr છે.',

    // Step 1 key points
    circKey1: 'વ્યાખ્યા: વર્તુળની આસપાસની દૂરી = પરિઘ',
    circKey2: 'માપનો વિચાર: એકવાર કિનારી આસપાસ દોરડું લપેટો, પછી લંબાઈનો અંદાજ લાવવા માટે સીધું કરો',
    circKey3: 'વ્યાસનો સંબંધ: C = π × d',
    circKey4: 'ત્રિજ્યાનો સંબંધ: C = 2 × π × r',
    circKey5: 'એકમ: લંબાઈ જેવા જ (સેમી, મી)। π = 22/7 અથવા 3.14 વાપરો',

    // Step 2
    step2Title: 'પરિઘ સૂત્ર',
    step2Desc: 'વ્યાસ, ત્રિજ્યા અને π (પાઇ) ને જોડો',

    // Step 3
    step3Title: 'વર્તુળનું ક્ષેત્રફળ સમજવું',
    step3Desc: 'વર્તુળના ક્ષેત્રોને ફરીથી ગોઠવીને અંતર્જ્ઞાન બનાવો',

    // Step 4
    step4Title: 'ક્ષેત્રફળ સૂત્ર અને કી',
    step4Desc: 'ક્ષેત્રફળ = πr² લાગુ કરો અને વ્યાસ સાથે સંબંધિત કરો',

    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉપયોગો',
    realWorldSubtitle: 'જ્યાં પરિઘ અને ક્ષેત્રફળ મહત્વ ધરાવે છે',

    ex1Title: 'અર્ધવૃત્તીય છેડાવાળો રેસ ટ્રેક',
    ex1Context: 'ટ્રેક મધ્યમાં ચોરસ છે અને બંને છેડે અર્ધવૃત્ત છે. બે ચક્કરની દૂરી માટે કુલ વક્રી લંબાઈ જોઈએ.',
    ex1Question: 'વક્રી ભાગની લંબાઈ કયા સૂત્રથી મળશે?',
    ex1Answer: 'બે અર્ધવૃત્ત મળીને પૂરું વર્તુળ બને છે: લંબાઈ = πd = 2πr',

    ex2Title: 'ગોળ બગીચા આસપાસ દોરડું',
    ex2Context: 'વ્યાસ 21 mના બગીચા આસપાસ એક ચક્કર માટે દોરડાની લંબાઈ શોધો.',
    ex2Question: 'કેટલું દોરડું જોઈએ?',
    ex2Answer: 'C = πd = (22/7) × 21 = 66 m',

    ex3Title: 'ગોળ ટેબલ ટોપ પોલિશિંગ',
    ex3Context: 'ખર્ચ ક્ષેત્રફળ પર આધારિત. ટેબલનો વ્યાસ 1.6 m; પોલિશિંગ દર 15 રૂ/ m².',
    ex3Question: 'કુલ ખર્ચ કેટલો?',
    ex3Answer: 'A = πr² = 3.14 × 1.6² ≈ 8.0384 m² → અંદાજે 120.6 રૂ',

    ex4Title: 'ગોળ બગીચામાં સ્પ્રિન્કલર',
    ex4Context: 'બગીચાનું ક્ષેત્રફળ 314 m²; સ્પ્રિન્કલર 10 m સુધી પહોંચે છે.',
    ex4Question: 'શું આખું બગીચું આવરી લેશે?',
    ex4Answer: 'આવરિત ક્ષેત્ર = πr² = 3.14 × 10² = 314 m² → હા',

    ex5Title: 'ચકરાંના ફરવાં',
    ex5Context: 'ત્રિજ્યા 28 cm વાળું ચકરું 352 m દૂરી માટે કેટલા ફેરા લેવશે?',
    ex5Question: 'ફેરાની સંખ્યા શોધો',
    ex5Answer: 'એક ફેરો = પરિઘ = 1.76 m; 352 / 1.76 = 200',

    ex6Title: 'મિનિટની સૂઈની ચલ',
    ex6Context: 'ઘડિયાળની મિનિટની સૂઈની લંબાઈ 15 cm છે.',
    ex6Question: '1 કલાકમાં છેડાએ કેટલી દૂરી કાપી?',
    ex6Answer: 'એક પરિક્રમા = પરિઘ = 2πr = 2 × 3.14 × 15 ≈ 94.2 cm',

    whyMatterTitle: 'પરિઘ અને ક્ષેત્રફળ શા માટે મહત્વના?',
    whyMatterPoint1: 'વૈવહારિક ઉપયોગ: ટ્રેક્સ, વાડ, ચકરાં અને ગોળ ડિઝાઇન.',
    whyMatterPoint2: 'આધાર: સેક્ટર, આર્ક અને મેનસ્યુરેશન સમજવા માટે.',
    whyMatterPoint3: 'એકમ સમજ: રેખીય (cm/m) સામે ચોરસ (cm²/m²).',
    whyMatterPoint4: 'π ની પસંદગી: 22/7 7ના ગુણક માટે, 3.14 દશાંશ માટે.',

    proTipTitle: 'પ્રો ટીપ!',
    proTipText: 'જો વ્યાસ આપેલો હોય તો C = πd અને A = π(d/2)² વાપરો. એકમો સમાન રાખો અને પસંદ કરેલા π અનુસાર જવાબ ગોળ કરો.',
    clickToExpand: 'વિસ્તૃત કરવા માટે ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા માટે ક્લિક કરો',

    // Step 2 translations
    step2Step1: 'કોઈ પણ વર્તુળ માટે: પરિઘ C = π × વ્યાસ = 2π × ત્રિજ્યા',
    step2Step2: 'જરૂરિયાત મુજબ π ≈ 22/7 અથવા 3.14 લો',

    // Step 3 translations
    step3Step1: 'વર્તુળને ઘણા સમાન ક્ષેત્રોમાં કાપો અને વૈકલ્પિક રીતે ગોઠવો જેથી લંબચોરસ બને',
    step3Step2: 'તેની પહોળાઈ r છે અને લંબાઈ લગભગ અડધી પરિઘ (πr) છે',
    step3Step3: 'આથી ક્ષેત્રફળ = πr²',

    // Step 4 translations
    step4Step1: 'આપેલ વ્યાસ d = 2r, ક્ષેત્રફળને A = π (d/2)² તરીકે પણ લખી શકાય છે',
    step4Step2: 'પરિઘ માટે સમાન π મૂલ્યો વાપરો',
    step4Step3: 'A = πr²',
    step4Step4: 'જો d આપેલ હોય: A = π(d/2)²',

    // Step 5 translations
    step5Step1: 'જ્યારે ત્રિજ્યા/વ્યાસમાં 7 અથવા તેના ગુણકો હોય તો ચોક્કસ મૂલ્યો માટે π = 22/7 વાપરો',
    step5Step2: 'દશાંશ જવાબો માટે π ≈ 3.14 વાપરો',
    step5Step3: 'પરિઘ રેખીય એકમો (સેમી, મી) વાપરે છે',
    step5Step4: 'ક્ષેત્રફળ વર્ગ એકમો (સેમી², મી²) વાપરે છે',
    step5Step5: 'ગણતરી પહેલાં એકમો પરિવર્તિત કરો',

    // Practice questions (Gujarati)
    q1Title: 'વ્યાસ 14 સેમી માટે પરિઘ શોધો (π = 22/7)',
    q1Hint: 'સૂત્ર C = πd વાપરો',
    q1Solution: 'C = (22/7) × 14 = 44 સેમી',
    q1Answer: '44',

    q2Title: 'ત્રિજ્યા 10.5 સેમી માટે પરિઘ શોધો (π = 22/7)',
    q2Hint: 'C = 2πr વાપરો',
    q2Solution: 'C = 2 × (22/7) × 10.5 = 66 સેમી',
    q2Answer: '66',

    q3Title: 'ત્રિજ્યા 7 સેમી વાળા વર્તુળનું ક્ષેત્રફળ શોધો (π = 22/7)',
    q3Hint: 'A = πr² વાપરો',
    q3Solution: 'A = (22/7) × 7 × 7 = 154 સેમી²',
    q3Answer: '154',

    q4Title: 'વ્યાસ 9.8 સેમી વાળા વર્તુળનું ક્ષેત્રફળ શોધો (π = 22/7)',
    q4Hint: 'r = d/2 લો',
    q4Solution: 'r = 4.9 સેમી, A = (22/7) × 4.9 × 4.9 ≈ 75.46 સેમી²',
    q4Answer: '75.46',

    q5Title: 'એક વર્તુળનો પરિઘ 31.4 સેમી છે (π = 3.14). ત્રિજ્યા શોધો.',
    q5Hint: 'C = 2πr ⇒ r = C/(2π)',
    q5Solution: 'r = 31.4 / (2 × 3.14) = 5 સેમી; ક્ષેત્રફળ = πr² = 78.5 સેમી²',
    q5Answer: '5',

    q6Title: 'ત્રિજ્યા 28 સેમીનું ચકરું 352 મીટર ચાલવા કેટલા ફેરા કરશે? (π = 22/7)',
    q6Hint: 'એક ફેરા ની દૂરી = પરિઘ',
    q6Solution: 'C = 2 × (22/7) × 28 = 176 સેમી = 1.76 મી. 352 / 1.76 = 200 ફેરા',
    q6Answer: '200',

    // Visual labels
    radius: 'ત્રિજ્યા (r)',
    diameter: 'વ્યાસ (d)',
    pi: 'π (પાઇ)',
    cm: 'સેમી',
    m: 'મી',
    cm2: 'સેમી²',
    m2: 'મી²',
    circumferenceVisual: 'પરિઘ દૃશ્ય',
    areaVisual: 'ક્ષેત્રફળ દૃશ્ય',
    diameterTwice: 'વ્યાસ ત્રિજ્યા કરતાં બમણો છે',
    diameterFormula: 'd = 2r',
    usePiApprox: 'π ≈ 22/7 અથવા 3.14 વાપરો',
    circleSectorsDesc: 'વર્તુળના ક્ષેત્રોને નજીક-લંબચોરસમાં ગોઠવ્યા → પહોળાઈ r, લંબાઈ πr',
    formulaCirc: 'C = πd = 2πr',
    formulaArea: 'A = πr²',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const langMap = translations[language] ?? {};
    return (langMap[key] ?? translations.en[key] ?? key) as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


