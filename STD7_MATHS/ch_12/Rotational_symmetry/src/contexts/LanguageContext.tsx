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
    appTitle: 'Rotational Symmetry',
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
    play: 'Play',
    pause: 'Pause',
    
    // Learn Tab - Steps
    step1Title: 'Introduction to Rotation',
    step1Desc: 'Understanding rotation and rotational motion',
    step1Concept: 'When the hands of a clock go round, they rotate. Rotation, like movement of the hands of a clock, is called a clockwise rotation; otherwise it is said to be anticlockwise.',
    rotationP1: 'Rotation: Object turns about a fixed point.',
    rotationP2: 'Clockwise: Same direction as clock hands.',
    rotationP3: 'Anticlockwise: Opposite direction to clock hands.',
    rotationP4: 'Center of rotation: The fixed point about which rotation occurs.',
    
    step2Title: 'Center and Angle of Rotation',
    step2Desc: 'Understanding rotation center and angle',
    step2Concept: 'When an object rotates, its shape and size do not change. It turns about a fixed point (centre of rotation) by an angle called the angle of rotation.',
    centerP1: 'Center of rotation: Fixed point about which object rotates.',
    centerP2: 'A full turn means rotation by 360°.',
    centerP3: 'Half-turn: Rotation by 180°.',
    centerP4: 'Quarter-turn: Rotation by 90°.',
    
    step3Title: 'Rotational Symmetry - Windmill',
    step3Desc: 'Understanding rotational symmetry through examples',
    step3Concept: 'A paper windmill looks symmetrical but has no line of symmetry. However, if you rotate it by 90° about the fixed point, the windmill will look exactly the same. We say the windmill has rotational symmetry.',
    windmillCompact: 'Windmill has no line symmetry. Rotate 90° about the center → it looks the same (rotational symmetry).',
    windmillP1: 'Windmill has rotational symmetry of order 4.',
    windmillP2: 'In a full turn, there are four positions when it looks the same.',
    windmillP3: 'These positions occur at angles: 90°, 180°, 270°, and 360°.',
    windmillP4: 'Order 4 means it matches itself 4 times in one full rotation.',
    
    step4Title: 'Square Rotational Symmetry',
    step4Desc: 'Exploring square rotation',
    step4Concept: 'A square rotates about its centre. After four quarter-turns it matches itself again (order 4).',
    squareP1: 'Square has rotational symmetry of order 4.',
    squareP2: 'The centre of rotation is the centre of the square.',
    squareP3: 'The angle of rotation is 90°.',
    squareP4: 'After 4 quarter-turns, it returns to original position.',
    
    step5Title: 'Equilateral Triangle Rotational Symmetry',
    step5Desc: 'Understanding triangle rotation',
    step5Concept: 'An equilateral triangle has rotational symmetry of order 3. When rotated about its centre by 120°, it looks exactly the same.',
    triangleP1: 'Equilateral triangle has rotational symmetry of order 3.',
    triangleP2: 'Rotation angle: 120° (one-third of a full turn).',
    triangleP3: 'Three positions match in one full rotation.',
    triangleP4: 'Every object has order 1 (matches after 360°).',
    
    // Practice Mode
    practiceTitle: 'Practice Questions',
    practiceSubtitle: 'Test your understanding of rotational symmetry',
    dataTitle: 'Given Information',
    questionTitle: 'Question',
    hintLabel: 'Hint',
    solutionLabel: 'Solution',
    stepLabel: 'Step',
    
    // Practice Questions
    q1Question: 'What is the order of rotational symmetry for an equilateral triangle?',
    q1Hint: 'How many times does it match itself in one full rotation?',
    q1Solution: 'An equilateral triangle has rotational symmetry of order 3. It matches itself at 120°, 240°, and 360°.',
    q1Answer: '3',
    
    q2Question: 'Which shapes have rotational symmetry about the marked point? (Circle, X-shape, B-shape, Star)',
    q2Hint: 'Try rotating each shape mentally about the marked point.',
    q2Solution: 'Circle and X-shape have rotational symmetry. Circle has infinite order, X-shape has order 4.',
    q2Answer: 'Circle and X-shape',
    
    q3Question: 'How many times do the parallelograms coincide in one full round?',
    q3Hint: 'Rotate the transparent shape clockwise about point O.',
    q3Solution: 'The parallelograms coincide twice in one full round, so the order is 2.',
    q3Answer: '2',
    
    q4Question: 'Which figures have rotational symmetry of order more than 1?',
    q4Hint: 'Order 1 means matching only after 360°, which is not interesting. Look for orders 2, 3, 4, etc.',
    q4Solution: 'Circle with cross (order 4), Equilateral triangle (order 3), Circle with three lines (order 3), Pinwheel (order 4)',
    q4Answer: 'Circle with cross, Equilateral triangle, Circle with three lines, Pinwheel',
    
    q5Question: 'Give the order of rotational symmetry for each figure: Arrow, Intersecting lines, Triangle, Pinwheel, Plus sign, Pentagon, Star, Triskelion',
    q5Hint: 'Count how many times each shape matches itself in one full rotation.',
    q5Solution: 'Arrow: 1, Intersecting lines: depends on angle, Triangle: 3, Pinwheel: 6, Plus sign: 4, Pentagon: 5, Star: 6, Triskelion: 3',
    q5Answer: 'Arrow: 1, Pinwheel: 6, Plus: 4, Pentagon: 5, Star: 6, Triskelion: 3',
    
    // Real World Examples
    realWorldTitle: 'Real World Applications',
    realWorldSubtitle: 'Rotational symmetry around us',
    
    ex1Title: 'Clock Hands',
    ex1Context: 'The hands of a clock rotate about the centre of the clock-face.',
    ex1Question: 'What is the center of rotation?',
    ex1Answer: 'The centre of the clock-face is the center of rotation.',
    ex1Order: 'Continuous rotation',
    ex1Angle: '360° per hour',
    
    ex2Title: 'Windmill',
    ex2Context: 'A paper windmill has rotational symmetry of order 4.',
    ex2Question: 'At what angles does it look the same?',
    ex2Answer: 'At 90°, 180°, 270°, and 360°.',
    ex2Order: '4',
    ex2Angle: '90°',
    
    ex3Title: 'Fruit Sections',
    ex3Context: 'When you slice certain fruits, the cross-sections are shapes with rotational symmetry.',
    ex3Question: 'What is the order of symmetry for a sliced orange?',
    ex3Answer: 'Usually order 6 or 8, depending on the number of segments.',
    ex3Order: '6-8',
    ex3Angle: '60° or 45°',
    
    ex4Title: 'Road Signs',
    ex4Context: 'Many road signs exhibit rotational symmetry.',
    ex4Question: 'Identify road signs with rotational symmetry.',
    ex4Answer: 'Circular signs and signs with symmetric patterns have rotational symmetry.',
    ex4Order: 'Varies',
    ex4Angle: 'Varies',
    
    ex5Title: 'Wheels',
    ex5Context: 'Wheels have rotational symmetry. A bicycle wheel can rotate in either direction.',
    ex5Question: 'What is the order of rotational symmetry for a typical bicycle wheel?',
    ex5Answer: 'Depends on the number of spokes, typically order equal to number of spokes.',
    ex5Order: 'Varies with spokes',
    ex5Angle: '360° / number of spokes',
    
    ex6Title: 'Ceiling Fan',
    ex6Context: 'The blades of a ceiling fan rotate about a fixed point.',
    ex6Question: 'Can ceiling fan blades rotate both clockwise and anticlockwise?',
    ex6Answer: 'Yes, modern ceiling fans can rotate in both directions.',
    ex6Order: '3 or 4',
    ex6Angle: '120° or 90°',
    
    // Why Rotational Symmetry Matters
    whyMatterTitle: 'Why Rotational Symmetry Matters?',
    whyMatterPoint1: 'Design Balance: Rotational symmetry creates visually pleasing and balanced designs.',
    whyMatterPoint2: 'Mechanical Efficiency: Rotating parts work smoothly when they have rotational symmetry.',
    whyMatterPoint3: 'Natural Patterns: Many natural objects exhibit rotational symmetry.',
    whyMatterPoint4: 'Mathematical Understanding: Understanding rotation helps in geometry and trigonometry.',
    
    // Pro Tip
    proTipTitle: 'Pro Tip!',
    proTipText: 'To find rotational symmetry, imagine rotating the shape around its center. If it looks identical at certain angles, it has rotational symmetry of that order! 🔄✨',
    
    // Progress labels
    questionProgress: 'Question',
    of: 'of',
    // Diagram titles (Learn right panels)
    clockHandsRotation: 'Clock Hands Rotation',
    windmillOrder4: 'Windmill (Order 4)',
    squareOrder4: 'Square (Order 4)',
    triangleOrder3: 'Triangle (Order 3)',
    
    // Button labels
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
    
    // Assessment
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You\'ve finished all rotational symmetry exercises!',
    yourScore: 'Your Score',
    accuracy: 'Accuracy',
    performance: 'Performance',
    totalAttempts: 'Total Attempts',
    exerciseBreakdown: 'Exercise Breakdown',
    questionLabel: 'Question',
    attemptLabel: 'attempt(s)',
    practiceAgain: '🔄 Practice Again',
    placeholderAnswer: 'Type your answer here... ✍️',
    answerLabel: 'Answer',
    viewAssessment: 'View Assessment',
  },
  hi: {
    // Header
    appTitle: 'घूर्णी सममिति',
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
    play: 'चलाएँ',
    pause: 'रोकें',
    
    // Learn Tab - Steps
    step1Title: 'घूर्णन का परिचय',
    step1Desc: 'घूर्णन और घूर्णी गति को समझना',
    step1Concept: 'जब घड़ी की सुइयां चलती हैं, तो वे घूमती हैं। घूर्णन, जैसे घड़ी की सुइयों की गति, को दक्षिणावर्त घूर्णन कहा जाता है; अन्यथा इसे वामावर्त कहा जाता है।',
    rotationP1: 'घूर्णन: वस्तु एक निश्चित बिंदु के चारों ओर घूमती है।',
    rotationP2: 'दक्षिणावर्त: घड़ी की सुइयों की समान दिशा।',
    rotationP3: 'वामावर्त: घड़ी की सुइयों की विपरीत दिशा।',
    rotationP4: 'घूर्णन का केंद्र: वह निश्चित बिंदु जिसके चारों ओर घूर्णन होता है।',
    
    step2Title: 'घूर्णन का केंद्र और कोण',
    step2Desc: 'घूर्णन केंद्र और कोण को समझना',
    step2Concept: 'जब कोई वस्तु घूमती है, तो उसका आकार और आकार नहीं बदलता है। घूर्णन एक वस्तु को एक निश्चित बिंदु के चारों ओर घुमाता है। यह निश्चित बिंदु घूर्णन का केंद्र है। घूर्णन के दौरान मोड़ का कोण घूर्णन का कोण कहलाता है।',
    centerP1: 'घूर्णन का केंद्र: वह निश्चित बिंदु जिसके चारों ओर वस्तु घूमती है।',
    centerP2: 'एक पूर्ण मोड़ का अर्थ है 360° का घूर्णन।',
    centerP3: 'अर्ध-मोड़: 180° का घूर्णन।',
    centerP4: 'चौथाई मोड़: 90° का घूर्णन।',
    
    step3Title: 'घूर्णी सममिति - पवनचक्की',
    step3Desc: 'उदाहरणों के माध्यम से घूर्णी सममिति को समझना',
    step3Concept: 'एक कागज की पवनचक्की सममित दिखती है लेकिन इसमें सममिति की कोई रेखा नहीं है। हालांकि, यदि आप इसे निश्चित बिंदु के बारे में 90° घुमाते हैं, तो पवनचक्की बिल्कुल वैसी ही दिखेगी। हम कहते हैं कि पवनचक्की में घूर्णी सममिति है।',
    windmillCompact: 'पवनचक्की में रेखीय सममिति नहीं है। केंद्र के बारे में 90° घुमाने पर वही दिखाई देती है (घूर्णीय सममिति)।',
    windmillP1: 'पवनचक्की में क्रम 4 की घूर्णी सममिति है।',
    windmillP2: 'एक पूर्ण मोड़ में, चार स्थितियां होती हैं जब यह समान दिखती है।',
    windmillP3: 'ये स्थितियां कोणों पर होती हैं: 90°, 180°, 270°, और 360°।',
    windmillP4: 'क्रम 4 का अर्थ है कि यह एक पूर्ण घूर्णन में 4 बार स्वयं से मेल खाता है।',
    
    step4Title: 'वर्ग की घूर्णी सममिति',
    step4Desc: 'वर्ग के घूर्णन का अन्वेषण',
    step4Concept: 'एक वर्ग पर विचार करें जिसमें P इसके कोनों में से एक है। जब आप वर्ग के केंद्र के बारे में चौथाई मोड़ करते हैं, तो चार चौथाई मोड़ के बाद वर्ग अपनी मूल स्थिति में पहुंच जाता है। इस प्रकार एक वर्ग में इसके केंद्र के बारे में क्रम 4 की घूर्णी सममिति है।',
    squareP1: 'वर्ग में क्रम 4 की घूर्णी सममिति है।',
    squareP2: 'घूर्णन का केंद्र वर्ग का केंद्र है।',
    squareP3: 'घूर्णन का कोण 90° है।',
    squareP4: '4 चौथाई मोड़ के बाद, यह मूल स्थिति में लौट आता है।',
    
    step5Title: 'समभुज त्रिभुज की घूर्णी सममिति',
    step5Desc: 'त्रिभुज के घूर्णन को समझना',
    step5Concept: 'एक समभुज त्रिभुज में क्रम 3 की घूर्णी सममिति है। जब इसे इसके केंद्र के बारे में 120° घुमाया जाता है, तो यह बिल्कुल समान दिखता है।',
    triangleP1: 'समभुज त्रिभुज में क्रम 3 की घूर्णी सममिति है।',
    triangleP2: 'घूर्णन कोण: 120° (एक पूर्ण मोड़ का एक-तिहाई)।',
    triangleP3: 'एक पूर्ण घूर्णन में तीन स्थितियां मेल खाती हैं।',
    triangleP4: 'हर वस्तु का क्रम 1 होता है (360° के बाद मेल खाता है)।',
    
    // Practice Mode
    practiceTitle: 'अभ्यास प्रश्न',
    practiceSubtitle: 'घूर्णी सममिति की अपनी समझ का परीक्षण करें',
    dataTitle: 'दी गई जानकारी',
    questionTitle: 'प्रश्न',
    hintLabel: 'संकेत',
    solutionLabel: 'समाधान',
    stepLabel: 'चरण',
    
    // Practice Questions
    q1Question: 'समभुज त्रिभुज के लिए घूर्णी सममिति का क्रम क्या है?',
    q1Hint: 'एक पूर्ण घूर्णन में यह कितनी बार स्वयं से मेल खाता है?',
    q1Solution: 'एक समभुज त्रिभुज में क्रम 3 की घूर्णी सममिति है। यह 120°, 240°, और 360° पर स्वयं से मेल खाता है।',
    q1Answer: '3',
    
    q2Question: 'कौन से आकार चिह्नित बिंदु के बारे में घूर्णी सममिति रखते हैं? (वृत्त, X-आकार, B-आकार, तारा)',
    q2Hint: 'प्रत्येक आकार को चिह्नित बिंदु के बारे में मानसिक रूप से घुमाने का प्रयास करें।',
    q2Solution: 'वृत्त और X-आकार में घूर्णी सममिति है। वृत्त का अनंत क्रम है, X-आकार का क्रम 4 है।',
    q2Answer: 'वृत्त और X-आकार',
    
    q3Question: 'एक पूर्ण चक्कर में समांतर चतुर्भुज कितनी बार मेल खाते हैं?',
    q3Hint: 'बिंदु O के बारे में पारदर्शी आकार को दक्षिणावर्त घुमाएं।',
    q3Solution: 'समांतर चतुर्भुज एक पूर्ण चक्कर में दो बार मेल खाते हैं, इसलिए क्रम 2 है।',
    q3Answer: '2',
    
    q4Question: 'कौन से आंकड़े 1 से अधिक क्रम की घूर्णी सममिति रखते हैं?',
    q4Hint: 'क्रम 1 का अर्थ है केवल 360° के बाद मेल, जो दिलचस्प नहीं है। क्रम 2, 3, 4, आदि देखें।',
    q4Solution: 'क्रॉस वाला वृत्त (क्रम 4), समभुज त्रिभुज (क्रम 3), तीन रेखाओं वाला वृत्त (क्रम 3), पिनव्हील (क्रम 4)',
    q4Answer: 'क्रॉस वाला वृत्त, समभुज त्रिभुज, तीन रेखाओं वाला वृत्त, पिनव्हील',
    
    q5Question: 'प्रत्येक आकृति के लिए घूर्णी सममिति का क्रम दें: तीर, प्रतिच्छेदी रेखाएं, त्रिभुज, पिनव्हील, प्लस चिन्ह, पंचभुज, तारा, ट्रिस्केलियन',
    q5Hint: 'गिनें कि एक पूर्ण घूर्णन में प्रत्येक आकार कितनी बार स्वयं से मेल खाता है।',
    q5Solution: 'तीर: 1, प्रतिच्छेदी रेखाएं: कोण पर निर्भर करता है, त्रिभुज: 3, पिनव्हील: 6, प्लस चिन्ह: 4, पंचभुज: 5, तारा: 6, ट्रिस्केलियन: 3',
    q5Answer: 'तीर: 1, पिनव्हील: 6, प्लस: 4, पंचभुज: 5, तारा: 6, ट्रिस्केलियन: 3',
    
    // Real World Examples
    realWorldTitle: 'वास्तविक दुनिया के अनुप्रयोग',
    realWorldSubtitle: 'हमारे आसपास की घूर्णी सममिति',
    
    ex1Title: 'घड़ी की सुइयां',
    ex1Context: 'घड़ी की सुइयां घड़ी-चेहरे के केंद्र के बारे में घूमती हैं।',
    ex1Question: 'घूर्णन का केंद्र क्या है?',
    ex1Answer: 'घड़ी-चेहरे का केंद्र घूर्णन का केंद्र है।',
    ex1Order: 'निरंतर घूर्णन',
    ex1Angle: 'प्रति घंटा 360°',
    
    ex2Title: 'पवनचक्की',
    ex2Context: 'एक कागज की पवनचक्की में क्रम 4 की घूर्णी सममिति है।',
    ex2Question: 'किन कोणों पर यह समान दिखती है?',
    ex2Answer: '90°, 180°, 270°, और 360° पर।',
    ex2Order: '4',
    ex2Angle: '90°',
    
    ex3Title: 'फल के खंड',
    ex3Context: 'जब आप कुछ फलों को काटते हैं, तो क्रॉस-सेक्शन घूर्णी सममिति वाले आकार होते हैं।',
    ex3Question: 'कटे हुए संतरे के लिए सममिति का क्रम क्या है?',
    ex3Answer: 'आमतौर पर क्रम 6 या 8, खंडों की संख्या पर निर्भर करता है।',
    ex3Order: '6-8',
    ex3Angle: '60° या 45°',
    
    ex4Title: 'सड़क के संकेत',
    ex4Context: 'कई सड़क संकेत घूर्णी सममिति प्रदर्शित करते हैं।',
    ex4Question: 'घूर्णी सममिति वाले सड़क संकेतों की पहचान करें।',
    ex4Answer: 'गोलाकार संकेत और सममित पैटर्न वाले संकेतों में घूर्णी सममिति होती है।',
    ex4Order: 'भिन्न',
    ex4Angle: 'भिन्न',
    
    ex5Title: 'पहिए',
    ex5Context: 'पहियों में घूर्णी सममिति होती है। एक साइकिल का पहिया दोनों दिशाओं में घूम सकता है।',
    ex5Question: 'एक विशिष्ट साइकिल पहिए के लिए घूर्णी सममिति का क्रम क्या है?',
    ex5Answer: 'स्पोक्स की संख्या पर निर्भर करता है, आमतौर पर स्पोक्स की संख्या के बराबर क्रम।',
    ex5Order: 'स्पोक्स के साथ भिन्न',
    ex5Angle: '360° / स्पोक्स की संख्या',
    
    ex6Title: 'सीलिंग फैन',
    ex6Context: 'सीलिंग फैन के ब्लेड एक निश्चित बिंदु के बारे में घूमते हैं।',
    ex6Question: 'क्या सीलिंग फैन ब्लेड दक्षिणावर्त और वामावर्त दोनों में घूम सकते हैं?',
    ex6Answer: 'हां, आधुनिक सीलिंग फैन दोनों दिशाओं में घूम सकते हैं।',
    ex6Order: '3 या 4',
    ex6Angle: '120° या 90°',
    
    // Why Rotational Symmetry Matters
    whyMatterTitle: 'घूर्णी सममिति क्यों महत्वपूर्ण है?',
    whyMatterPoint1: 'डिज़ाइन संतुलन: घूर्णी सममिति दृश्य रूप से आकर्षक और संतुलित डिज़ाइन बनाती है।',
    whyMatterPoint2: 'यांत्रिक दक्षता: घूमने वाले भाग तब सुचारू रूप से काम करते हैं जब उनमें घूर्णी सममिति होती है।',
    whyMatterPoint3: 'प्राकृतिक पैटर्न: कई प्राकृतिक वस्तुएं घूर्णी सममिति प्रदर्शित करती हैं।',
    whyMatterPoint4: 'गणितीय समझ: घूर्णन को समझना ज्यामिति और त्रिकोणमिति में मदद करता है।',
    
    // Pro Tip
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipText: 'घूर्णी सममिति खोजने के लिए, आकार को उसके केंद्र के चारों ओर घुमाने की कल्पना करें। यदि यह कुछ कोणों पर समान दिखता है, तो इसमें उस क्रम की घूर्णी सममिति है! 🔄✨',
    
    // Progress labels
    questionProgress: 'प्रश्न',
    of: 'का',
    // Diagram titles (Learn right panels)
    clockHandsRotation: 'घड़ी की सुइयों का घूर्णन',
    windmillOrder4: 'पवनचक्की (क्रम 4)',
    squareOrder4: 'वर्ग (क्रम 4)',
    triangleOrder3: 'त्रिभुज (क्रम 3)',
    
    // Button labels
    clickToExpand: 'विस्तार करने के लिए क्लिक करें',
    clickToCollapse: 'संकुचित करने के लिए क्लिक करें',
    
    // Assessment
    practiceComplete: 'अभ्यास पूरा!',
    practiceCompleteSubtitle: 'आपने सभी घूर्णी सममिति अभ्यास पूरे कर लिए हैं!',
    yourScore: 'आपका स्कोर',
    accuracy: 'सटीकता',
    performance: 'प्रदर्शन',
    totalAttempts: 'कुल प्रयास',
    exerciseBreakdown: 'अभ्यास विवरण',
    questionLabel: 'प्रश्न',
    attemptLabel: 'प्रयास',
    practiceAgain: '🔄 फिर से अभ्यास करें',
    placeholderAnswer: 'अपना जवाब यहाँ टाइप करें... ✍️',
    answerLabel: 'जवाब',
    viewAssessment: 'मूल्यांकन देखें',
  },
  gu: {
    // Header
    appTitle: 'ઘૂર્ણીય સમમિતિ',
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
    play: 'પ્લે',
    pause: 'થંભાવો',
    
    // Learn Tab - Steps
    step1Title: 'ઘૂર્ણનનો પરિચય',
    step1Desc: 'ઘૂર્ણન અને ઘૂર્ણીય ગતિને સમજવું',
    step1Concept: 'જ્યારે ઘડિયાળની સોયો ફરે છે, ત્યારે તેઓ ઘૂમે છે. ઘૂર્ણન, જેમ કે ઘડિયાળની સોયોની ગતિ, ઘડિયાળની દિશામાં ઘૂર્ણન કહેવાય છે; અન્યથા તેને વિરુદ્ધ દિશામાં કહેવાય છે.',
    rotationP1: 'ઘૂર્ણન: વસ્તુ એક નિશ્ચિત બિંદુના ચારોતરફ ફરે છે.',
    rotationP2: 'ઘડિયાળની દિશામાં: ઘડિયાળની સોયોની જેવી જ દિશા.',
    rotationP3: 'વિરુદ્ધ દિશામાં: ઘડિયાળની સોયોની વિરુદ્ધ દિશા.',
    rotationP4: 'ઘૂર્ણનનું કેન્દ્ર: તે નિશ્ચિત બિંદુ જેના ચારોતરફ ઘૂર્ણન થાય છે.',
    
    step2Title: 'ઘૂર્ણનનું કેન્દ્ર અને કોણ',
    step2Desc: 'ઘૂર્ણન કેન્દ્ર અને કોણને સમજવું',
    step2Concept: 'જ્યારે કોઈ વસ્તુ ફરે છે, ત્યારે તેનો આકાર અને કદ બદલાતા નથી. ઘૂર્ણન એક વસ્તુને એક નિશ્ચિત બિંદુના ચારોતરફ ફેરવે છે. આ નિશ્ચિત બિંદુ ઘૂર્ણનનું કેન્દ્ર છે. ઘૂર્ણન દરમિયાન ફેરવાના કોણને ઘૂર્ણનનો કોણ કહેવાય છે.',
    centerP1: 'ઘૂર્ણનનું કેન્દ્ર: તે નિશ્ચિત બિંદુ જેના ચારોતરફ વસ્તુ ફરે છે.',
    centerP2: 'એક પૂર્ણ ફેરવું એટલે 360° નું ઘૂર્ણન.',
    centerP3: 'અડધું ફેરવું: 180° નું ઘૂર્ણન.',
    centerP4: 'ચોથા ભાગનું ફેરવું: 90° નું ઘૂર્ણન.',
    
    step3Title: 'ઘૂર્ણીય સમમિતિ - પવનચક્કી',
    step3Desc: 'ઉદાહરણો દ્વારા ઘૂર્ણીય સમમિતિને સમજવું',
    step3Concept: 'કાગળની પવનચક્કી સમમિત દેખાય છે પરંતુ તેમાં સમમિતિની કોઈ રેખા નથી. તેમ છતાં, જો તમે તેને નિશ્ચિત બિંદુના ચારોતરફ 90° ફેરવો, તો પવનચક્કી બિલકુલ જેવી જ દેખાશે. અમે કહીએ છીએ કે પવનચક્કીમાં ઘૂર્ણીય સમમિતિ છે.',
    windmillCompact: 'પવનચક્કીમાં રેખીય સમમિતિ નથી. કેન્દ્ર વિશે 90° ફેરવતાં તે એકસરખી દેખાય છે (ઘૂર્ણીય સમમિતિ).',
    windmillP1: 'પવનચક્કીમાં ક્રમ 4 ની ઘૂર્ણીય સમમિતિ છે.',
    windmillP2: 'એક પૂર્ણ ફેરવામાં, ચાર સ્થિતિઓ હોય છે જ્યારે તે સમાન દેખાય છે.',
    windmillP3: 'આ સ્થિતિઓ કોણો પર થાય છે: 90°, 180°, 270°, અને 360°.',
    windmillP4: 'ક્રમ 4 નો અર્થ છે કે તે એક પૂર્ણ ઘૂર્ણનમાં 4 વખત પોતાની સાથે મેળ ખાય છે.',
    
    step4Title: 'ચોરસની ઘૂર્ણીય સમમિતિ',
    step4Desc: 'ચોરસના ઘૂર્ણનનું અન્વેષણ',
    step4Concept: 'એક ચોરસને ધ્યાનમાં લો જેમાં P એ તેના ખૂણાઓમાંથી એક છે. જ્યારે તમે ચોરસના કેન્દ્રના ચારોતરફ ચોથા ભાગના ફેરવા કરો છો, ત્યારે ચાર ચોથા ભાગના ફેરવા પછી ચોરસ તેની મૂળ સ્થિતિમાં પહોંચે છે. આમ એક ચોરસમાં તેના કેન્દ્રના ચારોતરફ ક્રમ 4 ની ઘૂર્ણીય સમમિતિ છે.',
    squareP1: 'ચોરસમાં ક્રમ 4 ની ઘૂર્ણીય સમમિતિ છે.',
    squareP2: 'ઘૂર્ણનનું કેન્દ્ર ચોરસનું કેન્દ્ર છે.',
    squareP3: 'ઘૂર્ણનનો કોણ 90° છે.',
    squareP4: '4 ચોથા ભાગના ફેરવા પછી, તે મૂળ સ્થિતિમાં પરત ફરે છે.',
    
    step5Title: 'સમભુજ ત્રિકોણની ઘૂર્ણીય સમમિતિ',
    step5Desc: 'ત્રિકોણના ઘૂર્ણનને સમજવું',
    step5Concept: 'એક સમભુજ ત્રિકોણમાં ક્રમ 3 ની ઘૂર્ણીય સમમિતિ છે. જ્યારે તેને તેના કેન્દ્રના ચારોતરફ 120° ફેરવવામાં આવે છે, ત્યારે તે બિલકુલ સમાન દેખાય છે.',
    triangleP1: 'સમભુજ ત્રિકોણમાં ક્રમ 3 ની ઘૂર્ણીય સમમિતિ છે.',
    triangleP2: 'ઘૂર્ણન કોણ: 120° (એક પૂર્ણ ફેરવાનો એક-ત્રીજો ભાગ).',
    triangleP3: 'એક પૂર્ણ ઘૂર્ણનમાં ત્રણ સ્થિતિઓ મેળ ખાય છે.',
    triangleP4: 'દરેક વસ્તુનો ક્રમ 1 હોય છે (360° પછી મેળ ખાય છે).',
    
    // Practice Mode
    practiceTitle: 'પ્રેક્ટિસ પ્રશ્નો',
    practiceSubtitle: 'ઘૂર્ણીય સમમિતિની તમારી સમજણનું પરીક્ષણ કરો',
    dataTitle: 'આપેલી માહિતી',
    questionTitle: 'પ્રશ્ન',
    hintLabel: 'સંકેત',
    solutionLabel: 'ઉકેલ',
    stepLabel: 'પગલું',
    
    // Practice Questions
    q1Question: 'સમભુજ ત્રિકોણ માટે ઘૂર્ણીય સમમિતિનો ક્રમ શું છે?',
    q1Hint: 'એક પૂર્ણ ઘૂર્ણનમાં તે કેટલી વખત પોતાની સાથે મેળ ખાય છે?',
    q1Solution: 'સમભુજ ત્રિકોણમાં ક્રમ 3 ની ઘૂર્ણીય સમમિતિ છે. તે 120°, 240°, અને 360° પર પોતાની સાથે મેળ ખાય છે.',
    q1Answer: '3',
    
    q2Question: 'કયા આકારો ચિહ્નિત બિંદુના ચારોતરફ ઘૂર્ણીય સમમિતિ ધરાવે છે? (વર્તુળ, X-આકાર, B-આકાર, તારો)',
    q2Hint: 'દરેક આકારને ચિહ્નિત બિંદુના ચારોતરફ માનસિક રીતે ફેરવવાનો પ્રયાસ કરો.',
    q2Solution: 'વર્તુળ અને X-આકારમાં ઘૂર્ણીય સમમિતિ છે. વર્તુળનો અનંત ક્રમ છે, X-આકારનો ક્રમ 4 છે.',
    q2Answer: 'વર્તુળ અને X-આકાર',
    
    q3Question: 'એક પૂર્ણ ગોળ દરમિયાન સમાંતર ચતુષ્કોણ કેટલી વખત એકરૂપ થાય છે?',
    q3Hint: 'બિંદુ O ના ચારોતરફ પારદર્શક આકારને ઘડિયાળની દિશામાં ફેરવો.',
    q3Solution: 'સમાંતર ચતુષ્કોણ એક પૂર્ણ ગોળ દરમિયાન બે વખત એકરૂપ થાય છે, તેથી ક્રમ 2 છે.',
    q3Answer: '2',
    
    q4Question: 'કયા આકૃતિઓમાં 1 કરતાં વધુ ક્રમની ઘૂર્ણીય સમમિતિ છે?',
    q4Hint: 'ક્રમ 1 નો અર્થ છે ફક્ત 360° પછી મેળ, જે રસપ્રદ નથી. ક્રમ 2, 3, 4, વગેરે જુઓ.',
    q4Solution: 'ક્રોસ સાથે વર્તુળ (ક્રમ 4), સમભુજ ત્રિકોણ (ક્રમ 3), ત્રણ રેખાઓ સાથે વર્તુળ (ક્રમ 3), પિનવ્હીલ (ક્રમ 4)',
    q4Answer: 'ક્રોસ સાથે વર્તુળ, સમભુજ ત્રિકોણ, ત્રણ રેખાઓ સાથે વર્તુળ, પિનવ્હીલ',
    
    q5Question: 'દરેક આકૃતિ માટે ઘૂર્ણીય સમમિતિનો ક્રમ આપો: તીર, છેદતી રેખાઓ, ત્રિકોણ, પિનવ્હીલ, પ્લસ ચિહ્ન, પંચભુજ, તારો, ટ્રિસ્કેલિયન',
    q5Hint: 'ગણો કે એક પૂર્ણ ઘૂર્ણનમાં દરેક આકાર કેટલી વખત પોતાની સાથે મેળ ખાય છે.',
    q5Solution: 'તીર: 1, છેદતી રેખાઓ: કોણ પર આધાર રાખે છે, ત્રિકોણ: 3, પિનવ્હીલ: 6, પ્લસ ચિહ્ન: 4, પંચભુજ: 5, તારો: 6, ટ્રિસ્કેલિયન: 3',
    q5Answer: 'તીર: 1, પિનવ્હીલ: 6, પ્લસ: 4, પંચભુજ: 5, તારો: 6, ટ્રિસ્કેલિયન: 3',
    
    // Real World Examples
    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉપયોગો',
    realWorldSubtitle: 'અમારી આસપાસની ઘૂર્ણીય સમમિતિ',
    
    ex1Title: 'ઘડિયાળની સોયો',
    ex1Context: 'ઘડિયાળની સોયો ઘડિયાળ-ચહેરાના કેન્દ્રના ચારોતરફ ફરે છે.',
    ex1Question: 'ઘૂર્ણનનું કેન્દ્ર શું છે?',
    ex1Answer: 'ઘડિયાળ-ચહેરાનું કેન્દ્ર ઘૂર્ણનનું કેન્દ્ર છે.',
    ex1Order: 'સતત ઘૂર્ણન',
    ex1Angle: 'પ્રતિ કલાક 360°',
    
    ex2Title: 'પવનચક્કી',
    ex2Context: 'કાગળની પવનચક્કીમાં ક્રમ 4 ની ઘૂર્ણીય સમમિતિ છે.',
    ex2Question: 'કયા કોણો પર તે સમાન દેખાય છે?',
    ex2Answer: '90°, 180°, 270°, અને 360° પર.',
    ex2Order: '4',
    ex2Angle: '90°',
    
    ex3Title: 'ફળના વિભાગો',
    ex3Context: 'જ્યારે તમે ચોક્કસ ફળોને કાપો છો, ત્યારે ક્રોસ-વિભાગો ઘૂર્ણીય સમમિતિ ધરાવતા આકારો હોય છે.',
    ex3Question: 'કાપેલા સંતરા માટે સમમિતિનો ક્રમ શું છે?',
    ex3Answer: 'સામાન્ય રીતે ક્રમ 6 અથવા 8, વિભાગોની સંખ્યા પર આધાર રાખે છે.',
    ex3Order: '6-8',
    ex3Angle: '60° અથવા 45°',
    
    ex4Title: 'રોડ સાઇન્સ',
    ex4Context: 'ઘણા રોડ સાઇન્સ ઘૂર્ણીય સમમિતિ પ્રદર્શિત કરે છે.',
    ex4Question: 'ઘૂર્ણીય સમમિતિ ધરાવતા રોડ સાઇન્સની ઓળખ કરો.',
    ex4Answer: 'ગોળાકાર સાઇન્સ અને સમમિત પેટર્ન સાથેના સાઇન્સમાં ઘૂર્ણીય સમમિતિ હોય છે.',
    ex4Order: 'વિવિધ',
    ex4Angle: 'વિવિધ',
    
    ex5Title: 'પૈડા',
    ex5Context: 'પૈડાઓમાં ઘૂર્ણીય સમમિતિ હોય છે. બાઇકનું પૈડું બંને દિશામાં ફરી શકે છે.',
    ex5Question: 'એક લાક્ષણિક બાઇક પૈડા માટે ઘૂર્ણીય સમમિતિનો ક્રમ શું છે?',
    ex5Answer: 'સ્પોક્સની સંખ્યા પર આધાર રાખે છે, સામાન્ય રીતે સ્પોક્સની સંખ્યાની બરાબર ક્રમ.',
    ex5Order: 'સ્પોક્સ સાથે વિવિધ',
    ex5Angle: '360° / સ્પોક્સની સંખ્યા',
    
    ex6Title: 'સીલિંગ ફેન',
    ex6Context: 'સીલિંગ ફેનના બ્લેડ્સ એક નિશ્ચિત બિંદુના ચારોતરફ ફરે છે.',
    ex6Question: 'શું સીલિંગ ફેન બ્લેડ્સ ઘડિયાળની દિશામાં અને વિરુદ્ધ દિશામાં બંનેમાં ફરી શકે છે?',
    ex6Answer: 'હા, આધુનિક સીલિંગ ફેન બંને દિશામાં ફરી શકે છે.',
    ex6Order: '3 અથવા 4',
    ex6Angle: '120° અથવા 90°',
    
    // Why Rotational Symmetry Matters
    whyMatterTitle: 'ઘૂર્ણીય સમમિતિ શા માટે મહત્વપૂર્ણ છે?',
    whyMatterPoint1: 'ડિઝાઇન સંતુલન: ઘૂર્ણીય સમમિતિ દ્રશ્ય રીતે આકર્ષક અને સંતુલિત ડિઝાઇન બનાવે છે.',
    whyMatterPoint2: 'યાંત્રિક કાર્યક્ષમતા: ફરતા ભાગો સરળ રીતે કામ કરે છે જ્યારે તેમનામાં ઘૂર્ણીય સમમિતિ હોય છે.',
    whyMatterPoint3: 'પ્રાકૃતિક પેટર્ન: ઘણી પ્રાકૃતિક વસ્તુઓ ઘૂર્ણીય સમમિતિ પ્રદર્શિત કરે છે.',
    whyMatterPoint4: 'ગણિતીય સમજ: ઘૂર્ણનને સમજવું ભૂમિતિ અને ત્રિકોણમિતિમાં મદદ કરે છે.',
    
    // Pro Tip
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે બધા ઘૂર્ણીય સમમિતિ પ્રેક્ટિસ પૂરા કર્યા છે!',
    yourScore: 'તમારો સ્કોર',
    accuracy: 'ચોકસાઈ',
    performance: 'પ્રદર્શન',
    totalAttempts: 'કુલ પ્રયાસો',
    exerciseBreakdown: 'પ્રેક્ટિસ વિગતો',
    questionLabel: 'પ્રશ્ન',
    attemptLabel: 'પ્રયાસો',
    practiceAgain: '🔄 ફરીથી પ્રેક્ટિસ કરો',
    placeholderAnswer: 'તમારો જવાબ અહીં લખો... ✍️',
    answerLabel: 'જવાબ',
    viewAssessment: 'મૂલ્યાંકન જુઓ',
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


