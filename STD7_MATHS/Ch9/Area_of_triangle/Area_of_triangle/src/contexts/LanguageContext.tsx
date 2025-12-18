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
    appTitle: 'Area of Triangle',
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
    step1Title: 'Understanding Triangles',
    step1Desc: 'Learn how triangles relate to parallelograms and derive the area formula',
    step1Concept: 'Two congruent triangles joined along a corresponding side form a parallelogram; the area of each triangle is half the area of that parallelogram.',
    
    step2Title: 'Deriving the Area Formula',
    step2Desc: 'Learn how to derive the formula for area of triangle',
    step2Concept: 'When two congruent triangles are joined, they form a parallelogram. The area of each triangle is half the area of the parallelogram.',
    
    // Step 2 detailed steps
    step2Step1: 'Draw and cut out a scalene triangle from paper',
    step2Step2: 'Cut out a second identical (congruent) scalene triangle',
    step2Step3: 'Superpose the two triangles to confirm they match',
    step2Step4: 'Join a pair of corresponding sides of the two triangles',
    step2Step5: 'Observe that the figure formed is a parallelogram',
    step2Step6: 'Compare the area of each triangle to the area of the parallelogram',
    step2Step7: 'Compare the base and height of the triangles with those of the parallelogram',
    
    step3Title: 'Area Formula',
    step3Desc: 'Understand the formula for calculating triangle area',
    step3Question: 'What is the area formula for a triangle?',
    step3Answer: 'Area of triangle = 1/2 × base × height',
    step3Concept: 'Since area of parallelogram = base × height, and two triangles form one parallelogram, Area of each triangle = 1/2 (Area of parallelogram) = 1/2 (base × height)',
    
    step4Title: 'Triangles with Same Base and Height',
    step4Desc: 'Learn that triangles with same base and height have equal areas',
    step4Concept: 'All triangles on the same base and with the same height have equal areas, even if they are not congruent.',
    step4KeyPoint2: 'Triangles with same base and height have equal areas',
    step4SameArea: 'All have same area (base = 6, height = 4)',
    
    step5Title: 'Obtuse-Angled Triangles',
    step5Desc: 'Learn how to find the height of obtuse-angled triangles',
    step5Concept: 'In an obtuse-angled triangle, the height may fall outside the triangle, drawn perpendicular to an extension of the base.',
    step5HeightTip: 'The height may fall outside the triangle!',
    step5HeightOutside: 'Height falls outside the triangle',
    
    // Learn Tab - Key Points
    keyPoint1: 'Triangle has three sides and three angles',
    keyPoint2: 'Can be joined with another congruent triangle to form parallelogram',
    keyPoint3: 'Base and height are perpendicular',
    keyPoint4: 'Area equals half of base times height',
    
    formulaKey1: 'Two triangles make one parallelogram',
    formulaKey2: 'Area of parallelogram = base × height',
    formulaKey3: 'Area of triangle = 1/2 (base × height)',
    formulaKey4: 'Area = 1/2 × b × h',
    
    // Practice Mode
    practiceTitle: 'Practice Questions',
    practiceSubtitle: 'Test your understanding of triangle area',
    dataTitle: 'Given Triangle',
    questionTitle: 'Question',
    hintLabel: 'Hint',
    solutionLabel: 'Solution',
    stepLabel: 'Step',
    
    // Practice Questions - Based on Exercise 9.1 Q2
    q1Question: 'Find the area of a right-angled triangle with base 4 cm and height 3 cm',
    q1Hint: 'Use the formula: Area = 1/2 × base × height',
    q1Solution: 'Area = 1/2 × base × height = 1/2 × 4 cm × 3 cm = 6 sq cm',
    q1Answer: '6',
    
    q2Question: 'Find the area of a triangle with base 3.2 cm and height 5 cm',
    q2Hint: 'Multiply 1/2 with base and height values',
    q2Solution: 'Area = 1/2 × 3.2 cm × 5 cm = 8 sq cm',
    q2Answer: '8',
    
    q3Question: 'Find the area of a right-angled triangle with base 3 cm and height 4 cm',
    q3Hint: 'Apply the area formula directly',
    q3Solution: 'Area = 1/2 × 3 cm × 4 cm = 6 sq cm',
    q3Answer: '6',
    
    q4Question: 'Find the area of an obtuse-angled triangle with base 3 cm and height 2 cm',
    q4Hint: 'The formula works for all triangles, even if height is outside',
    q4Solution: 'Area = 1/2 × 3 cm × 2 cm = 3 sq cm',
    q4Answer: '3',
    
    q5Question: 'Find BC, if the area of triangle ABC is 36 cm² and height AD is 3 cm',
    q5Hint: 'Use the area formula and solve for base',
    q5Solution: 'Area = 1/2 × base × height. 36 = 1/2 × b × 3. b = (36 × 2) / 3 = 24 cm',
    q5Answer: '24',
    
    q6Question: 'In ΔPQR, PR = 8 cm, QR = 4 cm and PL = 5 cm. Find the area of ΔPQR',
    q6Hint: 'Use QR as base and PL as height',
    q6Solution: 'Area = 1/2 × QR × PL = 1/2 × 4 cm × 5 cm = 10 sq cm',
    q6Answer: '10',
    
    // Real World Examples
    realWorldTitle: 'Real World Applications',
    realWorldSubtitle: 'See how triangle area is used in everyday life',
    
    ex1Title: 'Garden Covering',
    ex1Context: 'A gardener wants to cover a triangular garden with grass. The base is 12 meters and height is 8 meters. Calculate the area to be covered.',
    ex1Question: 'What is the area of the triangular garden?',
    ex1Answer: 'Area = 1/2 × 12 m × 8 m = 48 sq meters',
    
    ex2Title: 'Roofing Calculation',
    ex2Context: 'A triangular roof section has base 10 meters and height 6 meters. Find the area for roofing material.',
    ex2Question: 'How much roofing area is needed?',
    ex2Answer: 'Area = 1/2 × 10 m × 6 m = 30 sq meters',
    
    ex3Title: 'Flag Design',
    ex3Context: 'A triangular flag has base 5 feet and height 3 feet. Calculate the area for fabric needed.',
    ex3Question: 'What is the area of the flag?',
    ex3Answer: 'Area = 1/2 × 5 ft × 3 ft = 7.5 sq feet',
    
    ex4Title: 'Land Plot',
    ex4Context: 'A triangular land plot has base 15 meters and height 10 meters. Calculate the area.',
    ex4Question: 'What is the area of the land plot?',
    ex4Answer: 'Area = 1/2 × 15 m × 10 m = 75 sq meters',
    
    ex5Title: 'Wall Painting',
    ex5Context: 'A triangular section of wall has base 6 meters and height 4 meters. Find the area to be painted.',
    ex5Question: 'What is the wall area?',
    ex5Answer: 'Area = 1/2 × 6 m × 4 m = 12 sq meters',
    
    ex6Title: 'Sail Design',
    ex6Context: 'A triangular sail has base 8 feet and height 12 feet. Calculate the area of the sail.',
    ex6Question: 'How much fabric is needed for the sail?',
    ex6Answer: 'Area = 1/2 × 8 ft × 12 ft = 48 sq feet',
    
    // Why Triangles Matter section
    whyMatterTitle: 'Why Triangle Area Matters?',
    whyMatterPoint1: 'Practical Applications: Used in architecture, construction, and land measurement.',
    whyMatterPoint2: 'Foundation Concept: Helps understand area calculations for other shapes.',
    whyMatterPoint3: 'Real Life: Essential for calculating roof areas, land plots, and surfaces.',
    whyMatterPoint4: 'Mathematical Base: Foundation for understanding geometry and spatial reasoning.',
    
    // Pro Tip section
    proTipTitle: 'Pro Tip!',
    proTipText: 'Remember: To find the area of a triangle, you need the base and the corresponding height. The height must be perpendicular to the base! For obtuse triangles, the height may fall outside the triangle. 📐✨',
    
    // Learn section additional translations
    sampleTriangle: '📐 Sample Triangle',
    twoTriangles: 'Two Congruent Triangles',
    parallelogramFormed: 'Parallelogram Formed',
    base: 'Base',
    height: 'Height',
    area: 'Area',
    triangle: 'Triangle',
    baseAndHeight: 'Base and Height',
    areaFormula: 'Area Formula',
    areaFormulaGeneral: 'Area = 1/2 × base × height',
    areaEquals: 'Area = 1/2 × 6 × 4 = 12',
    formula: 'Formula: 1/2 × b × h',
    pause: '⏸️ Pause',
    play: '▶️ Play',
    
    // Practice section additional translations
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You\'ve finished all triangle exercises!',
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
  },
  hi: {
    // Header
    appTitle: 'त्रिभुज का क्षेत्रफल',
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
    step1Title: 'त्रिभुज को समझना',
    step1Desc: 'जानें कि त्रिभुज समांतर चतुर्भुज से कैसे संबंधित हैं और क्षेत्रफल सूत्र प्राप्त करें',
    step1Concept: 'दो सर्वांगसम त्रिभुजों को एक साथ जोड़कर समान क्षेत्रफल का समांतर चतुर्भुज बनाया जा सकता है।',
    
    step2Title: 'क्षेत्रफल सूत्र प्राप्त करना',
    step2Desc: 'त्रिभुज के क्षेत्रफल का सूत्र प्राप्त करना सीखें',
    step2Concept: 'जब दो सर्वांगसम त्रिभुजों को जोड़ा जाता है, तो वे एक समांतर चतुर्भुज बनाते हैं। प्रत्येक त्रिभुज का क्षेत्रफल समांतर चतुर्भुज के क्षेत्रफल का आधा होता है।',
    
    step2Step1: 'कागज से एक विषमबाहु त्रिभुज खींचें और काटें',
    step2Step2: 'दूसरा समान (सर्वांगसम) विषमबाहु त्रिभुज काटें',
    step2Step3: 'दोनों त्रिभुजों को अध्यारोपित करके पुष्टि करें कि वे मेल खाते हैं',
    step2Step4: 'दोनों त्रिभुजों की संगत भुजाओं की एक जोड़ी को मिलाएं',
    step2Step5: 'ध्यान दें कि बनी आकृति एक समांतर चतुर्भुज है',
    step2Step6: 'प्रत्येक त्रिभुज के क्षेत्रफल की तुलना समांतर चतुर्भुज के क्षेत्रफल से करें',
    step2Step7: 'त्रिभुजों के आधार और ऊंचाई की तुलना समांतर चतुर्भुज के आधार और ऊंचाई से करें',
    
    step3Title: 'क्षेत्रफल सूत्र',
    step3Desc: 'त्रिभुज के क्षेत्रफल की गणना के सूत्र को समझें',
    step3Question: 'त्रिभुज के क्षेत्रफल का सूत्र क्या है?',
    step3Answer: 'त्रिभुज का क्षेत्रफल = 1/2 × आधार × ऊंचाई',
    step3Concept: 'चूंकि समांतर चतुर्भुज का क्षेत्रफल = आधार × ऊंचाई, और दो त्रिभुज एक समांतर चतुर्भुज बनाते हैं, प्रत्येक त्रिभुज का क्षेत्रफल = 1/2 (समांतर चतुर्भुज का क्षेत्रफल) = 1/2 (आधार × ऊंचाई)',
    
    step4Title: 'समान आधार और ऊंचाई वाले त्रिभुज',
    step4Desc: 'जानें कि समान आधार और ऊंचाई वाले त्रिभुजों का क्षेत्रफल समान होता है',
    step4Concept: 'एक ही आधार पर और समान ऊंचाई वाले सभी त्रिभुजों का क्षेत्रफल समान होता है, भले ही वे सर्वांगसम न हों।',
    step4KeyPoint2: 'समान आधार और ऊंचाई वाले त्रिभुजों का क्षेत्रफल समान होता है',
    step4SameArea: 'सभी का क्षेत्रफल समान है (आधार = 6, ऊंचाई = 4)',
    
    step5Title: 'अधिक कोण वाले त्रिभुज',
    step5Desc: 'अधिक कोण वाले त्रिभुजों की ऊंचाई ज्ञात करना सीखें',
    step5Concept: 'एक अधिक कोण वाले त्रिभुज में, ऊंचाई त्रिभुज के बाहर हो सकती है, आधार के विस्तार पर लंबवत खींची गई।',
    step5HeightTip: 'ऊंचाई त्रिभुज के बाहर हो सकती है!',
    step5HeightOutside: 'ऊंचाई त्रिभुज के बाहर है',
    
    // Learn Tab - Key Points
    keyPoint1: 'त्रिभुज की तीन भुजाएं और तीन कोण होते हैं',
    keyPoint2: 'एक अन्य सर्वांगसम त्रिभुज के साथ जोड़कर समांतर चतुर्भुज बनाया जा सकता है',
    keyPoint3: 'आधार और ऊंचाई लंबवत होते हैं',
    keyPoint4: 'क्षेत्रफल आधार गुणा ऊंचाई का आधा होता है',
    
    formulaKey1: 'दो त्रिभुज एक समांतर चतुर्भुज बनाते हैं',
    formulaKey2: 'समांतर चतुर्भुज का क्षेत्रफल = आधार × ऊंचाई',
    formulaKey3: 'त्रिभुज का क्षेत्रफल = 1/2 (आधार × ऊंचाई)',
    formulaKey4: 'क्षेत्रफल = 1/2 × b × h',
    
    // Practice Mode
    practiceTitle: 'अभ्यास प्रश्न',
    practiceSubtitle: 'त्रिभुज के क्षेत्रफल की अपनी समझ का परीक्षण करें',
    dataTitle: 'दिया गया त्रिभुज',
    questionTitle: 'प्रश्न',
    hintLabel: 'संकेत',
    solutionLabel: 'समाधान',
    stepLabel: 'चरण',
    
    q1Question: 'आधार 4 सेमी और ऊंचाई 3 सेमी वाले समकोण त्रिभुज का क्षेत्रफल ज्ञात करें',
    q1Hint: 'सूत्र का उपयोग करें: क्षेत्रफल = 1/2 × आधार × ऊंचाई',
    q1Solution: 'क्षेत्रफल = 1/2 × आधार × ऊंचाई = 1/2 × 4 सेमी × 3 सेमी = 6 वर्ग सेमी',
    q1Answer: '6',
    
    q2Question: 'आधार 3.2 सेमी और ऊंचाई 5 सेमी वाले त्रिभुज का क्षेत्रफल ज्ञात करें',
    q2Hint: '1/2 को आधार और ऊंचाई मूल्यों से गुणा करें',
    q2Solution: 'क्षेत्रफल = 1/2 × 3.2 सेमी × 5 सेमी = 8 वर्ग सेमी',
    q2Answer: '8',
    
    q3Question: 'आधार 3 सेमी और ऊंचाई 4 सेमी वाले समकोण त्रिभुज का क्षेत्रफल ज्ञात करें',
    q3Hint: 'क्षेत्रफल सूत्र को सीधे लागू करें',
    q3Solution: 'क्षेत्रफल = 1/2 × 3 सेमी × 4 सेमी = 6 वर्ग सेमी',
    q3Answer: '6',
    
    q4Question: 'आधार 3 सेमी और ऊंचाई 2 सेमी वाले अधिक कोण त्रिभुज का क्षेत्रफल ज्ञात करें',
    q4Hint: 'सूत्र सभी त्रिभुजों के लिए काम करता है, भले ही ऊंचाई बाहर हो',
    q4Solution: 'क्षेत्रफल = 1/2 × 3 सेमी × 2 सेमी = 3 वर्ग सेमी',
    q4Answer: '3',
    
    q5Question: 'BC ज्ञात करें, यदि त्रिभुज ABC का क्षेत्रफल 36 सेमी² है और ऊंचाई AD 3 सेमी है',
    q5Hint: 'क्षेत्रफल सूत्र का उपयोग करें और आधार के लिए हल करें',
    q5Solution: 'क्षेत्रफल = 1/2 × आधार × ऊंचाई। 36 = 1/2 × b × 3. b = (36 × 2) / 3 = 24 सेमी',
    q5Answer: '24',
    
    q6Question: 'ΔPQR में, PR = 8 सेमी, QR = 4 सेमी और PL = 5 सेमी। ΔPQR का क्षेत्रफल ज्ञात करें',
    q6Hint: 'QR को आधार और PL को ऊंचाई के रूप में उपयोग करें',
    q6Solution: 'क्षेत्रफल = 1/2 × QR × PL = 1/2 × 4 सेमी × 5 सेमी = 10 वर्ग सेमी',
    q6Answer: '10',
    
    // Real World Examples
    realWorldTitle: 'वास्तविक दुनिया के अनुप्रयोग',
    realWorldSubtitle: 'देखें कि रोजमर्रा की जिंदगी में त्रिभुज के क्षेत्रफल का उपयोग कैसे किया जाता है',
    
    ex1Title: 'बगीचे को ढंकना',
    ex1Context: 'एक माली त्रिभुजाकार बगीचे को घास से ढंकना चाहता है। आधार 12 मीटर और ऊंचाई 8 मीटर है। ढंकने के लिए क्षेत्रफल की गणना करें।',
    ex1Question: 'त्रिभुजाकार बगीचे का क्षेत्रफल क्या है?',
    ex1Answer: 'क्षेत्रफल = 1/2 × 12 मी × 8 मी = 48 वर्ग मीटर',
    
    ex2Title: 'छत की गणना',
    ex2Context: 'एक त्रिभुजाकार छत खंड का आधार 10 मीटर और ऊंचाई 6 मीटर है। छत सामग्री के लिए क्षेत्रफल ज्ञात करें।',
    ex2Question: 'कितना छत क्षेत्रफल चाहिए?',
    ex2Answer: 'क्षेत्रफल = 1/2 × 10 मी × 6 मी = 30 वर्ग मीटर',
    
    ex3Title: 'झंडा डिज़ाइन',
    ex3Context: 'एक त्रिभुजाकार झंडे का आधार 5 फीट और ऊंचाई 3 फीट है। आवश्यक कपड़े के लिए क्षेत्रफल की गणना करें।',
    ex3Question: 'झंडे का क्षेत्रफल क्या है?',
    ex3Answer: 'क्षेत्रफल = 1/2 × 5 फीट × 3 फीट = 7.5 वर्ग फीट',
    
    ex4Title: 'भूमि प्लॉट',
    ex4Context: 'एक त्रिभुजाकार भूमि प्लॉट का आधार 15 मीटर और ऊंचाई 10 मीटर है। क्षेत्रफल की गणना करें।',
    ex4Question: 'भूमि प्लॉट का क्षेत्रफल क्या है?',
    ex4Answer: 'क्षेत्रफल = 1/2 × 15 मी × 10 मी = 75 वर्ग मीटर',
    
    ex5Title: 'दीवार पेंट करना',
    ex5Context: 'दीवार के एक त्रिभुजाकार खंड का आधार 6 मीटर और ऊंचाई 4 मीटर है। पेंट करने के लिए क्षेत्रफल ज्ञात करें।',
    ex5Question: 'दीवार का क्षेत्रफल क्या है?',
    ex5Answer: 'क्षेत्रफल = 1/2 × 6 मी × 4 मी = 12 वर्ग मीटर',
    
    ex6Title: 'पाल डिज़ाइन',
    ex6Context: 'एक त्रिभुजाकार पाल का आधार 8 फीट और ऊंचाई 12 फीट है। पाल के क्षेत्रफल की गणना करें।',
    ex6Question: 'पाल के लिए कितना कपड़ा चाहिए?',
    ex6Answer: 'क्षेत्रफल = 1/2 × 8 फीट × 12 फीट = 48 वर्ग फीट',
    
    // Why Triangles Matter section
    whyMatterTitle: 'त्रिभुज का क्षेत्रफल क्यों महत्वपूर्ण है?',
    whyMatterPoint1: 'व्यावहारिक अनुप्रयोग: वास्तुकला, निर्माण और भूमि मापन में उपयोग किया जाता है।',
    whyMatterPoint2: 'मूल अवधारणा: अन्य आकृतियों के क्षेत्रफल की गणना को समझने में मदद करता है।',
    whyMatterPoint3: 'वास्तविक जीवन: छत क्षेत्रफल, भूमि प्लॉट और सतहों की गणना के लिए आवश्यक है।',
    whyMatterPoint4: 'गणितीय आधार: ज्यामिति और स्थानिक तर्क को समझने का आधार।',
    
    // Pro Tip section
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipText: 'याद रखें: त्रिभुज का क्षेत्रफल ज्ञात करने के लिए, आपको आधार और संबंधित ऊंचाई की आवश्यकता है। ऊंचाई आधार के लंबवत होनी चाहिए! अधिक कोण वाले त्रिभुजों के लिए, ऊंचाई त्रिभुज के बाहर हो सकती है। 📐✨',
    
    // Learn section additional translations
    sampleTriangle: '📐 नमूना त्रिभुज',
    twoTriangles: 'दो सर्वांगसम त्रिभुज',
    parallelogramFormed: 'समांतर चतुर्भुज बना',
    base: 'आधार',
    height: 'ऊंचाई',
    area: 'क्षेत्रफल',
    triangle: 'त्रिभुज',
    baseAndHeight: 'आधार और ऊंचाई',
    areaFormula: 'क्षेत्रफल सूत्र',
    areaFormulaGeneral: 'क्षेत्रफल = 1/2 × आधार × ऊंचाई',
    areaEquals: 'क्षेत्रफल = 1/2 × 6 × 4 = 12',
    formula: 'सूत्र: 1/2 × b × h',
    pause: '⏸️ रोकें',
    play: '▶️ चलाएं',
    
    // Practice section additional translations
    practiceComplete: 'अभ्यास पूरा!',
    practiceCompleteSubtitle: 'आपने सभी त्रिभुज अभ्यास पूरे कर लिए हैं!',
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
  },
  gu: {
    // Header
    appTitle: 'ત્રિકોણનું ક્ષેત્રફળ',
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
    step1Title: 'ત્રિકોણને સમજવા',
    step1Desc: 'જાણો કે ત્રિકોણ સમાંતર ચતુષ્કોણ સાથે કેવી રીતે સંબંધિત છે અને ક્ષેત્રફળ સૂત્ર મેળવો',
    step1Concept: 'બે સરખા ત્રિકોણોને એક સાથે જોડીને સમાન ક્ષેત્રફળનો સમાંતર ચતુષ્કોણ બનાવી શકાય છે।',
    
    step2Title: 'ક્ષેત્રફળ સૂત્ર મેળવવું',
    step2Desc: 'ત્રિકોણના ક્ષેત્રફળનું સૂત્ર મેળવવાનું શીખો',
    step2Concept: 'જ્યારે બે સરખા ત્રિકોણોને જોડવામાં આવે છે, ત્યારે તેઓ સમાંતર ચતુષ્કોણ બનાવે છે। દરેક ત્રિકોણનું ક્ષેત્રફળ સમાંતર ચતુષ્કોણના ક્ષેત્રફળનો અડધો હોય છે।',
    
    step2Step1: 'કાગળમાંથી એક અસમભુજ ત્રિકોણ દોરો અને કાપો',
    step2Step2: 'બીજો સમાન (સરખો) અસમભુજ ત્રિકોણ કાપો',
    step2Step3: 'બે ત્રિકોણોને ઉપર મૂકીને પુષ્ટિ કરો કે તેઓ મેળ ખાય છે',
    step2Step4: 'બે ત્રિકોણોની સંગત બાજુઓની જોડીને જોડો',
    step2Step5: 'ધ્યાન આપો કે બનેલી આકૃતિ સમાંતર ચતુષ્કોણ છે',
    step2Step6: 'દરેક ત્રિકોણના ક્ષેત્રફળની સમાંતર ચતુષ્કોણના ક્ષેત્રફળ સાથે તુલના કરો',
    step2Step7: 'ત્રિકોણોના પાયા અને ઊંચાઈની સમાંતર ચતુષ્કોણના પાયા અને ઊંચાઈ સાથે તુલના કરો',
    
    step3Title: 'ક્ષેત્રફળ સૂત્ર',
    step3Desc: 'ત્રિકોણના ક્ષેત્રફળની ગણતરીના સૂત્રને સમજો',
    step3Question: 'ત્રિકોણના ક્ષેત્રફળનું સૂત્ર શું છે?',
    step3Answer: 'ત્રિકોણનું ક્ષેત્રફળ = 1/2 × પાયો × ઊંચાઈ',
    step3Concept: 'કારણ કે સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ = પાયો × ઊંચાઈ, અને બે ત્રિકોણો એક સમાંતર ચતુષ્કોણ બનાવે છે, દરેક ત્રિકોણનું ક્ષેત્રફળ = 1/2 (સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ) = 1/2 (પાયો × ઊંચાઈ)',
    
    step4Title: 'સમાન પાયો અને ઊંચાઈ વાળા ત્રિકોણો',
    step4Desc: 'જાણો કે સમાન પાયો અને ઊંચાઈ વાળા ત્રિકોણોનું ક્ષેત્રફળ સમાન હોય છે',
    step4Concept: 'સમાન પાયા પર અને સમાન ઊંચાઈ સાથેના બધા ત્રિકોણોનું ક્ષેત્રફળ સમાન હોય છે, ભલે ને તેઓ સરખા ન હોય।',
    step4KeyPoint2: 'સમાન પાયો અને ઊંચાઈ વાળા ત્રિકોણોનું ક્ષેત્રફળ સમાન હોય છે',
    step4SameArea: 'બધાનું ક્ષેત્રફળ સમાન છે (પાયો = 6, ઊંચાઈ = 4)',
    
    step5Title: 'અધિક કોણ વાળા ત્રિકોણો',
    step5Desc: 'અધિક કોણ વાળા ત્રિકોણોની ઊંચાઈ શોધવાનું શીખો',
    step5Concept: 'એક અધિક કોણ વાળા ત્રિકોણમાં, ઊંચાઈ ત્રિકોણની બહાર પડી શકે છે, પાયાના વિસ્તરણ પર લંબ દોરેલી।',
    step5HeightTip: 'ઊંચાઈ ત્રિકોણની બહાર પડી શકે છે!',
    step5HeightOutside: 'ઊંચાઈ ત્રિકોણની બહાર છે',
    
    // Learn Tab - Key Points
    keyPoint1: 'ત્રિકોણની ત્રણ બાજુઓ અને ત્રણ કોણ હોય છે',
    keyPoint2: 'બીજા સરખા ત્રિકોણ સાથે જોડીને સમાંતર ચતુષ્કોણ બનાવી શકાય છે',
    keyPoint3: 'પાયો અને ઊંચાઈ લંબ છે',
    keyPoint4: 'ક્ષેત્રફળ પાયો ગુણ્યા ઊંચાઈનો અડધો હોય છે',
    
    formulaKey1: 'બે ત્રિકોણો એક સમાંતર ચતુષ્કોણ બનાવે છે',
    formulaKey2: 'સમાંતર ચતુષ્કોણનું ક્ષેત્રફળ = પાયો × ઊંચાઈ',
    formulaKey3: 'ત્રિકોણનું ક્ષેત્રફળ = 1/2 (પાયો × ઊંચાઈ)',
    formulaKey4: 'ક્ષેત્રફળ = 1/2 × b × h',
    
    // Practice Mode
    practiceTitle: 'પ્રેક્ટિસ પ્રશ્નો',
    practiceSubtitle: 'ત્રિકોણના ક્ષેત્રફળની તમારી સમજણનું પરીક્ષણ કરો',
    dataTitle: 'આપેલ ત્રિકોણ',
    questionTitle: 'પ્રશ્ન',
    hintLabel: 'સંકેત',
    solutionLabel: 'ઉકેલ',
    stepLabel: 'પગલું',
    
    q1Question: 'પાયો 4 સેમી અને ઊંચાઈ 3 સેમી સાથેના સમકોણ ત્રિકોણનું ક્ષેત્રફળ શોધો',
    q1Hint: 'સૂત્રનો ઉપયોગ કરો: ક્ષેત્રફળ = 1/2 × પાયો × ઊંચાઈ',
    q1Solution: 'ક્ષેત્રફળ = 1/2 × પાયો × ઊંચાઈ = 1/2 × 4 સેમી × 3 સેમી = 6 ચો. સેમી',
    q1Answer: '6',
    
    q2Question: 'પાયો 3.2 સેમી અને ઊંચાઈ 5 સેમી સાથેના ત્રિકોણનું ક્ષેત્રફળ શોધો',
    q2Hint: '1/2 ને પાયો અને ઊંચાઈ મૂલ્યો સાથે ગુણાકાર કરો',
    q2Solution: 'ક્ષેત્રફળ = 1/2 × 3.2 સેમી × 5 સેમી = 8 ચો. સેમી',
    q2Answer: '8',
    
    q3Question: 'પાયો 3 સેમી અને ઊંચાઈ 4 સેમી સાથેના સમકોણ ત્રિકોણનું ક્ષેત્રફળ શોધો',
    q3Hint: 'ક્ષેત્રફળ સૂત્રને સીધું લાગુ કરો',
    q3Solution: 'ક્ષેત્રફળ = 1/2 × 3 સેમી × 4 સેમી = 6 ચો. સેમી',
    q3Answer: '6',
    
    q4Question: 'પાયો 3 સેમી અને ઊંચાઈ 2 સેમી સાથેના અધિક કોણ ત્રિકોણનું ક્ષેત્રફળ શોધો',
    q4Hint: 'સૂત્ર બધા ત્રિકોણો માટે કામ કરે છે, ભલે ને ઊંચાઈ બહાર હોય',
    q4Solution: 'ક્ષેત્રફળ = 1/2 × 3 સેમી × 2 સેમી = 3 ચો. સેમી',
    q4Answer: '3',
    
    q5Question: 'BC શોધો, જો ત્રિકોણ ABC નું ક્ષેત્રફળ 36 સેમી² છે અને ઊંચાઈ AD 3 સેમી છે',
    q5Hint: 'ક્ષેત્રફળ સૂત્રનો ઉપયોગ કરો અને પાયા માટે હલ કરો',
    q5Solution: 'ક્ષેત્રફળ = 1/2 × પાયો × ઊંચાઈ। 36 = 1/2 × b × 3. b = (36 × 2) / 3 = 24 સેમી',
    q5Answer: '24',
    
    q6Question: 'ΔPQR માં, PR = 8 સેમી, QR = 4 સેમી અને PL = 5 સેમી। ΔPQR નું ક્ષેત્રફળ શોધો',
    q6Hint: 'QR ને પાયો અને PL ને ઊંચાઈ તરીકે ઉપયોગ કરો',
    q6Solution: 'ક્ષેત્રફળ = 1/2 × QR × PL = 1/2 × 4 સેમી × 5 સેમી = 10 ચો. સેમી',
    q6Answer: '10',
    
    // Real World Examples
    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉપયોગો',
    realWorldSubtitle: 'રોજિંદા જીવનમાં ત્રિકોણના ક્ષેત્રફળનો ઉપયોગ કેવી રીતે થાય છે તે જુઓ',
    
    ex1Title: 'બગીચો ઢાંકવો',
    ex1Context: 'એક માળી ત્રિકોણાકાર બગીચાને ઘાસથી ઢાંકવા માંગે છે। પાયો 12 મીટર અને ઊંચાઈ 8 મીટર છે। ઢાંકવા માટે ક્ષેત્રફળની ગણતરી કરો।',
    ex1Question: 'ત્રિકોણાકાર બગીચાનું ક્ષેત્રફળ શું છે?',
    ex1Answer: 'ક્ષેત્રફળ = 1/2 × 12 મી × 8 મી = 48 ચો. મીટર',
    
    ex2Title: 'છતની ગણતરી',
    ex2Context: 'એક ત્રિકોણાકાર છત વિભાગનો પાયો 10 મીટર અને ઊંચાઈ 6 મીટર છે। છત સામગ્રી માટે ક્ષેત્રફળ શોધો।',
    ex2Question: 'કેટલું છત ક્ષેત્રફળ જોઈએ?',
    ex2Answer: 'ક્ષેત્રફળ = 1/2 × 10 મી × 6 મી = 30 ચો. મીટર',
    
    ex3Title: 'ઝંડા ડિઝાઇન',
    ex3Context: 'એક ત્રિકોણાકાર ઝંડાનો પાયો 5 ફૂટ અને ઊંચાઈ 3 ફૂટ છે। જરૂરી કપડા માટે ક્ષેત્રફળની ગણતરી કરો।',
    ex3Question: 'ઝંડાનું ક્ષેત્રફળ શું છે?',
    ex3Answer: 'ક્ષેત્રફળ = 1/2 × 5 ફૂટ × 3 ફૂટ = 7.5 ચો. ફૂટ',
    
    ex4Title: 'જમીન પ્લોટ',
    ex4Context: 'એક ત્રિકોણાકાર જમીન પ્લોટનો પાયો 15 મીટર અને ઊંચાઈ 10 મીટર છે। ક્ષેત્રફળની ગણતરી કરો।',
    ex4Question: 'જમીન પ્લોટનું ક્ષેત્રફળ શું છે?',
    ex4Answer: 'ક્ષેત્રફળ = 1/2 × 15 મી × 10 મી = 75 ચો. મીટર',
    
    ex5Title: 'દીવાલ પેઇન્ટ કરવી',
    ex5Context: 'દીવાલના એક ત્રિકોણાકાર વિભાગનો પાયો 6 મીટર અને ઊંચાઈ 4 મીટર છે। પેઇન્ટ કરવા માટે ક્ષેત્રફળ શોધો।',
    ex5Question: 'દીવાલનું ક્ષેત્રફળ શું છે?',
    ex5Answer: 'ક્ષેત્રફળ = 1/2 × 6 મી × 4 મી = 12 ચો. મીટર',
    
    ex6Title: 'પાલ ડિઝાઇન',
    ex6Context: 'એક ત્રિકોણાકાર પાલનો પાયો 8 ફૂટ અને ઊંચાઈ 12 ફૂટ છે। પાલનું ક્ષેત્રફળ ગણો।',
    ex6Question: 'પાલ માટે કેટલું કપડું જોઈએ?',
    ex6Answer: 'ક્ષેત્રફળ = 1/2 × 8 ફૂટ × 12 ફૂટ = 48 ચો. ફૂટ',
    
    // Why Triangles Matter section
    whyMatterTitle: 'ત્રિકોણનું ક્ષેત્રફળ શા માટે મહત્વપૂર્ણ છે?',
    whyMatterPoint1: 'વ્યવહારિક ઉપયોગો: આર્કિટેક્ચર, બાંધકામ અને જમીન માપનમાં ઉપયોગ થાય છે।',
    whyMatterPoint2: 'મૂળ ખ્યાલ: અન્ય આકારોના ક્ષેત્રફળની ગણતરી સમજવામાં મદદ કરે છે।',
    whyMatterPoint3: 'વાસ્તવિક જીવન: છત ક્ષેત્રફળ, જમીન પ્લોટ અને સપાટીઓની ગણતરી માટે આવશ્યક છે।',
    whyMatterPoint4: 'ગણિતીય આધાર: ભૂમિતિ અને અવકાશી તર્કને સમજવાનો આધાર।',
    
    // Pro Tip section
    proTipTitle: 'વિશેષજ્ઞ સૂચના!',
    proTipText: 'યાદ રાખો: ત્રિકોણનું ક્ષેત્રફળ શોધવા માટે, તમારે પાયો અને સંબંધિત ઊંચાઈની જરૂર છે। ઊંચાઈ પાયાને લંબ હોવી જોઈએ! અધિક કોણ વાળા ત્રિકોણો માટે, ઊંચાઈ ત્રિકોણની બહાર પડી શકે છે। 📐✨',
    
    // Learn section additional translations
    sampleTriangle: '📐 નમૂના ત્રિકોણ',
    twoTriangles: 'બે સરખા ત્રિકોણો',
    parallelogramFormed: 'સમાંતર ચતુષ્કોણ બન્યો',
    base: 'પાયો',
    height: 'ઊંચાઈ',
    area: 'ક્ષેત્રફળ',
    triangle: 'ત્રિકોણ',
    baseAndHeight: 'પાયો અને ઊંચાઈ',
    areaFormula: 'ક્ષેત્રફળ સૂત્ર',
    areaFormulaGeneral: 'ક્ષેત્રફળ = 1/2 × પાયો × ઊંચાઈ',
    areaEquals: 'ક્ષેત્રફળ = 1/2 × 6 × 4 = 12',
    formula: 'સૂત્ર: 1/2 × b × h',
    pause: '⏸️ રોકો',
    play: '▶️ ચલાવો',
    
    // Practice section additional translations
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે બધા ત્રિકોણ પ્રેક્ટિસ પૂરા કર્યા છે!',
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


