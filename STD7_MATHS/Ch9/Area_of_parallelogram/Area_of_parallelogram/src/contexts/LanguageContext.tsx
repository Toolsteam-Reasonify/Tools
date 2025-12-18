import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    appTitle: 'Area of Parallelogram',
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
    correct: 'Correct!',
    incorrect: 'Incorrect. Try again!',
    score: 'Score',
    attempts: 'Attempts',
    solution: 'Solution',
    
    // Learn Tab - Steps
    step1Title: 'Understanding Parallelograms',
    step1Desc: 'Learn what parallelograms are and how they relate to rectangles',
    step1Concept: 'Two congruent triangles joined along a corresponding side form a parallelogram; the area of each triangle is half the area of that parallelogram.',
    
    step2Title: 'Converting Parallelogram to Rectangle',
    step2Desc: 'Learn how to transform a parallelogram into a rectangle',
    step2Concept: 'Draw a perpendicular line from one vertex to the opposite side. Cut the triangle and move it to the other side to form a rectangle.',
    step2Step1: 'Draw a perpendicular line from vertex to opposite side',
    step2Step2: 'Cut out the triangle',
    step2Step3: 'Move triangle to the other side',
    step2Step4: 'Form a rectangle of equal area',
    
    step3Title: 'Base and Height',
    step3Desc: 'Understand the concepts of base and height in parallelograms',
    step3Question: 'What are the base and height of a parallelogram?',
    step3Answer: 'Any side can be chosen as base. The perpendicular from the opposite vertex to that side is the height.',
    
    step4Title: 'Area Formula',
    step4Desc: 'Derive the formula for area of parallelogram',
    step4Question: 'What is the area formula for a parallelogram?',
    step4Answer: 'Area of parallelogram = base × height = b × h',
    
    // Learn Tab - Key Points
    keyPoint1: 'Parallelogram has opposite sides parallel',
    keyPoint2: 'Can be transformed into rectangle',
    keyPoint3: 'Base and height are perpendicular',
    keyPoint4: 'Area equals base times height',
    
    formulaKey1: 'Length equals base',
    formulaKey2: 'Breadth equals height',
    formulaKey3: 'Area = length × breadth',
    formulaKey4: 'Area = base × height',
    
    // Practice Mode
    practiceTitle: 'Practice Questions',
    practiceSubtitle: 'Test your understanding of parallelogram area',
    dataTitle: 'Given Parallelogram',
    questionTitle: 'Question',
    hintLabel: 'Hint',
    solutionLabel: 'Solution',
    stepLabel: 'Step',
    
    // Practice Questions
    q1Question: 'What is the area of a parallelogram with base 8 cm and height 3.5 cm?',
    q1Hint: 'Use the formula: Area = base × height',
    q1Solution: 'Area = base × height = 8 cm × 3.5 cm = 28 sq cm',
    q1Answer: '28',
    
    q2Question: 'Find the area of a parallelogram with base 8 cm and height 2.5 cm',
    q2Hint: 'Multiply base and height values',
    q2Solution: 'Area = 8 cm × 2.5 cm = 20 sq cm',
    q2Answer: '20',
    
    q3Question: 'In parallelogram ABCD, AB = 7.2 cm and height from C to AB is 4.5 cm. Find the area.',
    q3Hint: 'AB is the base, and the perpendicular distance is the height',
    q3Solution: 'Area = base × height = 7.2 cm × 4.5 cm = 32.4 sq cm',
    q3Answer: '32.4',
    
    q4Question: 'A parallelogram has base 5 units and height 3 units. What is its area?',
    q4Hint: 'Apply the area formula directly',
    q4Solution: 'Area = 5 × 3 = 15 sq units',
    q4Answer: '15',
    
    q5Question: 'Find the area of a parallelogram with base 6 units and height 2 units',
    q5Hint: 'Multiply base and height',
    q5Solution: 'Area = 6 × 2 = 12 sq units',
    q5Answer: '12',
    
    q6Question: 'A parallelogram has base 7 cm and height 4 cm. Calculate its area.',
    q6Hint: 'Use Area = base × height formula',
    q6Solution: 'Area = 7 cm × 4 cm = 28 sq cm',
    q6Answer: '28',
    
    // Real World Examples
    realWorldTitle: 'Real World Applications',
    realWorldSubtitle: 'See how parallelogram area is used in everyday life',
    
    ex1Title: 'Land Plot Calculation',
    ex1Context: 'A land plot in the shape of a parallelogram has base 50 meters and height 30 meters. Calculate the area.',
    ex1Question: 'What is the area of the land plot?',
    ex1Answer: 'Area = 50 m × 30 m = 1500 sq meters',
    
    ex2Title: 'Garden Design',
    ex2Context: 'A garden bed is designed as a parallelogram with base 12 feet and height 8 feet. Find the area for planting.',
    ex2Question: 'How much area is available for planting?',
    ex2Answer: 'Area = 12 ft × 8 ft = 96 sq feet',
    
    ex3Title: 'Tiles Installation',
    ex3Context: 'A room floor shaped like a parallelogram has base 15 meters and height 10 meters. Calculate tiles needed.',
    ex3Question: 'What is the floor area?',
    ex3Answer: 'Area = 15 m × 10 m = 150 sq meters',
    
    ex4Title: 'Fencing a Field',
    ex4Context: 'A field in parallelogram shape has base 40 meters and height 25 meters. Find the area to be fenced.',
    ex4Question: 'What is the area of the field?',
    ex4Answer: 'Area = 40 m × 25 m = 1000 sq meters',
    
    ex5Title: 'Carpet Installation',
    ex5Context: 'A parallelogram-shaped room needs carpet. Base is 20 feet and height is 12 feet. Calculate area.',
    ex5Question: 'How much carpet is needed?',
    ex5Answer: 'Area = 20 ft × 12 ft = 240 sq feet',
    
    ex6Title: 'Painting a Wall',
    ex6Context: 'A wall in parallelogram shape has base 8 meters and height 3 meters. Find the area to be painted.',
    ex6Question: 'What is the wall area?',
    ex6Answer: 'Area = 8 m × 3 m = 24 sq meters',
    
    // Why Parallelograms Matter section
    whyMatterTitle: 'Why Parallelogram Area Matters?',
    whyMatterPoint1: 'Practical Applications: Used in architecture, construction, and land measurement.',
    whyMatterPoint2: 'Foundation Concept: Helps understand area calculations for other quadrilaterals.',
    whyMatterPoint3: 'Real Life: Essential for calculating floor areas, land plots, and surfaces.',
    whyMatterPoint4: 'Mathematical Base: Foundation for understanding geometry and spatial reasoning.',
    
    // Pro Tip section
    proTipTitle: 'Pro Tip!',
    proTipText: 'Remember: To find the area of a parallelogram, you need only the base and the corresponding height. The height must be perpendicular to the base! 📐✨',
    
    // Learn section additional translations
    sampleParallelogram: '📐 Sample Parallelogram',
    convertingParallelogram: '🔄 Converting Parallelogram',
    transformation: 'Transformation',
    parallelogramToRectangle: 'Parallelogram → Rectangle',
    base: 'Base',
    height: 'Height',
    area: 'Area',
    perimeter: 'Perimeter',
    side: 'Side',
    baseAndHeight: 'Base and Height',
    areaFormula: 'Area Formula',
    perimeterFormula: 'Perimeter Formula',
    areaEquals: 'Area = base × height',
    perimeterEquals: 'Perimeter = 2 × (base + side)',
    formula: 'Formula: b × h',
    perimeterFormulaText: 'Formula: 2 × (a + b)',
    pause: '⏸️ Pause',
    play: '▶️ Play',
    
    // Practice section additional translations
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You\'ve finished all parallelogram exercises!',
    yourScore: 'Your Score',
    accuracy: 'Accuracy',
    performance: 'Performance',
    totalAttempts: 'Total Attempts',
    exerciseBreakdown: 'Exercise Breakdown',
    questionLabel: 'Question',
    attemptLabel: 'attempt(s)',
    practiceAgain: '🔄 Practice Again',
    
    // Input and UI
    placeholderAnswer: 'Type your answer here... ✍️',
    answerLabel: 'Answer',
    viewAssessment: 'View Assessment',
    
    // Units
    cm: 'cm',
    m: 'm',
    ft: 'ft',
    units: 'units',
    sqCm: 'sq cm',
    sqM: 'sq m',
    sqFt: 'sq ft',
    sqUnits: 'sq units',
    
    // Progress labels
    questionProgress: 'Question',
    of: 'of',
    
    // Button labels
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
    
    // Example
    example: 'Example',
    
    // Step 5 - Triangle perimeter
    step5Title: 'Perimeter of Parallelogram',
    step5Desc: 'Learn how to calculate the perimeter of a parallelogram',
    step5Concept: 'Perimeter of a parallelogram is the sum of all sides. Since opposite sides are equal, perimeter = 2 × (base + side).',
    step5Question: 'If base = 7 units and side = 5 units, what is the perimeter?',
    step5Answer: 'Perimeter = 2 × (7 + 5) = 24 units',
    parallelogram: 'Parallelogram',
    parallelogramPerimeterFormula: 'Perimeter = 2 × (base + side)',
  },
  hi: {
    // Header
    appTitle: 'समांतर चतुर्भुज का क्षेत्रफल',
    selectLanguage: 'भाषा चुनें',
    
    // Navigation
    learn: 'सीखें',
    practice: 'अभ्यास',
    realWorld: 'वास्तविक दुनिया',
    
    // Common
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    tryAgain: 'पुनः प्रयास करें',
    showHint: 'संकेत दिखाएं',
    hideHint: 'संकेत छिपाएं',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छिपाएं',
    yourAnswer: 'आपका उत्तर',
    correct: 'सही!',
    incorrect: 'गलत। पुनः प्रयास करें!',
    score: 'अंक',
    attempts: 'प्रयास',
    solution: 'समाधान',
    
    // Learn Tab - Steps
    step1Title: 'समांतर चतुर्भुज को समझना',
    step1Desc: 'जानें कि समांतर चतुर्भुज क्या हैं और वे आयत से कैसे संबंधित हैं',
    step1Concept: 'एक समांतर चतुर्भुज को उसके भागों को काटकर और पुनर्व्यवस्थित करके समान क्षेत्रफल के आयत में परिवर्तित किया जा सकता है।',
    
    step2Title: 'समांतर चतुर्भुज को आयत में बदलना',
    step2Desc: 'समांतर चतुर्भुज को आयत में बदलना सीखें',
    step2Concept: 'एक शीर्ष से विपरीत भुजा तक एक लंबवत रेखा खींचें। त्रिभुज को काटें और इसे दूसरी ओर ले जाकर आयत बनाएं।',
    step2Step1: 'शीर्ष से विपरीत भुजा तक लंबवत रेखा खींचें',
    step2Step2: 'त्रिभुज को काटें',
    step2Step3: 'त्रिभुज को दूसरी ओर ले जाएं',
    step2Step4: 'समान क्षेत्रफल का आयत बनाएं',
    
    step3Title: 'आधार और ऊंचाई',
    step3Desc: 'समांतर चतुर्भुज में आधार और ऊंचाई की अवधारणाओं को समझें',
    step3Question: 'समांतर चतुर्भुज का आधार और ऊंचाई क्या हैं?',
    step3Answer: 'किसी भी भुजा को आधार चुना जा सकता है। विपरीत शीर्ष से उस भुजा तक लंबवत दूरी ऊंचाई है।',
    
    step4Title: 'समांतर चतुर्भुज का परिमाप',
    step4Desc: 'समांतर चतुर्भुज के परिमाप की गणना करना सीखें',
    step4Question: 'समांतर चतुर्भुज के परिमाप का सूत्र क्या है?',
    step4Answer: 'परिमाप = सभी भुजाओं का योग = 2 × (आधार + भुजा) = 2 × (a + b)',
    
    // Learn Tab - Key Points
    keyPoint1: 'समांतर चतुर्भुज की सम्मुख भुजाएं समानांतर होती हैं',
    keyPoint2: 'आयत में परिवर्तित किया जा सकता है',
    keyPoint3: 'आधार और ऊंचाई लंबवत होते हैं',
    keyPoint4: 'क्षेत्रफल आधार गुणा ऊंचाई के बराबर होता है',
    
    formulaKey1: 'लंबाई आधार के बराबर है',
    formulaKey2: 'चौड़ाई ऊंचाई के बराबर है',
    formulaKey3: 'क्षेत्रफल = लंबाई × चौड़ाई',
    formulaKey4: 'क्षेत्रफल = आधार × ऊंचाई',
    
    // Practice Mode
    practiceTitle: 'अभ्यास प्रश्न',
    practiceSubtitle: 'समांतर चतुर्भुज के क्षेत्रफल की अपनी समझ का परीक्षण करें',
    dataTitle: 'दिया गया समांतर चतुर्भुज',
    questionTitle: 'प्रश्न',
    hintLabel: 'संकेत',
    solutionLabel: 'समाधान',
    stepLabel: 'चरण',
    
    // Practice Questions
    q1Question: 'आधार 8 सेमी और ऊंचाई 3.5 सेमी वाले समांतर चतुर्भुज का क्षेत्रफल क्या है?',
    q1Hint: 'सूत्र का उपयोग करें: क्षेत्रफल = आधार × ऊंचाई',
    q1Solution: 'क्षेत्रफल = आधार × ऊंचाई = 8 सेमी × 3.5 सेमी = 28 वर्ग सेमी',
    q1Answer: '28',
    
    q2Question: 'आधार 8 सेमी और ऊंचाई 2.5 सेमी वाले समांतर चतुर्भुज का क्षेत्रफल ज्ञात करें',
    q2Hint: 'आधार और ऊंचाई के मूल्यों को गुणा करें',
    q2Solution: 'क्षेत्रफल = 8 सेमी × 2.5 सेमी = 20 वर्ग सेमी',
    q2Answer: '20',
    
    q3Question: 'समांतर चतुर्भुज ABCD में, AB = 7.2 सेमी और C से AB तक की ऊंचाई 4.5 सेमी है। क्षेत्रफल ज्ञात करें।',
    q3Hint: 'AB आधार है, और लंबवत दूरी ऊंचाई है',
    q3Solution: 'क्षेत्रफल = आधार × ऊंचाई = 7.2 सेमी × 4.5 सेमी = 32.4 वर्ग सेमी',
    q3Answer: '32.4',
    
    q4Question: 'एक समांतर चतुर्भुज का आधार 5 इकाई और ऊंचाई 3 इकाई है। इसका क्षेत्रफल क्या है?',
    q4Hint: 'क्षेत्रफल सूत्र को सीधे लागू करें',
    q4Solution: 'क्षेत्रफल = 5 × 3 = 15 वर्ग इकाई',
    q4Answer: '15',
    
    q5Question: 'आधार 6 इकाई और ऊंचाई 2 इकाई वाले समांतर चतुर्भुज का क्षेत्रफल ज्ञात करें',
    q5Hint: 'आधार और ऊंचाई को गुणा करें',
    q5Solution: 'क्षेत्रफल = 6 × 2 = 12 वर्ग इकाई',
    q5Answer: '12',
    
    q6Question: 'एक समांतर चतुर्भुज का आधार 7 सेमी और ऊंचाई 4 सेमी है। इसका क्षेत्रफल ज्ञात करें।',
    q6Hint: 'क्षेत्रफल = आधार × ऊंचाई सूत्र का उपयोग करें',
    q6Solution: 'क्षेत्रफल = 7 सेमी × 4 सेमी = 28 वर्ग सेमी',
    q6Answer: '28',
    
    // Real World Examples
    realWorldTitle: 'वास्तविक दुनिया के अनुप्रयोग',
    realWorldSubtitle: 'देखें कि रोजमर्रा की जिंदगी में समांतर चतुर्भुज के क्षेत्रफल का उपयोग कैसे किया जाता है',
    
    ex1Title: 'भूमि प्लॉट गणना',
    ex1Context: 'समांतर चतुर्भुज के आकार का एक भूमि प्लॉट का आधार 50 मीटर और ऊंचाई 30 मीटर है। क्षेत्रफल की गणना करें।',
    ex1Question: 'भूमि प्लॉट का क्षेत्रफल क्या है?',
    ex1Answer: 'क्षेत्रफल = 50 मी × 30 मी = 1500 वर्ग मीटर',
    
    ex2Title: 'बगीचा डिज़ाइन',
    ex2Context: 'एक बगीचे के बिस्तर को समांतर चतुर्भुज के रूप में डिज़ाइन किया गया है जिसका आधार 12 फीट और ऊंचाई 8 फीट है। रोपण के लिए क्षेत्रफल ज्ञात करें।',
    ex2Question: 'रोपण के लिए कितना क्षेत्रफल उपलब्ध है?',
    ex2Answer: 'क्षेत्रफल = 12 फीट × 8 फीट = 96 वर्ग फीट',
    
    ex3Title: 'टाइल स्थापना',
    ex3Context: 'समांतर चतुर्भुज के आकार का एक कमरे का फर्श का आधार 15 मीटर और ऊंचाई 10 मीटर है। आवश्यक टाइलों की गणना करें।',
    ex3Question: 'फर्श का क्षेत्रफल क्या है?',
    ex3Answer: 'क्षेत्रफल = 15 मी × 10 मी = 150 वर्ग मीटर',
    
    ex4Title: 'खेत को बाड़ लगाना',
    ex4Context: 'समांतर चतुर्भुज के आकार के एक खेत का आधार 40 मीटर और ऊंचाई 25 मीटर है। बाड़ लगाने के लिए क्षेत्रफल ज्ञात करें।',
    ex4Question: 'खेत का क्षेत्रफल क्या है?',
    ex4Answer: 'क्षेत्रफल = 40 मी × 25 मी = 1000 वर्ग मीटर',
    
    ex5Title: 'कार्पेट स्थापना',
    ex5Context: 'समांतर चतुर्भुज के आकार के एक कमरे में कार्पेट की आवश्यकता है। आधार 20 फीट और ऊंचाई 12 फीट है। क्षेत्रफल की गणना करें।',
    ex5Question: 'कितना कार्पेट चाहिए?',
    ex5Answer: 'क्षेत्रफल = 20 फीट × 12 फीट = 240 वर्ग फीट',
    
    ex6Title: 'दीवार पेंट करना',
    ex6Context: 'समांतर चतुर्भुज के आकार की एक दीवार का आधार 8 मीटर और ऊंचाई 3 मीटर है। पेंट करने के लिए क्षेत्रफल ज्ञात करें।',
    ex6Question: 'दीवार का क्षेत्रफल क्या है?',
    ex6Answer: 'क्षेत्रफल = 8 मी × 3 मी = 24 वर्ग मीटर',
    
    // Why Parallelograms Matter section
    whyMatterTitle: 'समांतर चतुर्भुज का क्षेत्रफल क्यों महत्वपूर्ण है?',
    whyMatterPoint1: 'व्यावहारिक अनुप्रयोग: वास्तुकला, निर्माण और भूमि मापन में उपयोग किया जाता है।',
    whyMatterPoint2: 'मूल अवधारणा: अन्य चतुर्भुजों के क्षेत्रफल की गणना को समझने में मदद करता है।',
    whyMatterPoint3: 'वास्तविक जीवन: फर्श क्षेत्रफल, भूमि प्लॉट और सतहों की गणना के लिए आवश्यक है।',
    whyMatterPoint4: 'गणितीय आधार: ज्यामिति और स्थानिक तर्क को समझने का आधार।',
    
    // Pro Tip section
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipText: 'याद रखें: समांतर चतुर्भुज का क्षेत्रफल ज्ञात करने के लिए, आपको केवल आधार और संबंधित ऊंचाई की आवश्यकता है। ऊंचाई आधार के लंबवत होनी चाहिए! 📐✨',
    
    // Learn section additional translations
    sampleParallelogram: '📐 नमूना समांतर चतुर्भुज',
    convertingParallelogram: '🔄 समांतर चतुर्भुज को बदलना',
    transformation: 'परिवर्तन',
    parallelogramToRectangle: 'समांतर चतुर्भुज → आयत',
    base: 'आधार',
    height: 'ऊंचाई',
    area: 'क्षेत्रफल',
    baseAndHeight: 'आधार और ऊंचाई',
    areaFormula: 'क्षेत्रफल सूत्र',
    areaEquals: 'क्षेत्रफल = आधार × ऊंचाई',
    formula: 'सूत्र: b × h',
    pause: '⏸️ रोकें',
    play: '▶️ चलाएं',
    
    // Practice section additional translations
    practiceComplete: 'अभ्यास पूरा!',
    practiceCompleteSubtitle: 'आपने सभी समांतर चतुर्भुज अभ्यास पूरे कर लिए हैं!',
    yourScore: 'आपका स्कोर',
    accuracy: 'सटीकता',
    performance: 'प्रदर्शन',
    totalAttempts: 'कुल प्रयास',
    exerciseBreakdown: 'अभ्यास विवरण',
    questionLabel: 'प्रश्न',
    attemptLabel: 'प्रयास',
    practiceAgain: '🔄 फिर से अभ्यास करें',
    
    // Input and UI
    placeholderAnswer: 'अपना जवाब यहाँ टाइप करें... ✍️',
    answerLabel: 'जवाब',
    viewAssessment: 'मूल्यांकन देखें',
    
    // Units
    cm: 'सेमी',
    m: 'मी',
    ft: 'फीट',
    units: 'इकाई',
    sqCm: 'वर्ग सेमी',
    sqM: 'वर्ग मी',
    sqFt: 'वर्ग फीट',
    sqUnits: 'वर्ग इकाई',
    
    // Progress labels
    questionProgress: 'प्रश्न',
    of: 'का',
    
    // Button labels
    clickToExpand: 'विस्तार करने के लिए क्लिक करें',
    clickToCollapse: 'संकुचित करने के लिए क्लिक करें',
    
    // Example
    example: 'उदाहरण',
    
    // Perimeter translations
    perimeter: 'परिमाप',
    side: 'भुजा',
    perimeterFormula: 'परिमाप सूत्र',
    perimeterEquals: 'परिमाप = 2 × (आधार + भुजा)',
    perimeterFormulaText: 'सूत्र: 2 × (a + b)',
    step4Concept: 'समांतर चतुर्भुज का परिमाप उसकी चारों भुजाओं का योग होता है। चूंकि सम्मुख भुजाएं बराबर होती हैं, परिमाप = 2 × (आधार + आसन्न भुजा)।',
    
    // Step 5 - Triangle perimeter (HI)
    step5Title: 'समांतर चतुर्भुज का परिमाप',
    step5Desc: 'समांतर चतुर्भुज के परिमाप की गणना करना सीखें',
    step5Concept: 'समांतर चतुर्भुज का परिमाप उसकी चारों भुजाओं का योग है। चूंकि सम्मुख भुजाएं बराबर होती हैं, परिमाप = 2 × (आधार + भुजा)।',
    step5Question: 'यदि आधार = 7 इकाई और भुजा = 5 इकाई हो, तो परिमाप क्या होगा?',
    step5Answer: 'परिमाप = 2 × (7 + 5) = 24 इकाई',
    parallelogram: 'समांतर चतुर्भुज',
    parallelogramPerimeterFormula: 'परिमाप = 2 × (आधार + भुजा)',
  },
  gu: {
    // Header
    appTitle: 'સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ',
    selectLanguage: 'ભાષા પસંદ કરો',
    
    // Navigation
    learn: 'શીખો',
    practice: 'પ્રેક્ટિસ',
    realWorld: 'વાસ્તવિક દુનિયા',
    
    // Common
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'સબમિટ કરો',
    tryAgain: 'ફરી પ્રયાસ કરો',
    showHint: 'સંકેત બતાવો',
    hideHint: 'સંકેત છુપાવો',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    yourAnswer: 'તમારો જવાબ',
    correct: 'સાચું!',
    incorrect: 'ખોટું. ફરી પ્રયાસ કરો!',
    score: 'સ્કોર',
    attempts: 'પ્રયાસો',
    solution: 'ઉકેલ',
    
    // Learn Tab - Steps
    step1Title: 'સમાંતર ચતુષ્કોણને સમજવા',
    step1Desc: 'સમાંતર ચતુષ્કોણ શું છે અને તે લંબચોરસ સાથે કેવી રીતે સંબંધિત છે તે શીખો',
    step1Concept: 'સમાંતર ચતુષ્કોણને તેના ભાગોને કાપીને અને પુનઃવ્યવસ્થિત કરીને સમાન ક્ષેત્રફળના લંબચોરસમાં રૂપાંતરિત કરી શકાય છે।',
    
    step2Title: 'સમાંતર ચતુષ્કોણને લંબચોરસમાં બદલવું',
    step2Desc: 'સમાંતર ચતુષ્કોણને લંબચોરસમાં બદલવાનું શીખો',
    step2Concept: 'એક શિરોબિંદુથી વિરુદ્ધ બાજુ સુધી લંબ રેખા દોરો। ત્રિકોણને કાપો અને તેને બીજી બાજુ ખસેડીને લંબચોરસ બનાવો।',
    step2Step1: 'શિરોબિંદુથી વિરુદ્ધ બાજુ સુધી લંબ રેખા દોરો',
    step2Step2: 'ત્રિકોણને કાપો',
    step2Step3: 'ત્રિકોણને બીજી બાજુ ખસેડો',
    step2Step4: 'સમાન ક્ષેત્રફળનું લંબચોરસ બનાવો',
    
    step3Title: 'પાયો અને ઊંચાઈ',
    step3Desc: 'સમાંતર ચતુષ્કોણમાં પાયો અને ઊંચાઈની ખ્યાલોને સમજો',
    step3Question: 'સમાંતર ચતુષ્કોણનો પાયો અને ઊંચાઈ શું છે?',
    step3Answer: 'કોઈપણ બાજુને પાયો તરીકે પસંદ કરી શકાય છે। વિરુદ્ધ શિરોબિંદુથી તે બાજુ સુધીનું લંબ અંતર ઊંચાઈ છે।',
    
    step4Title: 'સમાંતર ચતુષ્કોણની પરિમિતિ',
    step4Desc: 'સમાંતર ચતુષ્કોણની પરિમિતિની ગણતરી કરવાનું શીખો',
    step4Question: 'સમાંતર ચતુષ્કોણની પરિમિતિનું સૂત્ર શું છે?',
    step4Answer: 'પરિમિતિ = બધી બાજુઓનો સરવાળો = 2 × (પાયો + બાજુ) = 2 × (a + b)',
    
    // Learn Tab - Key Points
    keyPoint1: 'સમાંતર ચતુષ્કોણની સામસામેની બાજુઓ સમાંતર હોય છે',
    keyPoint2: 'લંબચોરસમાં રૂપાંતરિત કરી શકાય છે',
    keyPoint3: 'પાયો અને ઊંચાઈ લંબ છે',
    keyPoint4: 'ક્ષેત્રફળ પાયો ગુણ્યા ઊંચાઈ બરાબર છે',
    
    formulaKey1: 'લંબાઈ પાયાની બરાબર છે',
    formulaKey2: 'પહોળાઈ ઊંચાઈની બરાબર છે',
    formulaKey3: 'ક્ષેત્રફળ = લંબાઈ × પહોળાઈ',
    formulaKey4: 'ક્ષેત્રફળ = પાયો × ઊંચાઈ',
    
    // Practice Mode
    practiceTitle: 'પ્રેક્ટિસ પ્રશ્નો',
    practiceSubtitle: 'સમાંતર ચતુષ્કોણના ક્ષેત્રફળની તમારી સમજણનું પરીક્ષણ કરો',
    dataTitle: 'આપેલ સમાંતર ચતુષ્કોણ',
    questionTitle: 'પ્રશ્ન',
    hintLabel: 'સંકેત',
    solutionLabel: 'ઉકેલ',
    stepLabel: 'પગલું',
    
    // Practice Questions
    q1Question: 'પાયો 8 સેમી અને ઊંચાઈ 3.5 સેમી સાથેના સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ શું છે?',
    q1Hint: 'સૂત્રનો ઉપયોગ કરો: ક્ષેત્રફળ = પાયો × ઊંચાઈ',
    q1Solution: 'ક્ષેત્રફળ = પાયો × ઊંચાઈ = 8 સેમી × 3.5 સેમી = 28 ચો. સેમી',
    q1Answer: '28',
    
    q2Question: 'પાયો 8 સેમી અને ઊંચાઈ 2.5 સેમી સાથેના સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ શોધો',
    q2Hint: 'પાયો અને ઊંચાઈના મૂલ્યોનો ગુણાકાર કરો',
    q2Solution: 'ક્ષેત્રફળ = 8 સેમી × 2.5 સેમી = 20 ચો. સેમી',
    q2Answer: '20',
    
    q3Question: 'સમાંતર ચતુષ્કોણ ABCD માં, AB = 7.2 સેમી અને C થી AB સુધીની ઊંચાઈ 4.5 સેમી છે। ક્ષેત્રફળ શોધો।',
    q3Hint: 'AB પાયો છે, અને લંબ અંતર ઊંચાઈ છે',
    q3Solution: 'ક્ષેત્રફળ = પાયો × ઊંચાઈ = 7.2 સેમી × 4.5 સેમી = 32.4 ચો. સેમી',
    q3Answer: '32.4',
    
    q4Question: 'એક સમાંતર ચતુષ્કોણનો પાયો 5 એકમ અને ઊંચાઈ 3 એકમ છે। તેનું ક્ષેત્રફળ શું છે?',
    q4Hint: 'ક્ષેત્રફળ સૂત્રને સીધું લાગુ કરો',
    q4Solution: 'ક્ષેત્રફળ = 5 × 3 = 15 ચો. એકમ',
    q4Answer: '15',
    
    q5Question: 'પાયો 6 એકમ અને ઊંચાઈ 2 એકમ સાથેના સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ શોધો',
    q5Hint: 'પાયો અને ઊંચાઈનો ગુણાકાર કરો',
    q5Solution: 'ક્ષેત્રફળ = 6 × 2 = 12 ચો. એકમ',
    q5Answer: '12',
    
    q6Question: 'એક સમાંતર ચતુષ્કોણનો પાયો 7 સેમી અને ઊંચાઈ 4 સેમી છે। તેનું ક્ષેત્રફળ ગણો।',
    q6Hint: 'ક્ષેત્રફળ = પાયો × ઊંચાઈ સૂત્રનો ઉપયોગ કરો',
    q6Solution: 'ક્ષેત્રફળ = 7 સેમી × 4 સેમી = 28 ચો. સેમી',
    q6Answer: '28',
    
    // Real World Examples
    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉપયોગો',
    realWorldSubtitle: 'રોજિંદા જીવનમાં સમાંતર ચતુષ્કોણના ક્ષેત્રફળનો ઉપયોગ કેવી રીતે થાય છે તે જુઓ',
    
    ex1Title: 'જમીન પ્લોટ ગણતરી',
    ex1Context: 'સમાંતર ચતુષ્કોણના આકારનો જમીન પ્લોટનો પાયો 50 મીટર અને ઊંચાઈ 30 મીટર છે। ક્ષેત્રફળની ગણતરી કરો।',
    ex1Question: 'જમીન પ્લોટનું ક્ષેત્રફળ શું છે?',
    ex1Answer: 'ક્ષેત્રફળ = 50 મી × 30 મી = 1500 ચો. મીટર',
    
    ex2Title: 'બગીચો ડિઝાઇન',
    ex2Context: 'એક બગીચાની ક્યારીને સમાંતર ચતુષ્કોણ તરીકે ડિઝાઇન કરવામાં આવી છે જેનો પાયો 12 ફૂટ અને ઊંચાઈ 8 ફૂટ છે। રોપણી માટે ક્ષેત્રફળ શોધો।',
    ex2Question: 'રોપણી માટે કેટલું ક્ષેત્રફળ ઉપલબ્ધ છે?',
    ex2Answer: 'ક્ષેત્રફળ = 12 ફૂટ × 8 ફૂટ = 96 ચો. ફૂટ',
    
    ex3Title: 'ટાઇલ ઇન્સ્ટોલેશન',
    ex3Context: 'સમાંતર ચતુષ્કોણના આકારના રૂમની ફ્લોરનો પાયો 15 મીટર અને ઊંચાઈ 10 મીટર છે। જરૂરી ટાઇલોની ગણતરી કરો।',
    ex3Question: 'ફ્લોરનું ક્ષેત્રફળ શું છે?',
    ex3Answer: 'ક્ષેત્રફળ = 15 મી × 10 મી = 150 ચો. મીટર',
    
    ex4Title: 'ખેતરને વાડ લગાવવી',
    ex4Context: 'સમાંતર ચતુષ્કોણના આકારના ખેતરનો પાયો 40 મીટર અને ઊંચાઈ 25 મીટર છે। વાડ લગાવવા માટે ક્ષેત્રફળ શોધો।',
    ex4Question: 'ખેતરનું ક્ષેત્રફળ શું છે?',
    ex4Answer: 'ક્ષેત્રફળ = 40 મી × 25 મી = 1000 ચો. મીટર',
    
    ex5Title: 'કાર્પેટ ઇન્સ્ટોલેશન',
    ex5Context: 'સમાંતર ચતુષ્કોણના આકારના રૂમને કાર્પેટની જરૂર છે। પાયો 20 ફૂટ અને ઊંચાઈ 12 ફૂટ છે। ક્ષેત્રફળની ગણતરી કરો।',
    ex5Question: 'કેટલું કાર્પેટ જોઈએ?',
    ex5Answer: 'ક્ષેત્રફળ = 20 ફૂટ × 12 ફૂટ = 240 ચો. ફૂટ',
    
    ex6Title: 'દીવાલ પેઇન્ટ કરવી',
    ex6Context: 'સમાંતર ચતુષ્કોણના આકારની દીવાલનો પાયો 8 મીટર અને ઊંચાઈ 3 મીટર છે। પેઇન્ટ કરવા માટે ક્ષેત્રફળ શોધો।',
    ex6Question: 'દીવાલનું ક્ષેત્રફળ શું છે?',
    ex6Answer: 'ક્ષેત્રફળ = 8 મી × 3 મી = 24 ચો. મીટર',
    
    // Why Parallelograms Matter section
    whyMatterTitle: 'સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ શા માટે મહત્વપૂર્ણ છે?',
    whyMatterPoint1: 'વ્યવહારિક ઉપયોગો: આર્કિટેક્ચર, બાંધકામ અને જમીન માપનમાં ઉપયોગ થાય છે।',
    whyMatterPoint2: 'મૂળ ખ્યાલ: અન્ય ચતુષ્કોણોના ક્ષેત્રફળની ગણતરી સમજવામાં મદદ કરે છે।',
    whyMatterPoint3: 'વાસ્તવિક જીવન: ફ્લોર ક્ષેત્રફળ, જમીન પ્લોટ અને સપાટીઓની ગણતરી માટે આવશ્યક છે।',
    whyMatterPoint4: 'ગણિતીય આધાર: ભૂમિતિ અને અવકાશી તર્કને સમજવાનો આધાર।',
    
    // Pro Tip section
    proTipTitle: 'વિશેષજ્ઞ સૂચના!',
    proTipText: 'યાદ રાખો: સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ શોધવા માટે, તમારે ફક્ત પાયો અને સંબંધિત ઊંચાઈની જરૂર છે। ઊંચાઈ પાયાને લંબ હોવી જોઈએ! 📐✨',
    
    // Learn section additional translations
    sampleParallelogram: '📐 નમૂના સમાંતર ચતુષ્કોણ',
    convertingParallelogram: '🔄 સમાંતર ચતુષ્કોણને બદલવું',
    transformation: 'રૂપાંતરણ',
    parallelogramToRectangle: 'સમાંતર ચતુષ્કોણ → લંબચોરસ',
    base: 'પાયો',
    height: 'ઊંચાઈ',
    area: 'ક્ષેત્રફળ',
    baseAndHeight: 'પાયો અને ઊંચાઈ',
    areaFormula: 'ક્ષેત્રફળ સૂત્ર',
    areaEquals: 'ક્ષેત્રફળ = પાયો × ઊંચાઈ',
    formula: 'સૂત્ર: b × h',
    pause: '⏸️ રોકો',
    play: '▶️ ચલાવો',
    
    // Practice section additional translations
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે બધા સમાંતર ચતુષ્કોણ પ્રેક્ટિસ પૂરા કર્યા છે!',
    yourScore: 'તમારો સ્કોર',
    accuracy: 'ચોકસાઈ',
    performance: 'પ્રદર્શન',
    totalAttempts: 'કુલ પ્રયાસો',
    exerciseBreakdown: 'પ્રેક્ટિસ વિગતો',
    questionLabel: 'પ્રશ્ન',
    attemptLabel: 'પ્રયાસો',
    practiceAgain: '🔄 ફરીથી પ્રેક્ટિસ કરો',
    
    // Input and UI
    placeholderAnswer: 'તમારો જવાબ અહીં લખો... ✍️',
    answerLabel: 'જવાબ',
    viewAssessment: 'મૂલ્યાંકન જુઓ',
    
    // Units
    cm: 'સેમી',
    m: 'મી',
    ft: 'ફૂટ',
    units: 'એકમ',
    sqCm: 'ચો. સેમી',
    sqM: 'ચો. મી',
    sqFt: 'ચો. ફૂટ',
    sqUnits: 'ચો. એકમ',
    
    // Progress labels
    questionProgress: 'પ્રશ્ન',
    of: 'નો',
    
    // Button labels
    clickToExpand: 'વિસ્તૃત કરવા માટે ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા માટે ક્લિક કરો',
    
    // Example
    example: 'ઉદાહરણ',
    
    // Perimeter translations
    perimeter: 'પરિમિતિ',
    side: 'બાજુ',
    perimeterFormula: 'પરિમિતિ સૂત્ર',
    perimeterEquals: 'પરિમિતિ = 2 × (પાયો + બાજુ)',
    perimeterFormulaText: 'સૂત્ર: 2 × (a + b)',
    step4Concept: 'સમાંતર ચતુષ્કોણની પરિમિતિ તેની બધી ચાર બાજુઓનો સરવાળો છે। કારણ કે સામસામેની બાજુઓ સમાન હોય છે, પરિમિતિ = 2 × (પાયો + સંલગ્ન બાજુ)।',
    
    // Step 5 - Triangle perimeter (GU)
    step5Title: 'સમાંતર ચતુષ્કોણની પરિમિતિ',
    step5Desc: 'સમાંતર ચતુષ્કોણની પરિમિતિ કેવી રીતે ગણવી તે શીખો',
    step5Concept: 'સમાંતર ચતુષ્કોણની પરિમિતિ તેની બધી બાજુઓનો સરવાળો છે. કારણ કે સામસામે બાજુઓ સમાન હોય છે, પરિમિતિ = 2 × (પાયો + બાજુ).',
    step5Question: 'જો પાયો = 7 એકમ અને બાજુ = 5 એકમ, તો પરિમિતિ શું થશે?',
    step5Answer: 'પરિમિતિ = 2 × (7 + 5) = 24 એકમ',
    parallelogram: 'સમાંતર ચતુષ્કોણ',
    parallelogramPerimeterFormula: 'પરિમિતિ = 2 × (પાયો + બાજુ)',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] ?? translations.en[key] ?? key;
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

