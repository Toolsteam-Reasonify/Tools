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
    appTitle: 'Line Symmetry',
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
    step1Title: 'Understanding Line Symmetry',
    step1Desc: 'Learn about line symmetry and rotational symmetry',
    step1Concept: 'Some shapes have only line symmetry, some have only rotational symmetry and some have both line symmetry and rotational symmetry.',
    
    step2Title: 'Square Symmetry',
    step2Desc: 'Explore the symmetry properties of a square',
    step2Concept: 'A square has multiple lines of symmetry passing through its center. It also has rotational symmetry.',
    
    step3Title: 'Circle Symmetry',
    step3Desc: 'Discover the perfect symmetry of a circle',
    step3Concept: 'The circle is the most perfect symmetrical figure. It has unlimited number of lines of symmetry and rotational symmetry for every angle.',
    
    step4Title: 'Alphabet Symmetry',
    step4Desc: 'Explore symmetry in capital letters',
    step4Concept: 'Some capital letters have just one line of symmetry, some have rotational symmetry of order 2, and some have both.',
    
    // Learn Tab - Key Points
    keyPoint1: 'Line symmetry is reflectional symmetry',
    keyPoint2: 'Rotational symmetry occurs when a shape rotates',
    keyPoint3: 'Some shapes have both types of symmetry',
    keyPoint4: 'Circle has unlimited lines of symmetry',
    
    squareKey1: 'Square has 4 lines of symmetry',
    squareKey2: 'Two horizontal and two vertical lines',
    squareKey3: 'Four diagonal lines through center',
    squareKey4: 'Rotational symmetry of order 4',
    
    circleKey1: 'Every diameter is a line of symmetry',
    circleKey2: 'Can rotate through any angle',
    circleKey3: 'Center is the point of rotation',
    circleKey4: 'Unlimited lines of symmetry',
    
    alphabetKey1: 'Some letters have one line of symmetry',
    alphabetKey2: 'Some have rotational symmetry',
    alphabetKey3: 'Some have both types',
    alphabetKey4: 'Order of rotation varies',
    // Step 1 labels under diagrams
    lineSymmetryLabel: 'Line Symmetry',
    centerLabel: 'Center',
    rotateAroundCenter: 'Rotate around center →',
    looksTheSame: 'Looks the same!',
    rotationStarNote: '72° rotation (5 times = 360°)',
    foldAlongLine: 'Fold along the line →',
    bothHalvesMatch: 'Both halves match!',
    
    // Practice Mode
    practiceTitle: 'Practice Questions',
    practiceSubtitle: 'Test your understanding of line symmetry',
    dataTitle: 'Given Information',
    questionTitle: 'Question',
    hintLabel: 'Hint',
    solutionLabel: 'Solution',
    stepLabel: 'Step',
    
    // Practice Questions
    q1Question: 'Name any two figures that have both line symmetry and rotational symmetry.',
    q1Hint: 'Think of regular shapes like square, rectangle, or equilateral triangle',
    q1Solution: 'Square and Equilateral Triangle both have line symmetry and rotational symmetry.',
    q1Answer: 'Square, Equilateral Triangle',
    
    q2Question: 'Name the quadrilaterals which have both line and rotational symmetry of order more than 1.',
    q2Hint: 'Consider regular quadrilaterals with equal sides and angles',
    q2Solution: 'Square and Rhombus have both line symmetry and rotational symmetry of order more than 1.',
    q2Answer: 'Square, Rhombus',
    
    q3Question: 'After rotating by 60° about a centre, a figure looks exactly the same as its original position. At what other angles will this happen for the figure?',
    q3Hint: 'The figure has rotational symmetry of order 6. Find all angles that are multiples of 60° within 360°',
    q3Solution: 'The figure has order 6, so it will look the same at 60°, 120°, 180°, 240°, 300°, and 360°.',
    q3Answer: '120°, 180°, 240°, 300°',
    
    q4Question: 'Can we have a rotational symmetry of order more than 1 whose angle of rotation is 45°?',
    q4Hint: 'Check if 45° divides 360° evenly',
    q4Solution: 'Yes, because 360° ÷ 45° = 8, so the order of rotation would be 8.',
    q4Answer: 'Yes, order 8',
    
    q5Question: 'Can we have a rotational symmetry of order more than 1 whose angle of rotation is 17°?',
    q5Hint: 'Check if 17° divides 360° evenly',
    q5Solution: 'No, because 360° ÷ 17° = 21.176..., which is not a whole number. The angle must divide 360° exactly.',
    q5Answer: 'No',
    
    q6Question: 'If a figure has two or more lines of symmetry, should it have rotational symmetry of order more than 1?',
    q6Hint: 'Think about shapes with multiple lines of symmetry passing through a center',
    q6Solution: 'Yes, if lines of symmetry pass through a common center point, the figure will have rotational symmetry.',
    q6Answer: 'Yes',
    
    // Shape rotation questions
    q7Question: 'For a Square, what is the centre of rotation, order of rotation, and angle of rotation?',
    q7Hint: 'A square has rotational symmetry. Find the center point and calculate the rotation.',
    q7Solution: 'Centre: Intersection of diagonals, Order: 4, Angle: 90° (360° ÷ 4 = 90°)',
    q7Answer: 'Centre: Diagonals intersection, Order: 4, Angle: 90°',
    
    q8Question: 'For a Rectangle, what is the centre of rotation, order of rotation, and angle of rotation?',
    q8Hint: 'A rectangle has rotational symmetry. Note the difference from a square.',
    q8Solution: 'Centre: Intersection of diagonals, Order: 2, Angle: 180° (360° ÷ 2 = 180°)',
    q8Answer: 'Centre: Diagonals intersection, Order: 2, Angle: 180°',
    
    q9Question: 'For a Rhombus, what is the centre of rotation, order of rotation, and angle of rotation?',
    q9Hint: 'A rhombus has rotational symmetry. Think about its properties.',
    q9Solution: 'Centre: Intersection of diagonals, Order: 2, Angle: 180° (360° ÷ 2 = 180°)',
    q9Answer: 'Centre: Diagonals intersection, Order: 2, Angle: 180°',
    
    q10Question: 'For an Equilateral Triangle, what is the centre of rotation, order of rotation, and angle of rotation?',
    q10Hint: 'An equilateral triangle has rotational symmetry. Find the center (centroid).',
    q10Solution: 'Centre: Centroid (intersection of medians), Order: 3, Angle: 120° (360° ÷ 3 = 120°)',
    q10Answer: 'Centre: Centroid, Order: 3, Angle: 120°',
    
    q11Question: 'For a Regular Hexagon, what is the centre of rotation, order of rotation, and angle of rotation?',
    q11Hint: 'A regular hexagon has rotational symmetry. Calculate the rotation angle.',
    q11Solution: 'Centre: Center of hexagon, Order: 6, Angle: 60° (360° ÷ 6 = 60°)',
    q11Answer: 'Centre: Center, Order: 6, Angle: 60°',
    
    q12Question: 'For a Circle, what is the centre of rotation, order of rotation, and angle of rotation?',
    q12Hint: 'A circle has perfect rotational symmetry. Think about any angle.',
    q12Solution: 'Centre: Center of circle, Order: Infinite, Angle: Any angle',
    q12Answer: 'Centre: Center, Order: Infinite, Angle: Any angle',
    
    q13Question: 'For a Semi-circle, what is the centre of rotation, order of rotation, and angle of rotation?',
    q13Hint: 'A semi-circle has limited rotational symmetry. Check if it matches after rotation.',
    q13Solution: 'Centre: None (or center of full circle), Order: 1 (no rotational symmetry), Angle: None',
    q13Answer: 'No rotational symmetry',
    
    // Real World Examples
    realWorldTitle: 'Real World Applications',
    realWorldSubtitle: 'See how line symmetry appears in everyday life',
    
    ex1Title: 'Architectural Design',
    ex1Context: 'Buildings and structures often use line symmetry for aesthetic appeal and structural balance.',
    ex1Question: 'Why do architects use symmetry?',
    ex1Answer: 'Symmetry creates visual balance and harmony, making structures more pleasing and stable.',
    
    ex2Title: 'Nature Patterns',
    ex2Context: 'Many flowers, leaves, and natural formations exhibit line symmetry and rotational symmetry.',
    ex2Question: 'What is an example of symmetry in nature?',
    ex2Answer: 'Flowers like daisies and sunflowers have rotational symmetry, while butterfly wings show line symmetry.',
    
    ex3Title: 'Art and Design',
    ex3Context: 'Artists use symmetry to create balanced compositions and visually appealing designs.',
    ex3Question: 'How is symmetry used in art?',
    ex3Answer: 'Symmetry helps create visual balance and draws attention to important elements in the artwork.',
    
    ex4Title: 'Logos and Branding',
    ex4Context: 'Company logos often use symmetrical designs to appear balanced and professional.',
    ex4Question: 'Why are logos symmetrical?',
    ex4Answer: 'Symmetrical logos are easier to recognize, remember, and convey a sense of stability and professionalism.',
    
    ex5Title: 'Vehicle Wheels',
    ex5Context: 'Car wheels and hubcaps display rotational symmetry for functionality and design.',
    ex5Question: 'What type of symmetry do wheels have?',
    ex5Answer: 'Wheels have rotational symmetry, allowing them to rotate smoothly and maintain balance.',
    
    ex6Title: 'Crystal Structures',
    ex6Context: 'Crystals in nature form with perfect geometric symmetry at the atomic level.',
    ex6Question: 'What makes crystals symmetrical?',
    ex6Answer: 'Atoms arrange themselves in repeating patterns, creating natural geometric symmetry in crystal structures.',
    
    // Why Line Symmetry Matters section
    whyMatterTitle: 'Why Line Symmetry Matters?',
    whyMatterPoint1: 'Visual Balance: Symmetry creates harmony and balance in design and nature.',
    whyMatterPoint2: 'Mathematical Understanding: Studying symmetry helps understand geometric properties and transformations.',
    whyMatterPoint3: 'Practical Applications: Symmetry is used in architecture, art, engineering, and design.',
    whyMatterPoint4: 'Universal Principle: Symmetry appears throughout nature, from flowers to snowflakes to galaxies.',
    
    // Pro Tip section
    proTipTitle: 'Pro Tip!',
    proTipText: 'To find lines of symmetry, imagine folding the shape along a line. If both halves match perfectly, it\'s a line of symmetry! For rotational symmetry, rotate the shape and see if it looks the same. 🔄✨',
    
    // Additional translations
    squareDiagram: 'Square with Lines of Symmetry',
    circleDiagram: 'Perfect Circle Symmetry',
    alphabetTable: 'Alphabet Symmetry Table',
    squareSymmetryLines: '8 lines of symmetry through center',
    circleSymmetryLines: 'Unlimited lines of symmetry (every diameter)',
    rotationalSymmetryLabel: 'Rotational Symmetry',
    alphabetDesc1Line: '1 line',
    alphabetDesc2Lines: '2 lines',
    alphabetDescInfiniteLines: '∞ lines',
    alphabetDescRotational: 'Rotational',
    alphabetDesc2LinesRot: '2 lines + Rot',
    multipleLinesThroughCenter: 'Multiple lines through center',
    shape: 'Shape',
    centerOfRotation: 'Centre of Rotation',
    orderOfRotation: 'Order of Rotation',
    angleOfRotation: 'Angle of Rotation',
    linesOfSymmetry: 'Lines of Symmetry',
    hasLineSymmetry: 'Has Line Symmetry',
    hasRotationalSymmetry: 'Has Rotational Symmetry',
    
    // Assessment section
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You\'ve finished all line symmetry exercises!',
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
    
    // Progress labels
    questionProgress: 'Question',
    of: 'of',
    
    // Button labels
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
    
    // Shapes
    square: 'Square',
    rectangle: 'Rectangle',
    rhombus: 'Rhombus',
    equilateralTriangle: 'Equilateral Triangle',
    regularHexagon: 'Regular Hexagon',
    circle: 'Circle',
    semicircle: 'Semi-circle',
    
    pause: '⏸️ Pause',
    play: '▶️ Play',
  },
  hi: {
    // Header
    appTitle: 'रेखा समरूपता',
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
    step1Title: 'रेखा समरूपता को समझना',
    step1Desc: 'रेखा समरूपता और घूर्णी समरूपता के बारे में जानें',
    step1Concept: 'कुछ आकृतियों में केवल रेखा समरूपता होती है, कुछ में केवल घूर्णी समरूपता होती है और कुछ में दोनों प्रकार की समरूपता होती है।',
    
    step2Title: 'वर्ग की समरूपता',
    step2Desc: 'वर्ग के समरूपता गुणों का अन्वेषण करें',
    step2Concept: 'एक वर्ग में कई रेखाएं होती हैं जो इसके केंद्र से गुजरती हैं। इसमें घूर्णी समरूपता भी होती है।',
    
    step3Title: 'वृत्त की समरूपता',
    step3Desc: 'वृत्त की परिपूर्ण समरूपता की खोज करें',
    step3Concept: 'वृत्त सबसे परिपूर्ण सममित आकृति है। इसमें असीमित संख्या में सममिति रेखाएं होती हैं और प्रत्येक कोण के लिए घूर्णी समरूपता होती है।',
    
    step4Title: 'वर्णमाला की समरूपता',
    step4Desc: 'बड़े अक्षरों में समरूपता का अन्वेषण करें',
    step4Concept: 'कुछ बड़े अक्षरों में केवल एक रेखा समरूपता होती है, कुछ में क्रम 2 की घूर्णी समरूपता होती है, और कुछ में दोनों होते हैं।',
    
    // Learn Tab - Key Points
    keyPoint1: 'रेखा समरूपता प्रतिबिंबीय समरूपता है',
    keyPoint2: 'घूर्णी समरूपता तब होती है जब एक आकृति घूमती है',
    keyPoint3: 'कुछ आकृतियों में दोनों प्रकार की समरूपता होती है',
    keyPoint4: 'वृत्त में असीमित सममिति रेखाएं होती हैं',
    
    squareKey1: 'वर्ग में 4 सममिति रेखाएं होती हैं',
    squareKey2: 'दो क्षैतिज और दो ऊर्ध्वाधर रेखाएं',
    squareKey3: 'केंद्र से गुजरने वाली चार विकर्ण रेखाएं',
    squareKey4: 'क्रम 4 की घूर्णी समरूपता',
    
    circleKey1: 'प्रत्येक व्यास एक सममिति रेखा है',
    circleKey2: 'किसी भी कोण के माध्यम से घूम सकता है',
    circleKey3: 'केंद्र घूर्णन का बिंदु है',
    circleKey4: 'असीमित सममिति रेखाएं',
    
    alphabetKey1: 'कुछ अक्षरों में एक सममिति रेखा होती है',
    alphabetKey2: 'कुछ में घूर्णी समरूपता होती है',
    alphabetKey3: 'कुछ में दोनों प्रकार होते हैं',
    alphabetKey4: 'घूर्णन का क्रम भिन्न होता है',
    // Step 1 labels under diagrams
    lineSymmetryLabel: 'रेखा समरूपता',
    centerLabel: 'केंद्र',
    rotateAroundCenter: 'केंद्र के चारों ओर घुमाएँ →',
    looksTheSame: 'वैसा ही दिखाई देता है!',
    rotationStarNote: '72° घूर्णन (5 बार = 360°)',
    foldAlongLine: 'रेखा के साथ मोड़ें →',
    bothHalvesMatch: 'दोनों आधे मेल खाते हैं!',
    
    // Practice Mode
    practiceTitle: 'अभ्यास प्रश्न',
    practiceSubtitle: 'रेखा समरूपता की अपनी समझ का परीक्षण करें',
    dataTitle: 'दी गई जानकारी',
    questionTitle: 'प्रश्न',
    hintLabel: 'संकेत',
    solutionLabel: 'समाधान',
    stepLabel: 'चरण',
    
    // Practice Questions
    q1Question: 'उन दो आकृतियों के नाम बताएं जिनमें रेखा समरूपता और घूर्णी समरूपता दोनों हैं।',
    q1Hint: 'वर्ग, आयत, या समबाहु त्रिभुज जैसे नियमित आकृतियों के बारे में सोचें',
    q1Solution: 'वर्ग और समबाहु त्रिभुज दोनों में रेखा समरूपता और घूर्णी समरूपता होती है।',
    q1Answer: 'वर्ग, समबाहु त्रिभुज',
    
    q2Question: 'उन चतुर्भुजों के नाम बताएं जिनमें रेखा और क्रम 1 से अधिक की घूर्णी समरूपता दोनों हैं।',
    q2Hint: 'बराबर भुजाओं और कोणों वाले नियमित चतुर्भुजों पर विचार करें',
    q2Solution: 'वर्ग और समचतुर्भुज दोनों में रेखा समरूपता और क्रम 1 से अधिक की घूर्णी समरूपता होती है।',
    q2Answer: 'वर्ग, समचतुर्भुज',
    
    q3Question: 'एक केंद्र के चारों ओर 60° घूमने के बाद, एक आकृति अपनी मूल स्थिति के समान ही दिखती है। इस आकृति के लिए यह किन अन्य कोणों पर होगा?',
    q3Hint: 'आकृति में क्रम 6 की घूर्णी समरूपता है। 360° के भीतर 60° के सभी गुणज ज्ञात करें',
    q3Solution: 'आकृति में क्रम 6 है, इसलिए यह 60°, 120°, 180°, 240°, 300°, और 360° पर समान दिखेगी।',
    q3Answer: '120°, 180°, 240°, 300°',
    
    q4Question: 'क्या हमारे पास क्रम 1 से अधिक की घूर्णी समरूपता हो सकती है जिसका घूर्णन कोण 45° है?',
    q4Hint: 'जांचें कि क्या 45° 360° को समान रूप से विभाजित करता है',
    q4Solution: 'हां, क्योंकि 360° ÷ 45° = 8, इसलिए घूर्णन का क्रम 8 होगा।',
    q4Answer: 'हां, क्रम 8',
    
    q5Question: 'क्या हमारे पास क्रम 1 से अधिक की घूर्णी समरूपता हो सकती है जिसका घूर्णन कोण 17° है?',
    q5Hint: 'जांचें कि क्या 17° 360° को समान रूप से विभाजित करता है',
    q5Solution: 'नहीं, क्योंकि 360° ÷ 17° = 21.176..., जो एक पूर्ण संख्या नहीं है। कोण को 360° को बिल्कुल विभाजित करना चाहिए।',
    q5Answer: 'नहीं',
    
    q6Question: 'यदि किसी आकृति में दो या अधिक सममिति रेखाएं हैं, तो क्या इसमें क्रम 1 से अधिक की घूर्णी समरूपता होनी चाहिए?',
    q6Hint: 'एक सामान्य केंद्र बिंदु से गुजरने वाली कई सममिति रेखाओं वाली आकृतियों के बारे में सोचें',
    q6Solution: 'हां, यदि सममिति रेखाएं एक सामान्य केंद्र बिंदु से गुजरती हैं, तो आकृति में घूर्णी समरूपता होगी।',
    q6Answer: 'हां',
    
    // Shape rotation questions
    q7Question: 'एक वर्ग के लिए, घूर्णन का केंद्र, घूर्णन का क्रम, और घूर्णन का कोण क्या है?',
    q7Hint: 'एक वर्ग में घूर्णी समरूपता होती है। केंद्र बिंदु खोजें और घूर्णन की गणना करें।',
    q7Solution: 'केंद्र: विकर्णों का प्रतिच्छेदन, क्रम: 4, कोण: 90° (360° ÷ 4 = 90°)',
    q7Answer: 'केंद्र: विकर्णों का प्रतिच्छेदन, क्रम: 4, कोण: 90°',
    
    q8Question: 'एक आयत के लिए, घूर्णन का केंद्र, घूर्णन का क्रम, और घूर्णन का कोण क्या है?',
    q8Hint: 'एक आयत में घूर्णी समरूपता होती है। वर्ग से अंतर नोट करें।',
    q8Solution: 'केंद्र: विकर्णों का प्रतिच्छेदन, क्रम: 2, कोण: 180° (360° ÷ 2 = 180°)',
    q8Answer: 'केंद्र: विकर्णों का प्रतिच्छेदन, क्रम: 2, कोण: 180°',
    
    q9Question: 'एक समचतुर्भुज के लिए, घूर्णन का केंद्र, घूर्णन का क्रम, और घूर्णन का कोण क्या है?',
    q9Hint: 'एक समचतुर्भुज में घूर्णी समरूपता होती है। इसके गुणों के बारे में सोचें।',
    q9Solution: 'केंद्र: विकर्णों का प्रतिच्छेदन, क्रम: 2, कोण: 180° (360° ÷ 2 = 180°)',
    q9Answer: 'केंद्र: विकर्णों का प्रतिच्छेदन, क्रम: 2, कोण: 180°',
    
    q10Question: 'एक समबाहु त्रिभुज के लिए, घूर्णन का केंद्र, घूर्णन का क्रम, और घूर्णन का कोण क्या है?',
    q10Hint: 'एक समबाहु त्रिभुज में घूर्णी समरूपता होती है। केंद्र (केन्द्रक) खोजें।',
    q10Solution: 'केंद्र: केन्द्रक (माध्यिकाओं का प्रतिच्छेदन), क्रम: 3, कोण: 120° (360° ÷ 3 = 120°)',
    q10Answer: 'केंद्र: केन्द्रक, क्रम: 3, कोण: 120°',
    
    q11Question: 'एक नियमित षट्कोण के लिए, घूर्णन का केंद्र, घूर्णन का क्रम, और घूर्णन का कोण क्या है?',
    q11Hint: 'एक नियमित षट्कोण में घूर्णी समरूपता होती है। घूर्णन कोण की गणना करें।',
    q11Solution: 'केंद्र: षट्कोण का केंद्र, क्रम: 6, कोण: 60° (360° ÷ 6 = 60°)',
    q11Answer: 'केंद्र: केंद्र, क्रम: 6, कोण: 60°',
    
    q12Question: 'एक वृत्त के लिए, घूर्णन का केंद्र, घूर्णन का क्रम, और घूर्णन का कोण क्या है?',
    q12Hint: 'एक वृत्त में परिपूर्ण घूर्णी समरूपता होती है। किसी भी कोण के बारे में सोचें।',
    q12Solution: 'केंद्र: वृत्त का केंद्र, क्रम: अनंत, कोण: कोई भी कोण',
    q12Answer: 'केंद्र: केंद्र, क्रम: अनंत, कोण: कोई भी कोण',
    
    q13Question: 'एक अर्धवृत्त के लिए, घूर्णन का केंद्र, घूर्णन का क्रम, और घूर्णन का कोण क्या है?',
    q13Hint: 'एक अर्धवृत्त में सीमित घूर्णी समरूपता होती है। जांचें कि क्या यह घूर्णन के बाद मेल खाता है।',
    q13Solution: 'केंद्र: कोई नहीं (या पूर्ण वृत्त का केंद्र), क्रम: 1 (कोई घूर्णी समरूपता नहीं), कोण: कोई नहीं',
    q13Answer: 'कोई घूर्णी समरूपता नहीं',
    
    // Real World Examples
    realWorldTitle: 'वास्तविक दुनिया के अनुप्रयोग',
    realWorldSubtitle: 'देखें कि रोजमर्रा की जिंदगी में रेखा समरूपता कैसे दिखाई देती है',
    
    ex1Title: 'वास्तुकला डिजाइन',
    ex1Context: 'भवन और संरचनाएं अक्सर सौंदर्य अपील और संरचनात्मक संतुलन के लिए रेखा समरूपता का उपयोग करती हैं।',
    ex1Question: 'वास्तुकार समरूपता का उपयोग क्यों करते हैं?',
    ex1Answer: 'समरूपता दृश्य संतुलन और सामंजस्य बनाती है, संरचनाओं को अधिक सुखद और स्थिर बनाती है।',
    
    ex2Title: 'प्रकृति के पैटर्न',
    ex2Context: 'कई फूल, पत्ते और प्राकृतिक संरचनाएं रेखा समरूपता और घूर्णी समरूपता प्रदर्शित करती हैं।',
    ex2Question: 'प्रकृति में समरूपता का उदाहरण क्या है?',
    ex2Answer: 'डेज़ी और सूरजमुखी जैसे फूलों में घूर्णी समरूपता होती है, जबकि तितली के पंख रेखा समरूपता दिखाते हैं।',
    
    ex3Title: 'कला और डिजाइन',
    ex3Context: 'कलाकार संतुलित रचनाएं और दृश्य रूप से आकर्षक डिजाइन बनाने के लिए समरूपता का उपयोग करते हैं।',
    ex3Question: 'कला में समरूपता का उपयोग कैसे किया जाता है?',
    ex3Answer: 'समरूपता दृश्य संतुलन बनाने में मदद करती है और कला में महत्वपूर्ण तत्वों पर ध्यान आकर्षित करती है।',
    
    ex4Title: 'लोगो और ब्रांडिंग',
    ex4Context: 'कंपनी के लोगो अक्सर संतुलित और पेशेवर दिखने के लिए सममित डिजाइन का उपयोग करते हैं।',
    ex4Question: 'लोगो सममित क्यों होते हैं?',
    ex4Answer: 'सममित लोगो को पहचानना, याद रखना आसान होता है और स्थिरता और पेशेवरता की भावना व्यक्त करते हैं।',
    
    ex5Title: 'वाहन के पहिए',
    ex5Context: 'कार के पहिए और हबकैप कार्यक्षमता और डिजाइन के लिए घूर्णी समरूपता प्रदर्शित करते हैं।',
    ex5Question: 'पहियों में किस प्रकार की समरूपता होती है?',
    ex5Answer: 'पहियों में घूर्णी समरूपता होती है, जो उन्हें सुचारू रूप से घूमने और संतुलन बनाए रखने की अनुमति देती है।',
    
    ex6Title: 'क्रिस्टल संरचनाएं',
    ex6Context: 'प्रकृति में क्रिस्टल परमाणु स्तर पर परिपूर्ण ज्यामितीय समरूपता के साथ बनते हैं।',
    ex6Question: 'क्रिस्टल को सममित क्या बनाता है?',
    ex6Answer: 'परमाणु खुद को दोहराए जाने वाले पैटर्न में व्यवस्थित करते हैं, क्रिस्टल संरचनाओं में प्राकृतिक ज्यामितीय समरूपता बनाते हैं।',
    
    // Why Line Symmetry Matters section
    whyMatterTitle: 'रेखा समरूपता क्यों महत्वपूर्ण है?',
    whyMatterPoint1: 'दृश्य संतुलन: समरूपता डिजाइन और प्रकृति में सामंजस्य और संतुलन बनाती है।',
    whyMatterPoint2: 'गणितीय समझ: समरूपता का अध्ययन ज्यामितीय गुणों और परिवर्तनों को समझने में मदद करता है।',
    whyMatterPoint3: 'व्यावहारिक अनुप्रयोग: समरूपता का उपयोग वास्तुकला, कला, इंजीनियरिंग और डिजाइन में किया जाता है।',
    whyMatterPoint4: 'सार्वभौमिक सिद्धांत: समरूपता प्रकृति में फूलों से लेकर हिमपात तक आकाशगंगाओं तक दिखाई देती है।',
    
    // Pro Tip section
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipText: 'सममिति रेखाएं खोजने के लिए, एक रेखा के साथ आकृति को मोड़ने की कल्पना करें। यदि दोनों भाग पूरी तरह से मेल खाते हैं, तो यह एक सममिति रेखा है! घूर्णी समरूपता के लिए, आकृति को घुमाएं और देखें कि क्या यह समान दिखती है। 🔄✨',
    
    // Additional translations
    squareDiagram: 'सममिति रेखाओं के साथ वर्ग',
    circleDiagram: 'परिपूर्ण वृत्त समरूपता',
    alphabetTable: 'वर्णमाला समरूपता तालिका',
    squareSymmetryLines: 'केंद्र के माध्यम से 8 सममिति रेखाएं',
    circleSymmetryLines: 'असीमित सममिति रेखाएं (प्रत्येक व्यास)',
    rotationalSymmetryLabel: 'घूर्णी समरूपता',
    alphabetDesc1Line: '1 रेखा',
    alphabetDesc2Lines: '2 रेखाएं',
    alphabetDescInfiniteLines: '∞ रेखाएं',
    alphabetDescRotational: 'घूर्णी',
    alphabetDesc2LinesRot: '2 रेखाएं + घूर्णी',
    multipleLinesThroughCenter: 'केंद्र से होकर कई रेखाएं',
    shape: 'आकृति',
    centerOfRotation: 'घूर्णन का केंद्र',
    orderOfRotation: 'घूर्णन का क्रम',
    angleOfRotation: 'घूर्णन का कोण',
    linesOfSymmetry: 'सममिति रेखाएं',
    hasLineSymmetry: 'रेखा समरूपता है',
    hasRotationalSymmetry: 'घूर्णी समरूपता है',
    
    // Assessment section
    practiceComplete: 'अभ्यास पूरा!',
    practiceCompleteSubtitle: 'आपने सभी रेखा समरूपता अभ्यास पूरे कर लिए हैं!',
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
    
    // Progress labels
    questionProgress: 'प्रश्न',
    of: 'का',
    
    // Button labels
    clickToExpand: 'विस्तार करने के लिए क्लिक करें',
    clickToCollapse: 'संकुचित करने के लिए क्लिक करें',
    
    // Shapes
    square: 'वर्ग',
    rectangle: 'आयत',
    rhombus: 'समचतुर्भुज',
    equilateralTriangle: 'समबाहु त्रिभुज',
    regularHexagon: 'नियमित षट्कोण',
    circle: 'वृत्त',
    semicircle: 'अर्धवृत्त',
    
    pause: '⏸️ रोकें',
    play: '▶️ चलाएं',
  },
  gu: {
    // Header
    appTitle: 'રેખા સમરૂપતા',
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
    step1Title: 'રેખા સમરૂપતાને સમજવા',
    step1Desc: 'રેખા સમરૂપતા અને પરિભ્રમણ સમરૂપતા વિશે શીખો',
    step1Concept: 'કેટલીક આકૃતિઓમાં માત્ર રેખા સમરૂપતા હોય છે, કેટલીકમાં માત્ર પરિભ્રમણ સમરૂપતા હોય છે અને કેટલીકમાં બંને પ્રકારની સમરૂપતા હોય છે।',
    
    step2Title: 'ચોરસની સમરૂપતા',
    step2Desc: 'ચોરસના સમરૂપતા ગુણધર્મોનું અન્વેષણ કરો',
    step2Concept: 'એક ચોરસમાં ઘણી રેખાઓ હોય છે જે તેના કેન્દ્રમાંથી પસાર થાય છે. તેમાં પરિભ્રમણ સમરૂપતા પણ હોય છે।',
    
    step3Title: 'વર્તુળની સમરૂપતા',
    step3Desc: 'વર્તુળની સંપૂર્ણ સમરૂપતાની શોધ કરો',
    step3Concept: 'વર્તુળ સૌથી સંપૂર્ણ સમમિતિ આકૃતિ છે. તેમાં અમર્યાદિત સંખ્યામાં સમમિતિ રેખાઓ અને દરેક કોણ માટે પરિભ્રમણ સમરૂપતા હોય છે।',
    
    step4Title: 'મૂળાક્ષરોની સમરૂપતા',
    step4Desc: 'કેપિટલ અક્ષરોમાં સમરૂપતાનું અન્વેષણ કરો',
    step4Concept: 'કેટલાક કેપિટલ અક્ષરોમાં માત્ર એક રેખા સમરૂપતા હોય છે, કેટલાકમાં ક્રમ 2 ની પરિભ્રમણ સમરૂપતા હોય છે, અને કેટલાકમાં બંને હોય છે।',
    
    // Learn Tab - Key Points
    keyPoint1: 'રેખા સમરૂપતા પ્રતિબિંબી સમરૂપતા છે',
    keyPoint2: 'પરિભ્રમણ સમરૂપતા ત્યારે થાય છે જ્યારે આકૃતિ ફેરવાય છે',
    keyPoint3: 'કેટલીક આકૃતિઓમાં બંને પ્રકારની સમરૂપતા હોય છે',
    keyPoint4: 'વર્તુળમાં અમર્યાદિત સમમિતિ રેખાઓ હોય છે',
    
    squareKey1: 'ચોરસમાં 4 સમમિતિ રેખાઓ હોય છે',
    squareKey2: 'બે આડી અને બે ઊભી રેખાઓ',
    squareKey3: 'કેન્દ્રમાંથી પસાર થતી ચાર કર્ણ રેખાઓ',
    squareKey4: 'ક્રમ 4 ની પરિભ્રમણ સમરૂપતા',
    
    circleKey1: 'દરેક વ્યાસ એક સમમિતિ રેખા છે',
    circleKey2: 'કોઈપણ કોણ દ્વારા ફેરવી શકે છે',
    circleKey3: 'કેન્દ્ર પરિભ્રમણનો બિંદુ છે',
    circleKey4: 'અમર્યાદિત સમમિતિ રેખાઓ',
    
    alphabetKey1: 'કેટલાક અક્ષરોમાં એક સમમિતિ રેખા હોય છે',
    alphabetKey2: 'કેટલાકમાં પરિભ્રમણ સમરૂપતા હોય છે',
    alphabetKey3: 'કેટલાકમાં બંને પ્રકાર હોય છે',
    alphabetKey4: 'પરિભ્રમણનો ક્રમ અલગ અલગ હોય છે',
    // Step 1 labels under diagrams
    lineSymmetryLabel: 'રેખા સમરૂપતા',
    centerLabel: 'કેન્દ્ર',
    rotateAroundCenter: 'કેન્દ્રની આસપાસ ફેરવો →',
    looksTheSame: 'સમાન દેખાય છે!',
    rotationStarNote: '72° પરિભ્રમણ (5 વાર = 360°)',
    foldAlongLine: 'રેખા સાથે વાળો →',
    bothHalvesMatch: 'બંને અડધા મેળ ખાતા!',
    
    // Practice Mode
    practiceTitle: 'પ્રેક્ટિસ પ્રશ્નો',
    practiceSubtitle: 'રેખા સમરૂપતાની તમારી સમજણનું પરીક્ષણ કરો',
    dataTitle: 'આપેલ માહિતી',
    questionTitle: 'પ્રશ્ન',
    hintLabel: 'સંકેત',
    solutionLabel: 'ઉકેલ',
    stepLabel: 'પગલું',
    
    // Practice Questions
    q1Question: 'બે આકૃતિઓના નામ આપો જેમાં રેખા સમરૂપતા અને પરિભ્રમણ સમરૂપતા બંને હોય છે।',
    q1Hint: 'ચોરસ, લંબચોરસ, અથવા સમબાજુ ત્રિકોણ જેવી નિયમિત આકૃતિઓ વિશે વિચારો',
    q1Solution: 'ચોરસ અને સમબાજુ ત્રિકોણ બંનેમાં રેખા સમરૂપતા અને પરિભ્રમણ સમરૂપતા હોય છે।',
    q1Answer: 'ચોરસ, સમબાજુ ત્રિકોણ',
    
    q2Question: 'એવા ચતુર્ભુજોના નામ આપો જેમાં રેખા અને ક્રમ 1 થી વધુની પરિભ્રમણ સમરૂપતા બંને હોય છે।',
    q2Hint: 'સમાન બાજુઓ અને ખૂણાઓ સાથે નિયમિત ચતુર્ભુજોનો વિચાર કરો',
    q2Solution: 'ચોરસ અને સમચતુર્ભુજ બંનેમાં રેખા સમરૂપતા અને ક્રમ 1 થી વધુની પરિભ્રમણ સમરૂપતા હોય છે।',
    q2Answer: 'ચોરસ, સમચતુર્ભુજ',
    
    q3Question: 'એક કેન્દ્રની આસપાસ 60° ફેરવ્યા પછી, એક આકૃતિ તેની મૂળ સ્થિતિ જેવી જ દેખાય છે। આ આકૃતિ માટે આ અન્ય કયા ખૂણાઓ પર થશે?',
    q3Hint: 'આકૃતિમાં ક્રમ 6 ની પરિભ્રમણ સમરૂપતા છે। 360° ની અંદર 60° ના બધા ગુણાંક શોધો',
    q3Solution: 'આકૃતિમાં ક્રમ 6 છે, તેથી તે 60°, 120°, 180°, 240°, 300°, અને 360° પર સમાન દેખાશે।',
    q3Answer: '120°, 180°, 240°, 300°',
    
    q4Question: 'શું આપણી પાસે ક્રમ 1 થી વધુની પરિભ્રમણ સમરૂપતા હોઈ શકે છે જેનો પરિભ્રમણ કોણ 45° છે?',
    q4Hint: 'તપાસો કે 45° 360° ને સમાન રીતે વિભાજિત કરે છે કે નહીં',
    q4Solution: 'હા, કારણ કે 360° ÷ 45° = 8, તેથી પરિભ્રમણનો ક્રમ 8 હશે।',
    q4Answer: 'હા, ક્રમ 8',
    
    q5Question: 'શું આપણી પાસે ક્રમ 1 થી વધુની પરિભ્રમણ સમરૂપતા હોઈ શકે છે જેનો પરિભ્રમણ કોણ 17° છે?',
    q5Hint: 'તપાસો કે 17° 360° ને સમાન રીતે વિભાજિત કરે છે કે નહીં',
    q5Solution: 'ના, કારણ કે 360° ÷ 17° = 21.176..., જે પૂર્ણ સંખ્યા નથી. કોણે 360° ને બરાબર વિભાજિત કરવું જોઈએ।',
    q5Answer: 'ના',
    
    q6Question: 'જો કોઈ આકૃતિમાં બે અથવા વધુ સમમિતિ રેખાઓ હોય, તો શું તેમાં ક્રમ 1 થી વધુની પરિભ્રમણ સમરૂપતા હોવી જોઈએ?',
    q6Hint: 'એક સામાન્ય કેન્દ્ર બિંદુમાંથી પસાર થતી અનેક સમમિતિ રેખાઓ સાથે આકૃતિઓ વિશે વિચારો',
    q6Solution: 'હા, જો સમમિતિ રેખાઓ એક સામાન્ય કેન્દ્ર બિંદુમાંથી પસાર થાય છે, તો આકૃતિમાં પરિભ્રમણ સમરૂપતા હશે।',
    q6Answer: 'હા',
    
    // Shape rotation questions
    q7Question: 'ચોરસ માટે, પરિભ્રમણનું કેન્દ્ર, પરિભ્રમણનો ક્રમ, અને પરિભ્રમણનો કોણ શું છે?',
    q7Hint: 'ચોરસમાં પરિભ્રમણ સમરૂપતા હોય છે. કેન્દ્ર બિંદુ શોધો અને પરિભ્રમણની ગણતરી કરો.',
    q7Solution: 'કેન્દ્ર: કર્ણોનું છેદન, ક્રમ: 4, કોણ: 90° (360° ÷ 4 = 90°)',
    q7Answer: 'કેન્દ્ર: કર્ણોનું છેદન, ક્રમ: 4, કોણ: 90°',
    
    q8Question: 'લંબચોરસ માટે, પરિભ્રમણનું કેન્દ્ર, પરિભ્રમણનો ક્રમ, અને પરિભ્રમણનો કોણ શું છે?',
    q8Hint: 'લંબચોરસમાં પરિભ્રમણ સમરૂપતા હોય છે. ચોરસથી તફાવત નોંધ કરો.',
    q8Solution: 'કેન્દ્ર: કર્ણોનું છેદન, ક્રમ: 2, કોણ: 180° (360° ÷ 2 = 180°)',
    q8Answer: 'કેન્દ્ર: કર્ણોનું છેદન, ક્રમ: 2, કોણ: 180°',
    
    q9Question: 'સમચતુર્ભુજ માટે, પરિભ્રમણનું કેન્દ્ર, પરિભ્રમણનો ક્રમ, અને પરિભ્રમણનો કોણ શું છે?',
    q9Hint: 'સમચતુર્ભુજમાં પરિભ્રમણ સમરૂપતા હોય છે. તેના ગુણધર્મો વિશે વિચારો.',
    q9Solution: 'કેન્દ્ર: કર્ણોનું છેદન, ક્રમ: 2, કોણ: 180° (360° ÷ 2 = 180°)',
    q9Answer: 'કેન્દ્ર: કર્ણોનું છેદન, ક્રમ: 2, કોણ: 180°',
    
    q10Question: 'સમબાજુ ત્રિકોણ માટે, પરિભ્રમણનું કેન્દ્ર, પરિભ્રમણનો ક્રમ, અને પરિભ્રમણનો કોણ શું છે?',
    q10Hint: 'સમબાજુ ત્રિકોણમાં પરિભ્રમણ સમરૂપતા હોય છે. કેન્દ્ર (કેન્દ્રબિંદુ) શોધો.',
    q10Solution: 'કેન્દ્ર: કેન્દ્રબિંદુ (મધ્યકોનું છેદન), ક્રમ: 3, કોણ: 120° (360° ÷ 3 = 120°)',
    q10Answer: 'કેન્દ્ર: કેન્દ્રબિંદુ, ક્રમ: 3, કોણ: 120°',
    
    q11Question: 'નિયમિત ષટ્કોણ માટે, પરિભ્રમણનું કેન્દ્ર, પરિભ્રમણનો ક્રમ, અને પરિભ્રમણનો કોણ શું છે?',
    q11Hint: 'નિયમિત ષટ્કોણમાં પરિભ્રમણ સમરૂપતા હોય છે. પરિભ્રમણ કોણની ગણતરી કરો.',
    q11Solution: 'કેન્દ્ર: ષટ્કોણનું કેન્દ્ર, ક્રમ: 6, કોણ: 60° (360° ÷ 6 = 60°)',
    q11Answer: 'કેન્દ્ર: કેન્દ્ર, ક્રમ: 6, કોણ: 60°',
    
    q12Question: 'વર્તુળ માટે, પરિભ્રમણનું કેન્દ્ર, પરિભ્રમણનો ક્રમ, અને પરિભ્રમણનો કોણ શું છે?',
    q12Hint: 'વર્તુળમાં સંપૂર્ણ પરિભ્રમણ સમરૂપતા હોય છે. કોઈપણ કોણ વિશે વિચારો.',
    q12Solution: 'કેન્દ્ર: વર્તુળનું કેન્દ્ર, ક્રમ: અનંત, કોણ: કોઈપણ કોણ',
    q12Answer: 'કેન્દ્ર: કેન્દ્ર, ક્રમ: અનંત, કોણ: કોઈપણ કોણ',
    
    q13Question: 'અર્ધવર્તુળ માટે, પરિભ્રમણનું કેન્દ્ર, પરિભ્રમણનો ક્રમ, અને પરિભ્રમણનો કોણ શું છે?',
    q13Hint: 'અર્ધવર્તુળમાં સીમિત પરિભ્રમણ સમરૂપતા હોય છે. તપાસો કે પરિભ્રમણ પછી તે મેળ ખાય છે કે નહીં.',
    q13Solution: 'કેન્દ્ર: કોઈ નહીં (અથવા પૂર્ણ વર્તુળનું કેન્દ્ર), ક્રમ: 1 (કોઈ પરિભ્રમણ સમરૂપતા નહીં), કોણ: કોઈ નહીં',
    q13Answer: 'કોઈ પરિભ્રમણ સમરૂપતા નહીં',
    
    // Real World Examples
    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉપયોગો',
    realWorldSubtitle: 'જુઓ કે રોજિંદા જીવનમાં રેખા સમરૂપતા કેવી રીતે દેખાય છે',
    
    ex1Title: 'આર્કિટેક્ચરલ ડિઝાઇન',
    ex1Context: 'ઇમારતો અને માળખાં ઘણીવાર સૌંદર્ય અપીલ અને માળખાકીય સંતુલન માટે રેખા સમરૂપતાનો ઉપયોગ કરે છે।',
    ex1Question: 'શા માટે આર્કિટેક્ટ્સ સમરૂપતાનો ઉપયોગ કરે છે?',
    ex1Answer: 'સમરૂપતા દ્રશ્ય સંતુલન અને સમન્વય બનાવે છે, માળખાંને વધુ આનંદકારક અને સ્થિર બનાવે છે।',
    
    ex2Title: 'પ્રકૃતિ પેટર્ન',
    ex2Context: 'ઘણા ફૂલો, પાંદડા અને પ્રાકૃતિક રચનાઓ રેખા સમરૂપતા અને પરિભ્રમણ સમરૂપતા પ્રદર્શિત કરે છે।',
    ex2Question: 'પ્રકૃતિમાં સમરૂપતાનો ઉદાહરણ શું છે?',
    ex2Answer: 'ડેઇઝી અને સૂર્યમુખી જેવા ફૂલોમાં પરિભ્રમણ સમરૂપતા હોય છે, જ્યારે પતંગિયાના પાંખો રેખા સમરૂપતા દર્શાવે છે।',
    
    ex3Title: 'કલા અને ડિઝાઇન',
    ex3Context: 'કલાકારો સંતુલિત રચનાઓ અને દ્રશ્ય રીતે આકર્ષક ડિઝાઇન બનાવવા માટે સમરૂપતાનો ઉપયોગ કરે છે।',
    ex3Question: 'કલામાં સમરૂપતાનો ઉપયોગ કેવી રીતે થાય છે?',
    ex3Answer: 'સમરૂપતા દ્રશ્ય સંતુલન બનાવવામાં મદદ કરે છે અને કલામાં મહત્વપૂર્ણ તત્વો પર ધ્યાન દોરે છે।',
    
    ex4Title: 'લોગો અને બ્રાન્ડિંગ',
    ex4Context: 'કંપનીના લોગો ઘણીવાર સંતુલિત અને વ્યાવસાયિક દેખાવા માટે સમમિતિ ડિઝાઇનનો ઉપયોગ કરે છે।',
    ex4Question: 'લોગો સમમિતિ કેમ હોય છે?',
    ex4Answer: 'સમમિતિ લોગોને ઓળખવા, યાદ રાખવા સરળ બનાવે છે અને સ્થિરતા અને વ્યાવસાયિકતાની ભાવના વ્યક્ત કરે છે।',
    
    ex5Title: 'વાહન પૈડાં',
    ex5Context: 'કાર પૈડાં અને હબકેપ્સ કાર્યક્ષમતા અને ડિઝાઇન માટે પરિભ્રમણ સમરૂપતા પ્રદર્શિત કરે છે।',
    ex5Question: 'પૈડાંમાં કયા પ્રકારની સમરૂપતા હોય છે?',
    ex5Answer: 'પૈડાંમાં પરિભ્રમણ સમરૂપતા હોય છે, જે તેમને સરળતાથી ફેરવવા અને સંતુલન જાળવવા માટે પરવાનગી આપે છે।',
    
    ex6Title: 'ક્રિસ્ટલ માળખા',
    ex6Context: 'પ્રકૃતિમાં ક્રિસ્ટલ પરમાણુ સ્તરે સંપૂર્ણ ભૌમિતિક સમરૂપતા સાથે બનાવે છે।',
    ex6Question: 'ક્રિસ્ટલને સમમિતિ શું બનાવે છે?',
    ex6Answer: 'પરમાણુ પોતાને પુનરાવર્તિત પેટર્નમાં ગોઠવે છે, ક્રિસ્ટલ માળખામાં કુદરતી ભૌમિતિક સમરૂપતા બનાવે છે।',
    
    // Why Line Symmetry Matters section
    whyMatterTitle: 'રેખા સમરૂપતા શા માટે મહત્વપૂર્ણ છે?',
    whyMatterPoint1: 'દ્રશ્ય સંતુલન: સમરૂપતા ડિઝાઇન અને પ્રકૃતિમાં સમન્વય અને સંતુલન બનાવે છે।',
    whyMatterPoint2: 'ગાણિતિક સમજ: સમરૂપતાનો અભ્યાસ ભૌમિતિક ગુણધર્મો અને પરિવર્તનોને સમજવામાં મદદ કરે છે।',
    whyMatterPoint3: 'વ્યવહારિક ઉપયોગો: સમરૂપતાનો ઉપયોગ આર્કિટેક્ચર, કલા, ઇંજીનિયરિંગ અને ડિઝાઇનમાં થાય છે।',
    whyMatterPoint4: 'સાર્વત્રિક સિદ્ધાંત: સમરૂપતા પ્રકૃતિમાં ફૂલોથી લઈને હિમપાત સુધી ગેલેક્સી સુધી દેખાય છે।',
    
    // Pro Tip section
    proTipTitle: 'વિશેષજ્ઞ સૂચના!',
    proTipText: 'સમમિતિ રેખાઓ શોધવા માટે, એક રેખા સાથે આકૃતિને ફોલ્ડ કરવાની કલ્પના કરો. જો બંને ભાગો સંપૂર્ણપણે મેળ ખાય છે, તો તે એક સમમિતિ રેખા છે! પરિભ્રમણ સમરૂપતા માટે, આકૃતિને ફેરવો અને જુઓ કે તે સમાન દેખાય છે કે નહીં। 🔄✨',
    
    // Additional translations
    squareDiagram: 'સમમિતિ રેખાઓ સાથે ચોરસ',
    circleDiagram: 'સંપૂર્ણ વર્તુળ સમરૂપતા',
    alphabetTable: 'મૂળાક્ષરોની સમરૂપતા કોષ્ટક',
    squareSymmetryLines: 'કેન્દ્ર દ્વારા 8 સમમિતિ રેખાઓ',
    circleSymmetryLines: 'અમર્યાદિત સમમિતિ રેખાઓ (દરેક વ્યાસ)',
    rotationalSymmetryLabel: 'પરિભ્રમણ સમરૂપતા',
    alphabetDesc1Line: '1 રેખા',
    alphabetDesc2Lines: '2 રેખાઓ',
    alphabetDescInfiniteLines: '∞ રેખાઓ',
    alphabetDescRotational: 'પરિભ્રમણ',
    alphabetDesc2LinesRot: '2 રેખાઓ + પરિભ્રમણ',
    multipleLinesThroughCenter: 'કેન્દ્રમાંથી પસાર થતી બહુ રેખાઓ',
    shape: 'આકૃતિ',
    centerOfRotation: 'પરિભ્રમણનું કેન્દ્ર',
    orderOfRotation: 'પરિભ્રમણનો ક્રમ',
    angleOfRotation: 'પરિભ્રમણનો કોણ',
    linesOfSymmetry: 'સમમિતિ રેખાઓ',
    hasLineSymmetry: 'રેખા સમરૂપતા છે',
    hasRotationalSymmetry: 'પરિભ્રમણ સમરૂપતા છે',
    
    // Assessment section
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે બધી રેખા સમરૂપતા પ્રેક્ટિસ પૂરી કરી છે!',
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
    
    // Progress labels
    questionProgress: 'પ્રશ્ન',
    of: 'નો',
    
    // Button labels
    clickToExpand: 'વિસ્તૃત કરવા માટે ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા માટે ક્લિક કરો',
    
    // Shapes
    square: 'ચોરસ',
    rectangle: 'લંબચોરસ',
    rhombus: 'સમચતુર્ભુજ',
    equilateralTriangle: 'સમબાજુ ત્રિકોણ',
    regularHexagon: 'નિયમિત ષટ્કોણ',
    circle: 'વર્તુળ',
    semicircle: 'અર્ધવર્તુળ',
    
    pause: '⏸️ રોકો',
    play: '▶️ ચલાવો',
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
