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
    appTitle: 'Bar Graph Usage',
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
    step1Title: 'Understanding Bar Graphs',
    step1Desc: 'Learn what bar graphs are and when to use them',
    step1Concept: 'Bar graphs can be used to show how something changes over time or to compare items.',
    
    step2Title: 'Choosing a Scale',
    step2Desc: 'Learn how to select an appropriate scale for your bar graph',
    step2Concept: 'The scale determines how much each unit on the axis represents.',
    
    step3Title: 'Reading Bar Graphs',
    step3Desc: 'Practice reading and interpreting bar graphs',
    step3Question: 'Which color is most preferred and which is least preferred?',
    step3Answer: 'Blue is most preferred (55 students) and Green is least preferred (19 students)',
    
    step4Title: 'Double Bar Graphs',
    step4Desc: 'Learn to compare two sets of data side-by-side',
    step4Question: 'Which month has more sunshine in Margate compared to Aberdeen?',
    step4Answer: 'Except for April, Margate always has more sunshine than Aberdeen',
    
    // Learn Tab - Key Points
    keyPoint1: 'Visual representation using bars',
    keyPoint2: 'Easy comparison of categories',
    keyPoint3: 'Bars can be vertical or horizontal',
    keyPoint4: 'Height/length shows frequency',
    
    scaleKey1: 'Start scale at 0',
    scaleKey2: 'Use equal divisions',
    scaleKey3: 'Accommodate largest value',
    scaleKey4: 'Make it easy to read',
    
    // Practice Mode
    practiceTitle: 'Practice Questions',
    practiceSubtitle: 'Test your understanding of bar graphs',
    dataTitle: 'Given Data',
    questionTitle: 'Question',
    hintLabel: 'Hint',
    solutionLabel: 'Solution',
    stepLabel: 'Step',
    
    // Practice Questions
    q1Question: 'Which color is most preferred by students?',
    q1Hint: 'Look for the tallest bar in the graph',
    q1Solution: 'Blue is the most preferred color with 55 students',
    q1Answer: 'Blue',
    
    q2Question: 'How many students prefer Red or Yellow?',
    q2Hint: 'Add the values for Red and Yellow bars',
    q2Solution: 'Red: 43 students, Yellow: 49 students. Total = 43 + 49 = 92 students',
    q2Answer: '92',
    
    q3Question: 'What is the total number of students surveyed?',
    q3Hint: 'Add all the bar values together',
    q3Solution: 'Red(43) + Green(19) + Blue(55) + Yellow(49) + Orange(34) = 200 students',
    q3Answer: '200',
    
    q4Question: 'Which student scored the highest marks?',
    q4Hint: 'Find the tallest bar representing the maximum marks',
    q4Solution: 'Hari scored the highest with 540 marks',
    q4Answer: 'Hari',
    
    q5Question: 'What is the difference between highest and lowest marks?',
    q5Hint: 'Subtract the lowest bar value from the highest bar value',
    q5Solution: 'Highest: Hari (540), Lowest: Dipti (300). Difference = 540 - 300 = 240 marks',
    q5Answer: '240',
    
    q6Question: 'How many students scored more than 400 marks?',
    q6Hint: 'Count bars that are taller than the 400 mark line',
    q6Solution: 'Ajay(450), Bali(500), Hari(540) - Total 3 students scored more than 400',
    q6Answer: '3',
    
    // Real World Examples
    realWorldTitle: 'Real World Applications',
    realWorldSubtitle: 'See how bar graphs are used in everyday life',
    
    ex1Title: 'Favorite Color Survey',
    ex1Context: '200 students from 6th and 7th classes were surveyed about their favorite school building color',
    ex1Question: 'Which color is most preferred?',
    ex1Answer: 'Blue is the most preferred color (55 students)',
    
    ex2Title: 'Student Performance',
    ex2Context: 'Total marks (out of 600) obtained by six children in a class test',
    ex2Question: 'Who performed best?',
    ex2Answer: 'Hari performed best with 540 marks',
    
    ex3Title: 'Sunshine Hours Comparison',
    ex3Context: 'Average daily hours of sunshine in Margate and Aberdeen for 12 months',
    ex3Question: 'Which city has more sunshine?',
    ex3Answer: 'Margate has more sunshine in all months except April',
    
    ex4Title: 'Water-Resistant Watches',
    ex4Context: 'Survey results of water-resistant watches from 4 different companies',
    ex4Question: 'Which company has best quality?',
    ex4Answer: 'Company C has the highest number of water-resistant watches',
    
    ex5Title: 'Book Sales Comparison',
    ex5Context: 'Sales of English and Hindi books from 1995 to 1998',
    ex5Question: 'Which year had highest Hindi book sales?',
    ex5Answer: '1998 had the highest Hindi book sales (650 books)',
    
    ex6Title: 'Teacher Performance Test',
    ex6Context: 'Scores of 5 students in quarterly and half-yearly tests to evaluate teaching method',
    ex6Question: 'Should teacher continue the new method?',
    ex6Answer: 'Yes, as most students showed improvement in half-yearly test',
    
    // Why Bar Graphs Matter section
    whyMatterTitle: 'Why Bar Graphs Matter?',
    whyMatterPoint1: 'Visual Clarity: Bar graphs make complex data easy to understand at a glance.',
    whyMatterPoint2: 'Comparison: Perfect for comparing different categories or groups side-by-side.',
    whyMatterPoint3: 'Decision Making: Helps in making informed decisions based on data patterns.',
    whyMatterPoint4: 'Universal Language: Used in business, education, science, and everyday life worldwide.',
    
    // Pro Tip section
    proTipTitle: 'Pro Tip!',
    proTipText: 'When creating bar graphs, always start your scale at zero and use equal divisions. This ensures accurate representation and prevents misleading visualizations! 📏✨',
    
    // Learn section additional translations
    sampleBarGraph: '📊 Sample Bar Graph',
    choosingRightScale: '🎯 Choosing the Right Scale',
    goodScale: 'Good Scale: 1 unit = 10 students',
    badScale: 'Bad Scale: Irregular divisions',
    divisions: 'Divisions',
    equalDivisions: '✓ Equal divisions, Easy to read',
    unequalDivisions: '✗ Unequal divisions, Confusing!',
    surveyData: 'Survey Data:',
    surveyDescription: '200 students from 6th and 7th classes were asked about their favorite school building color.',
    color: 'Color',
    students: 'Students',
    favoriteColorSurvey: '🎨 Favorite Color Survey',
    scaleUnit10: 'Scale: 1 unit = 10 students',
    studentsText: 'students',
    colors: 'Colors 🎨',
    sunshineData: 'Sunshine Data:',
    sunshineDescription: 'Average daily hours of sunshine in two cities (Margate and Aberdeen) for different months.',
    margate: 'Margate',
    aberdeen: 'Aberdeen',
    doubleBarGraph: '☀️ Double Bar Graph',
    scaleUnit1: 'Scale: 1 unit = 1 hour',
    hours: 'Hours',
    months: 'Months 📅',
    pause: '⏸️ Pause',
    play: '▶️ Play',
    
    // Practice section additional translations (moved earlier; keep empty to avoid duplicates)
    
    // Assessment section
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You\'ve finished all bar graph exercises!',
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
    
    // Data Labels
    red: 'Red',
    green: 'Green',
    blue: 'Blue',
    yellow: 'Yellow',
    orange: 'Orange',
    math: 'Math',
    science: 'Science',
    english: 'English',
    history: 'History',
    art: 'Art',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    ajay: 'Ajay',
    bali: 'Bali',
    dipti: 'Dipti',
    faiyaz: 'Faiyaz',
    geetika: 'Geetika',
    hari: 'Hari',
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    companyA: 'A',
    companyB: 'B',
    companyC: 'C',
    companyD: 'D',
    
    // Progress labels
    questionProgress: 'Question',
    of: 'of',
    
    // Button labels
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
  },
  hi: {
    // Header
    appTitle: 'बार ग्राफ का उपयोग',
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
    step1Title: 'बार ग्राफ को समझना',
    step1Desc: 'जानें कि बार ग्राफ क्या हैं और उनका उपयोग कब करें',
    step1Concept: 'बार ग्राफ का उपयोग समय के साथ बदलाव दिखाने या वस्तुओं की तुलना करने के लिए किया जा सकता है।',
    
    step2Title: 'पैमाना चुनना',
    step2Desc: 'अपने बार ग्राफ के लिए उपयुक्त पैमाना चुनना सीखें',
    step2Concept: 'पैमाना निर्धारित करता है कि अक्ष पर प्रत्येक इकाई कितना प्रतिनिधित्व करती है। एक पैमाना चुनें जो: (1) 0 से शुरू हो, (2) समान विभाजन हो, (3) सबसे बड़े मूल्य को समायोजित करे, (4) ग्राफ को पढ़ना आसान बनाए',
    
    step3Title: 'बार ग्राफ पढ़ना',
    step3Desc: 'बार ग्राफ पढ़ने और व्याख्या करने का अभ्यास करें',
    step3Question: 'कौन सा रंग सबसे अधिक पसंद किया जाता है और कौन सा सबसे कम?',
    step3Answer: 'नीला सबसे अधिक पसंद किया जाता है (55 छात्र) और हरा सबसे कम पसंद किया जाता है (19 छात्र)',
    
    step4Title: 'दोहरा बार ग्राफ',
    step4Desc: 'डेटा के दो सेटों की साथ-साथ तुलना करना सीखें',
    step4Question: 'मार्गेट में एबरडीन की तुलना में किस महीने में अधिक धूप है?',
    step4Answer: 'अप्रैल को छोड़कर, मार्गेट में हमेशा एबरडीन की तुलना में अधिक धूप होती है',
    
    // Learn Tab - Key Points
    keyPoint1: 'पट्टियों का उपयोग करके दृश्य प्रतिनिधित्व',
    keyPoint2: 'श्रेणियों की आसान तुलना',
    keyPoint3: 'पट्टियां ऊर्ध्वाधर या क्षैतिज हो सकती हैं',
    keyPoint4: 'ऊंचाई/लंबाई आवृत्ति दिखाती है',
    
    scaleKey1: 'पैमाना 0 से शुरू करें',
    scaleKey2: 'समान विभाजन का उपयोग करें',
    scaleKey3: 'सबसे बड़े मूल्य को समायोजित करें',
    scaleKey4: 'इसे पढ़ना आसान बनाएं',
    
    // Practice Mode
    practiceTitle: 'अभ्यास प्रश्न',
    practiceSubtitle: 'बार ग्राफ की अपनी समझ का परीक्षण करें',
    dataTitle: 'दिया गया डेटा',
    questionTitle: 'प्रश्न',
    hintLabel: 'संकेत',
    solutionLabel: 'समाधान',
    stepLabel: 'चरण',
    
    // Practice Questions
    q1Question: 'छात्रों द्वारा कौन सा रंग सबसे अधिक पसंद किया जाता है?',
    q1Hint: 'ग्राफ में सबसे लंबी पट्टी देखें',
    q1Solution: 'नीला 55 छात्रों के साथ सबसे पसंदीदा रंग है',
    q1Answer: 'नीला',
    
    q2Question: 'कितने छात्र लाल या पीला पसंद करते हैं?',
    q2Hint: 'लाल और पीले पट्टियों के मूल्यों को जोड़ें',
    q2Solution: 'लाल: 43 छात्र, पीला: 49 छात्र। कुल = 43 + 49 = 92 छात्र',
    q2Answer: '92',
    
    q3Question: 'सर्वेक्षण किए गए छात्रों की कुल संख्या क्या है?',
    q3Hint: 'सभी पट्टी मूल्यों को एक साथ जोड़ें',
    q3Solution: 'लाल(43) + हरा(19) + नीला(55) + पीला(49) + नारंगी(34) = 200 छात्र',
    q3Answer: '200',
    
    q4Question: 'किस छात्र ने सबसे अधिक अंक प्राप्त किए?',
    q4Hint: 'अधिकतम अंकों का प्रतिनिधित्व करने वाली सबसे लंबी पट्टी खोजें',
    q4Solution: 'हरि ने 540 अंकों के साथ सबसे अधिक अंक प्राप्त किए',
    q4Answer: 'हरि',
    
    q5Question: 'उच्चतम और न्यूनतम अंकों के बीच का अंतर क्या है?',
    q5Hint: 'उच्चतम पट्टी मूल्य से न्यूनतम पट्टी मूल्य घटाएं',
    q5Solution: 'उच्चतम: हरि (540), न्यूनतम: दीप्ति (300)। अंतर = 540 - 300 = 240 अंक',
    q5Answer: '240',
    
    q6Question: '400 से अधिक अंक प्राप्त करने वाले कितने छात्र हैं?',
    q6Hint: '400 अंक रेखा से ऊंची पट्टियों की गिनती करें',
    q6Solution: 'अजय(450), बाली(500), हरि(540) - कुल 3 छात्रों ने 400 से अधिक अंक प्राप्त किए',
    q6Answer: '3',
    
    // Real World Examples
    realWorldTitle: 'वास्तविक दुनिया के अनुप्रयोग',
    realWorldSubtitle: 'देखें कि रोजमर्रा की जिंदगी में बार ग्राफ का उपयोग कैसे किया जाता है',
    
    ex1Title: 'पसंदीदा रंग सर्वेक्षण',
    ex1Context: '6वीं और 7वीं कक्षा के 200 छात्रों से उनके पसंदीदा स्कूल भवन के रंग के बारे में सर्वेक्षण किया गया',
    ex1Question: 'कौन सा रंग सबसे अधिक पसंद किया जाता है?',
    ex1Answer: 'नीला सबसे पसंदीदा रंग है (55 छात्र)',
    
    ex2Title: 'छात्र प्रदर्शन',
    ex2Context: 'एक कक्षा परीक्षण में छह बच्चों द्वारा प्राप्त कुल अंक (600 में से)',
    ex2Question: 'किसने सबसे अच्छा प्रदर्शन किया?',
    ex2Answer: 'हरि ने 540 अंकों के साथ सबसे अच्छा प्रदर्शन किया',
    
    ex3Title: 'धूप के घंटों की तुलना',
    ex3Context: '12 महीनों के लिए मार्गेट और एबरडीन में धूप के औसत दैनिक घंटे',
    ex3Question: 'किस शहर में अधिक धूप है?',
    ex3Answer: 'अप्रैल को छोड़कर सभी महीनों में मार्गेट में अधिक धूप है',
    
    ex4Title: 'जल-प्रतिरोधी घड़ियाँ',
    ex4Context: '4 विभिन्न कंपनियों से जल-प्रतिरोधी घड़ियों के सर्वेक्षण परिणाम',
    ex4Question: 'किस कंपनी की गुणवत्ता सबसे अच्छी है?',
    ex4Answer: 'कंपनी C में जल-प्रतिरोधी घड़ियों की संख्या सबसे अधिक है',
    
    ex5Title: 'पुस्तक बिक्री तुलना',
    ex5Context: '1995 से 1998 तक अंग्रेजी और हिंदी पुस्तकों की बिक्री',
    ex5Question: 'किस वर्ष में हिंदी पुस्तकों की बिक्री सबसे अधिक थी?',
    ex5Answer: '1998 में हिंदी पुस्तकों की बिक्री सबसे अधिक थी (650 पुस्तकें)',
    
    ex6Title: 'शिक्षक प्रदर्शन परीक्षण',
    ex6Context: 'शिक्षण पद्धति का मूल्यांकन करने के लिए 5 छात्रों के त्रैमासिक और अर्धवार्षिक परीक्षणों के अंक',
    ex6Question: 'क्या शिक्षक को नई पद्धति जारी रखनी चाहिए?',
    ex6Answer: 'हां, क्योंकि अधिकांश छात्रों ने अर्धवार्षिक परीक्षण में सुधार दिखाया',
    
    // Why Bar Graphs Matter section
    whyMatterTitle: 'बार ग्राफ क्यों महत्वपूर्ण हैं?',
    whyMatterPoint1: 'दृश्य स्पष्टता: बार ग्राफ जटिल डेटा को एक नज़र में समझना आसान बनाते हैं।',
    whyMatterPoint2: 'तुलना: विभिन्न श्रेणियों या समूहों की साइड-बाय-साइड तुलना के लिए बिल्कुल सही।',
    whyMatterPoint3: 'निर्णय लेना: डेटा पैटर्न के आधार पर सूचित निर्णय लेने में मदद करता है।',
    whyMatterPoint4: 'सार्वभौमिक भाषा: व्यापार, शिक्षा, विज्ञान और दैनिक जीवन में दुनिया भर में उपयोग किया जाता है।',
    
    // Pro Tip section
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipText: 'बार ग्राफ बनाते समय, हमेशा अपनी स्केल को शून्य से शुरू करें और समान विभाजन का उपयोग करें। यह सटीक प्रतिनिधित्व सुनिश्चित करता है और भ्रामक विज़ुअलाइज़ेशन को रोकता है! 📏✨',
    
    // Learn section additional translations
    sampleBarGraph: '📊 नमूना बार ग्राफ',
    choosingRightScale: '🎯 सही स्केल चुनना',
    goodScale: 'अच्छी स्केल: 1 इकाई = 10 छात्र',
    badScale: 'खराब स्केल: अनियमित विभाजन',
    divisions: 'विभाजन',
    equalDivisions: '✓ समान विभाजन, पढ़ने में आसान',
    unequalDivisions: '✗ असमान विभाजन, भ्रामक!',
    surveyData: 'सर्वेक्षण डेटा:',
    surveyDescription: '6वीं और 7वीं कक्षा के 200 छात्रों से उनके पसंदीदा स्कूल भवन के रंग के बारे में पूछा गया।',
    color: 'रंग',
    students: 'छात्र',
    favoriteColorSurvey: '🎨 पसंदीदा रंग सर्वेक्षण',
    scaleUnit10: 'स्केल: 1 इकाई = 10 छात्र',
    studentsText: 'छात्र',
    colors: 'रंग 🎨',
    sunshineData: 'धूप डेटा:',
    sunshineDescription: 'विभिन्न महीनों के लिए दो शहरों (मार्गेट और एबरडीन) में धूप के औसत दैनिक घंटे।',
    margate: 'मार्गेट',
    aberdeen: 'एबरडीन',
    doubleBarGraph: '☀️ डबल बार ग्राफ',
    scaleUnit1: 'स्केल: 1 इकाई = 1 घंटा',
    hours: 'घंटे',
    months: 'महीने 📅',
    pause: '⏸️ रोकें',
    play: '▶️ चलाएं',
    
    // Practice section additional translations (already defined above)
    
    // Assessment section
    practiceComplete: 'अभ्यास पूरा!',
    practiceCompleteSubtitle: 'आपने सभी बार ग्राफ अभ्यास पूरे कर लिए हैं!',
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
    
    // Data Labels
    red: 'लाल',
    green: 'हरा',
    blue: 'नीला',
    yellow: 'पीला',
    orange: 'नारंगी',
    math: 'गणित',
    science: 'विज्ञान',
    english: 'अंग्रेजी',
    history: 'इतिहास',
    art: 'कला',
    monday: 'सोम',
    tuesday: 'मंगल',
    wednesday: 'बुध',
    thursday: 'गुरु',
    friday: 'शुक्र',
    ajay: 'अजय',
    bali: 'बाली',
    dipti: 'दीप्ति',
    faiyaz: 'फैयाज',
    geetika: 'गीतिका',
    hari: 'हरि',
    january: 'जनवरी',
    february: 'फरवरी',
    march: 'मार्च',
    april: 'अप्रैल',
    may: 'मई',
    june: 'जून',
    companyA: 'ए',
    companyB: 'बी',
    companyC: 'सी',
    companyD: 'डी',
    
    // Progress labels
    questionProgress: 'प्रश्न',
    of: 'का',
    
    // Button labels
    clickToExpand: 'विस्तार करने के लिए क्लिक करें',
    clickToCollapse: 'संकुचित करने के लिए क्लिक करें',
  },
  gu: {
    // Header
    appTitle: 'બાર ગ્રાફનો ઉપયોગ',
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
    step1Title: 'બાર ગ્રાફને સમજવા',
    step1Desc: 'બાર ગ્રાફ શું છે અને ક્યારે ઉપયોગ કરવો તે શીખો',
    step1Concept: 'બાર ગ્રાફનો ઉપયોગ સમય સાથે થતા ફેરફારો બતાવવા અથવા વસ્તુઓની તુલના કરવા માટે થઈ શકે છે.',
    
    step2Title: 'સ્કેલ પસંદ કરવું',
    step2Desc: 'તમારા બાર ગ્રાફ માટે યોગ્ય સ્કેલ પસંદ કરવાનું શીખો',
    step2Concept: 'સ્કેલ નક્કી કરે છે કે અક્ષ પર દરેક એકમ કેટલું પ્રતિનિધિત્વ કરે છે। એક સ્કેલ પસંદ કરો જે: (1) 0 થી શરૂ થાય, (2) સમાન વિભાજન હોય, (3) સૌથી મોટા મૂલ્યને સમાવે, (4) ગ્રાફને વાંચવું સરળ બનાવે',
    
    step3Title: 'બાર ગ્રાફ વાંચવા',
    step3Desc: 'બાર ગ્રાફ વાંચવા અને અર્થઘટન કરવાની પ્રેક્ટિસ કરો',
    step3Question: 'કયો રંગ સૌથી વધુ પસંદ થયેલ છે અને કયો સૌથી ઓછો?',
    step3Answer: 'વાદળી સૌથી વધુ પસંદ થયેલ છે (55 વિદ્યાર્થીઓ) અને લીલો સૌથી ઓછો પસંદ થયેલ છે (19 વિદ્યાર્થીઓ)',
    
    step4Title: 'ડબલ બાર ગ્રાફ',
    step4Desc: 'બે સેટ ડેટાની બાજુમાં બાજુ તુલના કરવાનું શીખો',
    step4Question: 'માર્ગેટમાં એબરડીનની તુલનામાં કયા મહિનામાં વધુ સૂર્યપ્રકાશ છે?',
    step4Answer: 'એપ્રિલ સિવાય, માર્ગેટમાં હંમેશા એબરડીન કરતાં વધુ સૂર્યપ્રકાશ હોય છે',
    
    // Learn Tab - Key Points
    keyPoint1: 'પટ્ટીઓનો ઉપયોગ કરીને વિઝ્યુઅલ રજૂઆત',
    keyPoint2: 'શ્રેણીઓની સરળ તુલના',
    keyPoint3: 'પટ્ટીઓ ઊભી અથવા આડી હોઈ શકે છે',
    keyPoint4: 'ઊંચાઈ/લંબાઈ આવૃત્તિ દર્શાવે છે',
    
    scaleKey1: 'સ્કેલ 0 થી શરૂ કરો',
    scaleKey2: 'સમાન વિભાજનનો ઉપયોગ કરો',
    scaleKey3: 'સૌથી મોટા મૂલ્યને સમાવો',
    scaleKey4: 'તેને વાંચવું સરળ બનાવો',
    
    // Practice Mode
    practiceTitle: 'પ્રેક્ટિસ પ્રશ્નો',
    practiceSubtitle: 'બાર ગ્રાફની તમારી સમજણનું પરીક્ષણ કરો',
    dataTitle: 'આપેલ ડેટા',
    questionTitle: 'પ્રશ્ન',
    hintLabel: 'સંકેત',
    solutionLabel: 'ઉકેલ',
    stepLabel: 'પગલું',
    
    // Practice Questions
    q1Question: 'વિદ્યાર્થીઓ દ્વારા કયો રંગ સૌથી વધુ પસંદ થયેલ છે?',
    q1Hint: 'ગ્રાફમાં સૌથી ઊંચી પટ્ટી જુઓ',
    q1Solution: 'વાદળી 55 વિદ્યાર્થીઓ સાથે સૌથી પસંદીદા રંગ છે',
    q1Answer: 'વાદળી',
    
    q2Question: 'કેટલા વિદ્યાર્થીઓ લાલ અથવા પીળો પસંદ કરે છે?',
    q2Hint: 'લાલ અને પીળી પટ્ટીઓના મૂલ્યો ઉમેરો',
    q2Solution: 'લાલ: 43 વિદ્યાર્થીઓ, પીળો: 49 વિદ્યાર્થીઓ। કુલ = 43 + 49 = 92 વિદ્યાર્થીઓ',
    q2Answer: '92',
    
    q3Question: 'સર્વેક્ષણ કરાયેલા વિદ્યાર્થીઓની કુલ સંખ્યા શું છે?',
    q3Hint: 'બધા પટ્ટી મૂલ્યોને એકસાથે ઉમેરો',
    q3Solution: 'લાલ(43) + લીલો(19) + વાદળી(55) + પીળો(49) + નારંગી(34) = 200 વિદ્યાર્થીઓ',
    q3Answer: '200',
    
    q4Question: 'કયા વિદ્યાર્થીએ સૌથી વધુ ગુણ મેળવ્યા?',
    q4Hint: 'મહત્તમ ગુણનું પ્રતિનિધિત્વ કરતી સૌથી ઊંચી પટ્ટી શોધો',
    q4Solution: 'હરિએ 540 ગુણ સાથે સૌથી વધુ ગુણ મેળવ્યા',
    q4Answer: 'હરિ',
    
    q5Question: 'સૌથી વધુ અને સૌથી ઓછા ગુણ વચ્ચેનો તફાવત શું છે?',
    q5Hint: 'સૌથી વધુ પટ્ટી મૂલ્યમાંથી સૌથી ઓછી પટ્ટી મૂલ્ય ઘટાડો',
    q5Solution: 'સૌથી વધુ: હરિ (540), સૌથી ઓછું: દીપ્તિ (300)। તફાવત = 540 - 300 = 240 ગુણ',
    q5Answer: '240',
    
    q6Question: '400 થી વધુ ગુણ મેળવનારા કેટલા વિદ્યાર્થીઓ છે?',
    q6Hint: '400 ગુણ રેખા કરતાં ઊંચી પટ્ટીઓની ગણતરી કરો',
    q6Solution: 'અજય(450), બાલી(500), હરિ(540) - કુલ 3 વિદ્યાર્થીઓએ 400 થી વધુ ગુણ મેળવ્યા',
    q6Answer: '3',
    
    // Real World Examples
    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉપયોગો',
    realWorldSubtitle: 'રોજિંદા જીવનમાં બાર ગ્રાફનો ઉપયોગ કેવી રીતે થાય છે તે જુઓ',
    
    ex1Title: 'પસંદીદા રંગ સર્વેક્ષણ',
    ex1Context: '6ઠ્ઠી અને 7મી ધોરણના 200 વિદ્યાર્થીઓએ તેમના પસંદીદા શાળા ભવનના રંગ વિશે સર્વેક્ષણ કર્યું',
    ex1Question: 'કયો રંગ સૌથી વધુ પસંદ થયેલ છે?',
    ex1Answer: 'વાદળી સૌથી પસંદીદા રંગ છે (55 વિદ્યાર્થીઓ)',
    
    ex2Title: 'વિદ્યાર્થી પ્રદર્શન',
    ex2Context: 'વર્ગ પરીક્ષણમાં છ બાળકો દ્વારા મેળવેલા કુલ ગુણ (600 માંથી)',
    ex2Question: 'કોણે શ્રેષ્ઠ પ્રદર્શન કર્યું?',
    ex2Answer: 'હરિએ 540 ગુણ સાથે શ્રેષ્ઠ પ્રદર્શન કર્યું',
    
    ex3Title: 'સૂર્યપ્રકાશ કલાકોની તુલના',
    ex3Context: '12 મહિના માટે માર્ગેટ અને એબરડીનમાં સૂર્યપ્રકાશના સરેરાશ દૈનિક કલાકો',
    ex3Question: 'કયા શહેરમાં વધુ સૂર્યપ્રકાશ છે?',
    ex3Answer: 'એપ્રિલ સિવાય બધા મહિનામાં માર્ગેટમાં વધુ સૂર્યપ્રકાશ છે',
    
    ex4Title: 'પાણી-પ્રતિરોધક ઘડિયાળો',
    ex4Context: '4 વિવિધ કંપનીઓમાંથી પાણી-પ્રતિરોધક ઘડિયાળોના સર્વેક્ષણ પરિણામો',
    ex4Question: 'કઈ કંપનીની ગુણવત્તા શ્રેષ્ઠ છે?',
    ex4Answer: 'કંપની C પાસે સૌથી વધુ સંખ્યામાં પાણી-પ્રતિરોધક ઘડિયાળો છે',
    
    ex5Title: 'પુસ્તક વેચાણ તુલના',
    ex5Context: '1995 થી 1998 સુધી અંગ્રેજી અને હિન્દી પુસ્તકોનું વેચાણ',
    ex5Question: 'કયા વર્ષમાં સૌથી વધુ હિન્દી પુસ્તકોનું વેચાણ થયું?',
    ex5Answer: '1998માં સૌથી વધુ હિન્દી પુસ્તકોનું વેચાણ થયું (650 પુસ્તકો)',
    
    ex6Title: 'શિક્ષક પ્રદર્શન પરીક્ષણ',
    ex6Context: 'શિક્ષણ પદ્ધતિનું મૂલ્યાંકન કરવા માટે 5 વિદ્યાર્થીઓના ત્રૈમાસિક અને અર્ધવાર્ષિક પરીક્ષણોના ગુણ',
    ex6Question: 'શું શિક્ષકે નવી પદ્ધતિ ચાલુ રાખવી જોઈએ?',
    ex6Answer: 'હા, કારણ કે મોટાભાગના વિદ્યાર્થીઓએ અર્ધવાર્ષિક પરીક્ષણમાં સુધારો દર્શાવ્યો',
    
    // Why Bar Graphs Matter section
    whyMatterTitle: 'બાર ગ્રાફ શા માટે મહત્વપૂર્ણ છે?',
    whyMatterPoint1: 'દ્રશ્ય સ્પષ્ટતા: બાર ગ્રાફ જટિલ ડેટાને એક નજરમાં સમજવાનું સરળ બનાવે છે।',
    whyMatterPoint2: 'તુલના: વિવિધ કેટેગરીઓ અથવા જૂથોની બાજુ-બાજુ તુલના માટે યોગ્ય।',
    whyMatterPoint3: 'નિર્ણય લેવા: ડેટા પેટર્નના આધારે માહિતીપૂર્ણ નિર્ણય લેવામાં મદદ કરે છે।',
    whyMatterPoint4: 'સાર્વત્રિક ભાષા: વ્યવસાય, શિક્ષણ, વિજ્ઞાન અને રોજિંદા જીવનમાં વિશ્વભરમાં ઉપયોગ થાય છે।',
    
    // Pro Tip section
    proTipTitle: 'વિશેષજ્ઞ સૂચના!',
    proTipText: 'બાર ગ્રાફ બનાવતી વખતે, હંમેશા તમારી સ્કેલને શૂન્યથી શરૂ કરો અને સમાન વિભાગોનો ઉપયોગ કરો। આ સચોટ પ્રતિનિધિત્વ સુનિશ્ચિત કરે છે અને ગેરસમજ કરાવતા વિઝ્યુઅલાઇઝેશનને અટકાવે છે! 📏✨',
    
    // Learn section additional translations
    sampleBarGraph: '📊 નમૂના બાર ગ્રાફ',
    choosingRightScale: '🎯 સાચું સ્કેલ પસંદ કરવું',
    goodScale: 'સારું સ્કેલ: 1 એકમ = 10 વિદ્યાર્થીઓ',
    badScale: 'ખરાબ સ્કેલ: અનિયમિત વિભાગો',
    divisions: 'વિભાગો',
    equalDivisions: '✓ સમાન વિભાગો, વાંચવામાં સરળ',
    unequalDivisions: '✗ અસમાન વિભાગો, ગેરસમજ!',
    surveyData: 'સર્વેક્ષણ ડેટા:',
    surveyDescription: '6ઠ્ઠી અને 7મી ધોરણના 200 વિદ્યાર્થીઓને તેમના પસંદગીના શાળા ઇમારતના રંગ વિશે પૂછવામાં આવ્યું હતું।',
    color: 'રંગ',
    students: 'વિદ્યાર્થીઓ',
    favoriteColorSurvey: '🎨 પસંદગીના રંગનું સર્વેક્ષણ',
    scaleUnit10: 'સ્કેલ: 1 એકમ = 10 વિદ્યાર્થીઓ',
    studentsText: 'વિદ્યાર્થીઓ',
    colors: 'રંગો 🎨',
    sunshineData: 'સૂર્યપ્રકાશ ડેટા:',
    sunshineDescription: 'વિવિધ મહિનાઓ માટે બે શહેરો (માર્ગેટ અને એબરડીન) માં સૂર્યપ્રકાશના સરેરાશ દૈનિક કલાકો।',
    margate: 'માર્ગેટ',
    aberdeen: 'એબરડીન',
    doubleBarGraph: '☀️ ડબલ બાર ગ્રાફ',
    scaleUnit1: 'સ્કેલ: 1 એકમ = 1 કલાક',
    hours: 'કલાકો',
    months: 'મહિના 📅',
    pause: '⏸️ રોકો',
    play: '▶️ ચલાવો',
    
    // Practice section additional translations (already defined above)
    
    // Assessment section
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે બધા બાર ગ્રાફ પ્રેક્ટિસ પૂરા કર્યા છે!',
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
    
    // Data Labels
    red: 'લાલ',
    green: 'લીલો',
    blue: 'વાદળી',
    yellow: 'પીળો',
    orange: 'નારંગી',
    math: 'ગણિત',
    science: 'વિજ્ઞાન',
    english: 'અંગ્રેજી',
    history: 'ઇતિહાસ',
    art: 'કલા',
    monday: 'સોમ',
    tuesday: 'મંગળ',
    wednesday: 'બુધ',
    thursday: 'ગુરુ',
    friday: 'શુક્ર',
    ajay: 'અજય',
    bali: 'બાલી',
    dipti: 'દીપ્તિ',
    faiyaz: 'ફૈયાઝ',
    geetika: 'ગીતિકા',
    hari: 'હરિ',
    january: 'જાન્યુઆરી',
    february: 'ફેબ્રુઆરી',
    march: 'માર્ચ',
    april: 'એપ્રિલ',
    may: 'મે',
    june: 'જૂન',
    companyA: 'એ',
    companyB: 'બી',
    companyC: 'સી',
    companyD: 'ડી',
    
    // Progress labels
    questionProgress: 'પ્રશ્ન',
    of: 'નો',
    
    // Button labels
    clickToExpand: 'વિસ્તૃત કરવા માટે ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા માટે ક્લિક કરો',
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


