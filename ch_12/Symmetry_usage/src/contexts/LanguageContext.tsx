import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'Line of Symmetry',
    learn: 'Learn',
    practice: 'Practice',
    realWorld: 'Real World',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    tryAgain: 'Try Again',
    showHint: 'Show Hint',
    hideHint: 'Hide Hint',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    yourAnswer: 'Your Answer',
    score: 'Score',
    question: 'Question',
    dataTitle: 'Given Information',
    practiceTitle: 'Practice Questions',
    practiceSubtitle: 'Understand and identify lines of symmetry',
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You\'ve finished all symmetry exercises!',
    yourScore: 'Your Score',
    accuracy: 'Accuracy',
    totalAttempts: 'Total Attempts',
    exerciseBreakdown: 'Exercise Breakdown',
    attemptLabel: 'attempt(s)',
    viewAssessment: 'View Assessment',

    // Learn steps
    step1Title: 'Introduction to Symmetry',
    step1Desc: 'Where we see symmetry and what it means',
    step1Concept: 'A figure has line symmetry if it can be folded along a line so that the two halves match exactly.',
    introP1: 'Symmetry is everywhere: nature, art, buildings, products.',
    introP2: 'Creators use it: artists, engineers, designers, architects.',
    introP3: 'Line symmetry: fold on a line; two halves match (mirror).',
    introP4: 'Try: collect designs; make ink‑blots and paper cuts.',

    step2Title: 'Mirror and Left–Right Flip',
    step2Desc: 'Notice left-right change in a mirror',
    step2Concept: 'Across a mirror line, the figure flips left–right. The shape stays the same, but the orientation reverses.',
    mirrorP1: 'Mirror changes left ↔ right; top/bottom stay same.',
    mirrorP2: 'Letters like B look reversed across the mirror line.',
    mirrorP3: 'Use a dotted line to mark the mirror; reflect across it.',
    mirrorP4: 'Test it: hold a small mirror on the line; compare sides.',
    mirrorP5: 'Tip: draw light guidelines before final reflection.',

    step3Title: 'Play the Punching Game',
    step3Desc: 'Fold, punch a hole, open to see symmetry',
    step3Concept: 'Fold paper, punch once, and unfold; matching holes appear about the fold — the fold is an axis of symmetry.',
    punchP1: 'Step 1: Fold paper in half along a line.',
    punchP2: 'Step 2: Punch a hole through the folded paper.',
    punchP3: 'Step 3: Unfold — two matching holes appear.',
    punchP4: 'The fold line is the axis of symmetry.',

    step4Title: 'Regular Polygons',
    step4Desc: 'Axis count matches number of sides',
    step4Concept: 'Equilateral triangle has 3 axes; square has 4. For a regular n‑gon, there are n lines of symmetry.',
    polygonP1: 'Rule: Regular polygons have symmetry equal to sides.',
    polygonP2: 'Triangle: 3 sides = 3 axes of symmetry.',
    polygonP3: 'Square: 4 sides = 4 axes of symmetry.',
    polygonP4: 'Pattern: n-gon has n lines of symmetry.',

    step5Title: 'Multiple Lines of Symmetry',
    step5Desc: 'Some shapes have many symmetry lines',
    step5Concept: 'Rectangle has 2, square has 4, circle has infinitely many; snowflakes and patterns can have several axes.',
    multiLineP1: 'Rectangle: 2 axes — horizontal and vertical only.',
    multiLineP2: 'Square: 4 axes — two medians and two diagonals.',
    multiLineP3: 'Circle: infinitely many axes through the center.',
    multiLineP4: 'Patterns like snowflakes/stars often show several axes.',

    // Labels used in visuals
    triangle: 'Equilateral Triangle',
    square: 'Square',
    pentagon: 'Regular Pentagon',
    hexagon: 'Regular Hexagon',
    mirrorLine: 'Mirror Line',
    axesOfSymmetry: 'Axes of Symmetry',

    // Expand/Collapse
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',

    // Real World Applications
    realWorldTitle: 'Real World Applications',
    realWorldSubtitle: 'Symmetry around us',
    architectureTitle: 'Architecture',
    architectureDesc: 'Building facades often show a vertical mirror line.',
    vehiclesTitle: 'Vehicles',
    vehiclesDesc: 'Cars are designed with left-right mirror symmetry for stability.',
    natureLeavesTitle: 'Nature: Leaves',
    natureLeavesDesc: 'Many leaves are approximately bilaterally symmetric',
    butterfliesTitle: 'Butterflies',
    butterfliesDesc: 'Butterfly wings mirror across the body axis.',
    logosSymbolsTitle: 'Logos & Symbols',
    logosSymbolsDesc: 'Several logos use vertical or horizontal lines of symmetry.',
    patternsRugsTitle: 'Patterns & Rugs',
    patternsRugsDesc: 'Geometric patterns often repeat with multiple symmetry lines.',

    // Why + Pro tip
    whyMatterTitle: 'Why Symmetry Matters?',
    whyMatterPoint1: 'Visual balance: Symmetry makes designs stable and pleasing.',
    whyMatterPoint2: 'Recognition: Many logos and symbols use symmetry.',
    whyMatterPoint3: 'Checking accuracy: Mirror symmetry helps verify shapes by folding.',
    whyMatterPoint4: 'Mathematical insight: Regular polygons have symmetry equal to their sides.',
    proTipTitle: 'Pro Tip!',
    proTipText: 'When testing symmetry, remember mirror reflections swap left and right. Use paper folding or a mirror along the suspected line.',

    // Practice Qs (derived from textbook visuals)
    q1: 'How many lines of symmetry does an equilateral triangle have?',
    q1Answer: '3',
    q1Hint: 'Each vertex to the midpoint of the opposite side.',
    q1Solution: 'An equilateral triangle has 3 lines of symmetry.',

    q2: 'How many lines of symmetry does a square have?',
    q2Answer: '4',
    q2Hint: 'Two medians and two diagonals.',
    q2Solution: 'A square has four lines of symmetry: two medians and two diagonals.',

    q3: 'For a regular pentagon, number of lines of symmetry?',
    q3Answer: '5',
    q3Hint: 'Same as number of sides for regular polygons.',
    q3Solution: 'A regular pentagon has five lines of symmetry.',

    q4: 'A scalene triangle has how many lines of symmetry?',
    q4Answer: '0',
    q4Hint: 'No two sides equal, no fold matches.',
    q4Solution: 'A scalene triangle has no line of symmetry.',

    q5: 'Does the dotted line act as a mirror line for a kite shown vertically?',
    q5Answer: 'Yes',
    q5Hint: 'If left and right halves are mirror images around the vertical line.',
    q5Solution: 'Yes, along the vertical line the halves coincide.',

    q6: 'How many axes of symmetry does a regular hexagon have?',
    q6Answer: '6',
    q6Hint: 'Same as sides for regular polygons.',
    q6Solution: 'A regular hexagon has six axes of symmetry.',
  },
  hi: {
    appTitle: 'सममित रेखा',
    learn: 'सीखें',
    practice: 'अभ्यास',
    realWorld: 'वास्तविक दुनिया',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    tryAgain: 'पुनः प्रयास करें',
    showHint: 'संकेत दिखाएं',
    hideHint: 'संकेत छिपाएं',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छिपाएं',
    yourAnswer: 'आपका उत्तर',
    score: 'अंक',
    question: 'प्रश्न',
    dataTitle: 'दी गई जानकारी',
    practiceTitle: 'अभ्यास प्रश्न',
    practiceSubtitle: 'सममिति की रेखाओं को समझें और पहचानें',
    practiceComplete: 'अभ्यास पूरा!',
    practiceCompleteSubtitle: 'आपने सभी सममिति अभ्यास पूरे कर लिए हैं!',
    yourScore: 'आपका स्कोर',
    accuracy: 'सटीकता',
    totalAttempts: 'कुल प्रयास',
    exerciseBreakdown: 'अभ्यास विवरण',
    attemptLabel: 'प्रयास',
    viewAssessment: 'मूल्यांकन देखें',

    step1Title: 'सममिति का परिचय',
    step1Desc: 'हम सममिति कहाँ देखते हैं और इसका अर्थ',
    step1Concept: 'यदि किसी आकृति को एक रेखा के बारे में मोड़ा जा सके और दोनों हिस्से मिल जाएँ, तो उसमें रेखीय सममिति है।',
    introP1: 'सममिति हर जगह: प्रकृति, कला, भवन, डिज़ाइन।',
    introP2: 'इसे उपयोग करते हैं: कलाकार, इंजीनियर, डिज़ाइनर, आर्किटेक्ट।',
    introP3: 'रेखीय सममिति: रेखा पर मोड़ें; दोनों भाग मिलें (दर्पण)।',
    introP4: 'करें: डिज़ाइन जुटाएँ; इंक‑ब्लॉट, पेपर‑कट बनाएँ।',

    step2Title: 'दर्पण और दाएँ–बाएँ उलट',
    step2Desc: 'दर्पण में दाएँ-बाएँ बदल जाता है',
    step2Concept: 'दर्पण रेखा के बारे में आकृति की दिशा पलटती है; आकृति वही रहती है, अभिविन्यास उलट जाता है।',
    mirrorP1: 'दर्पण में दाएँ ↔ बाएँ बदलता है; ऊपर/नीचे वही रहता है।',
    mirrorP2: 'B जैसी अक्षर दर्पण रेखा के पार उलटी दिखती हैं।',
    mirrorP3: 'दर्पण रेखा को बिंदीदार रेखा से चिन्हित करें और प्रतिबिंब बनायें।',
    mirrorP4: 'जाँचें: रेखा पर छोटा दर्पण रखें और दोनों तरफ मिलान करें।',
    mirrorP5: 'सुझाव: अंतिम प्रतिबिंब से पहले हल्की रेखाएँ खींचें।',

    step3Title: 'पंचिंग गेम',
    step3Desc: 'मोड़ो, छेद करो, खोलो — सममिति देखो',
    step3Concept: 'कागज़ मोड़कर एक छेद करें; खोलने पर बराबर दूरी पर जुड़वां छेद दिखेंगे — मोड़ सममिति अक्ष है।',
    punchP1: 'चरण 1: कागज़ को एक रेखा के बारे में आधा मोड़ें।',
    punchP2: 'चरण 2: मुड़े हुए कागज़ में एक छेद करें।',
    punchP3: 'चरण 3: खोलें — दो मिलते-जुलते छेद दिखेंगे।',
    punchP4: 'मोड़ रेखा सममिति अक्ष है।',

    step4Title: 'नियमित बहुभुज',
    step4Desc: 'अक्षों की संख्या = भुजाएँ',
    step4Concept: 'समभुज त्रिभुज में 3, वर्ग में 4। नियमित n-भुज में n सममिति रेखाएँ।',
    polygonP1: 'नियम: नियमित बहुभुज में भुजाओं जितनी सममिति रेखाएँ होती हैं।',
    polygonP2: 'त्रिभुज: 3 भुजाएँ = 3 सममिति अक्ष।',
    polygonP3: 'वर्ग: 4 भुजाएँ = 4 सममिति अक्ष।',
    polygonP4: 'पैटर्न: n-भुज में n सममिति रेखाएँ होती हैं।',

    step5Title: 'अनेक सममिति रेखाएँ',
    step5Desc: 'कुछ आकृतियों में कई अक्ष होते हैं',
    step5Concept: 'आयत में 2, वर्ग में 4, वृत्त में अनंत; हिमपात जैसी आकृतियों में भी कई अक्ष होते हैं।',
    multiLineP1: 'आयत: 2 अक्ष — केवल क्षैतिज और ऊर्ध्वाधर।',
    multiLineP2: 'वर्ग: 4 अक्ष — दो मध्य रेखाएँ और दो विकर्ण।',
    multiLineP3: 'वृत्त: केंद्र से गुजरने वाली अनंत अक्ष।',
    multiLineP4: 'स्नोफ्लेक/तारों जैसे पैटर्न में कई अक्ष होते हैं।',

    triangle: 'समभुज त्रिभुज',
    square: 'वर्ग',
    pentagon: 'नियमित पंचभुज',
    hexagon: 'नियमित षट्भुज',
    mirrorLine: 'दर्पण रेखा',
    axesOfSymmetry: 'सममिति अक्ष',

    clickToExpand: 'विस्तार करने के लिए क्लिक करें',
    clickToCollapse: 'संकुचित करने के लिए क्लिक करें',

    // Real World Applications
    realWorldTitle: 'वास्तविक दुनिया के अनुप्रयोग',
    realWorldSubtitle: 'हमारे आसपास की सममिति',
    architectureTitle: 'वास्तुकला',
    architectureDesc: 'भवनों के मुख्य भाग अक्सर ऊर्ध्वाधर दर्पण रेखा दिखाते हैं।',
    vehiclesTitle: 'वाहन',
    vehiclesDesc: 'कारें स्थिरता के लिए बाएं-दाएं दर्पण सममिति के साथ डिज़ाइन की जाती हैं।',
    natureLeavesTitle: 'प्रकृति: पत्ते',
    natureLeavesDesc: 'कई पत्ते लगभग द्विपक्षीय सममित होते हैं',
    butterfliesTitle: 'तितलियां',
    butterfliesDesc: 'तितली के पंख शरीर अक्ष के पार दर्पण करते हैं।',
    logosSymbolsTitle: 'लोगो और प्रतीक',
    logosSymbolsDesc: 'कई लोगो ऊर्ध्वाधर या क्षैतिज सममिति रेखाओं का उपयोग करते हैं।',
    patternsRugsTitle: 'पैटर्न और कालीन',
    patternsRugsDesc: 'ज्यामितीय पैटर्न अक्सर कई सममिति रेखाओं के साथ दोहराए जाते हैं।',

    whyMatterTitle: 'सममिति क्यों महत्वपूर्ण है?',
    whyMatterPoint1: 'दृश्य संतुलन: सममिति डिजाइन को स्थिर और आकर्षक बनाती है।',
    whyMatterPoint2: 'पहचान: कई लोगो और प्रतीक सममिति का उपयोग करते हैं।',
    whyMatterPoint3: 'शुद्धता जाँच: मोड़/दर्पण से आकृतियों की सत्यता जाँची जा सकती है।',
    whyMatterPoint4: 'गणितीय समझ: नियमित बहुभुज में भुजाओं जितनी सममिति रेखाएँ होती हैं।',
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipText: 'सममिति जाँचते समय दाएँ-बाएँ अदला-बदली होती है। संदिग्ध रेखा पर कागज़ मोड़ें या दर्पण रखें।',

    q1: 'समभुज त्रिभुज में सममिति रेखाएँ कितनी होती हैं?',
    q1Answer: '3',
    q1Hint: 'हर शीर्ष से सामने की भुजा के मध्य बिंदु तक।',
    q1Solution: 'समभुज त्रिभुज में 3 सममिति रेखाएँ होती हैं।',

    q2: 'वर्ग में सममिति रेखाएँ कितनी होती हैं?',
    q2Answer: '4',
    q2Hint: 'दो मध्य रेखाएँ और दो विकर्ण।',
    q2Solution: 'वर्ग में चार सममिति रेखाएँ होती हैं।',

    q3: 'नियमित पंचभुज में सममिति रेखाएँ?',
    q3Answer: '5',
    q3Hint: 'नियमित बहुभुज: भुजाओं जितनी रेखाएँ।',
    q3Solution: 'नियमित पंचभुज में पाँच सममिति रेखाएँ होती हैं।',

    q4: 'विषमबाहु त्रिभुज में सममिति रेखाएँ कितनी?',
    q4Answer: '0',
    q4Hint: 'कोई दो भुजाएँ समान नहीं।',
    q4Solution: 'विषमबाहु त्रिभुज में कोई सममिति रेखा नहीं।',

    q5: 'ऊर्ध्व खड़ी रेखा के बारे में पतंग (काइट) सममित है?',
    q5Answer: 'हाँ',
    q5Hint: 'दाएँ-बाएँ भाग दर्पण प्रतिमा हैं।',
    q5Solution: 'हाँ, ऊर्ध्व रेखा के बारे में सममित है।',

    q6: 'नियमित षट्भुज की सममिति रेखाएँ कितनी?',
    q6Answer: '6',
    q6Hint: 'भुजाओं जितनी।',
    q6Solution: 'नियमित षट्भुज में छह सममिति रेखाएँ होती हैं।',
  },
  gu: {
    appTitle: 'સમમિતિની રેખા',
    learn: 'શીખો',
    practice: 'પ્રેક્ટિસ',
    realWorld: 'વાસ્તવિક દુનિયા',
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'સબમિટ',
    tryAgain: 'ફરી પ્રયાસ કરો',
    showHint: 'સંકેત બતાવો',
    hideHint: 'સંકેત છુપાવો',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    yourAnswer: 'તમારો જવાબ',
    score: 'સ્કોર',
    question: 'પ્રશ્ન',
    dataTitle: 'આપેલી માહિતી',
    practiceTitle: 'પ્રેક્ટિસ પ્રશ્નો',
    practiceSubtitle: 'સમમિતિની રેખાઓ સમજો અને ઓળખો',
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે તમામ સમમિતિ પ્રેક્ટિસ પૂર્ણ કર્યા!',
    yourScore: 'તમારો સ્કોર',
    accuracy: 'ચોકસાઈ',
    totalAttempts: 'કુલ પ્રયાસો',
    exerciseBreakdown: 'પ્રેક્ટિસ વિગતો',
    attemptLabel: 'પ્રયાસ',
    viewAssessment: 'મૂલ્યાંકન જુઓ',

    step1Title: 'સમમિતિ પરિચય',
    step1Desc: 'સમમિતિ શું છે અને ક્યાં જોઈએ છે',
    step1Concept: 'કોઈ આકારને એવી રેખા વિશે વાળી શકાય કે બંને ભાગ સમાન થાય તો તેમાં રેખીય સમમિતિ છે.',
    introP1: 'સમમિતિ બધે: કુદરત, કલા, ઈમારતો, ડિઝાઇન.',
    introP2: 'વપરાશ: કલાકાર, ઈજનેર, ડિઝાઇનર, આર્કિટેક્ટ.',
    introP3: 'રેખીય સમમિતિ: રેખા પર વાળો; બંને ભાગ મળે (કાચ).',
    introP4: 'કરો: ડિઝાઇન ભેગી કરો; ઇન્ક‑બ્લોટ, પેપર‑કટ બનાવો.',

    step2Title: 'કાચ અને ડાબે–જમણે બદલાવ',
    step2Desc: 'કાચમાં ડાબે-જમણે બદલાય છે',
    step2Concept: 'મિરર લાઇન વિશે આકારની દિશા ઉલટી થાય; આકાર એ જ રહે છે, અભિમુખતા બદલાય છે.',
    mirrorP1: 'કાચમાં ડાબે ↔ જમણે બદલાય; ઉપર/નીચે સમાન રહે છે.',
    mirrorP2: 'B જેવા અક્ષરો મિરર લાઇન પાર ઉલટા દેખાય છે.',
    mirrorP3: 'મિરર લાઇનને બિંદુદાર બતાવો અને તેની પાર પ્રતિબિંબ દોરો.',
    mirrorP4: 'ચકાસો: રેખા પર નાનું કાચ રાખી બન્ને બાજુ સરખાવો.',
    mirrorP5: 'ટિપ: અંતિમ પ્રતિબિંબ પહેલાં હળવી માર્ગદર્શક રેખાઓ દોરો.',

    step3Title: 'પંચિંગ રમત',
    step3Desc: 'વાળો, છિદ્ર કરો, ખોલો — સમમિતિ જુઓ',
    step3Concept: 'કાગળ વાળી ને એક છિદ્ર કરો; ખોલતાં જોડિયા છિદ્ર દેખાય — વાળ સમમિતિનો અક્ષ છે.',
    punchP1: 'પગલું 1: કાગળને એક રેખા વિશે અડધો વાળો.',
    punchP2: 'પગલું 2: વાળેલા કાગળમાં એક છિદ્ર કરો.',
    punchP3: 'પગલું 3: ખોલો — બે જોડિયા છિદ્ર દેખાય.',
    punchP4: 'વાળ રેખા સમમિતિ અક્ષ છે.',

    step4Title: 'નિયમિત બહુકોણ',
    step4Desc: 'અક્ષોની સંખ્યા = ભુજાઓ',
    step4Concept: 'સમભુજ ત્રિકોણમાં 3, ચોરસમાં 4; નિયમિત n-ભુજમાં n અક્ષ.',
    polygonP1: 'નિયમ: નિયમિત બહુકોણમાં ભુજાઓ જેટલા સમમિતિ અક્ષ હોય છે.',
    polygonP2: 'ત્રિકોણ: 3 ભુજાઓ = 3 સમમિતિ અક્ષ.',
    polygonP3: 'ચોરસ: 4 ભુજાઓ = 4 સમમિતિ અક્ષ.',
    polygonP4: 'પેટર્ન: n-ભુજમાં n સમમિતિ અક્ષ હોય છે.',

    step5Title: 'ઘણા સમમિતિ અક્ષ',
    step5Desc: 'કેટલાંક આકારોમાં અનેક અક્ષ હોય છે',
    step5Concept: 'આયત: 2, ચોરસ: 4, વર્તુળ: અસંખ્ય; સ્નોફ્લેક જેવા નમૂનાઓમાં પણ ઘણા અક્ષ હોય છે.',
    multiLineP1: 'આયત: 2 અક્ષ — માત્ર આડી અને ઊભી.',
    multiLineP2: 'ચોરસ: 4 અક્ષ — બે મધ્યરેખા અને બે કાઠા.',
    multiLineP3: 'વર્તુળ: કેન્દ્રમાંથી પસાર થતી અસંખ્ય અક્ષ.',
    multiLineP4: 'સ્નોફ્લેક/સ્ટાર જેવા નમૂનાઓમાં અનેક અક્ષ હોય છે.',

    triangle: 'સમભુજ ત્રિકોણ',
    square: 'ચોરસ',
    pentagon: 'નિયમિત પંચભુજ',
    hexagon: 'નિયમિત ષટ્ભુજ',
    mirrorLine: 'મિરર લાઇન',
    axesOfSymmetry: 'સમમિતિ અક્ષ',

    clickToExpand: 'વિસ્તૃત કરવા ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા ક્લિક કરો',

    // Real World Applications
    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉપયોગો',
    realWorldSubtitle: 'અમારી આસપાસની સમમિતિ',
    architectureTitle: 'આર્કિટેક્ચર',
    architectureDesc: 'બિલ્ડિંગના મુખ્ય ભાગો ઘણીવાર ઊભી દર્પણ રેખા દર્શાવે છે.',
    vehiclesTitle: 'વાહનો',
    vehiclesDesc: 'કારો સ્થિરતા માટે ડાબે-જમણે દર્પણ સમમિતિ સાથે ડિઝાઇન કરવામાં આવે છે.',
    natureLeavesTitle: 'પ્રકૃતિ: પાંદડા',
    natureLeavesDesc: 'ઘણા પાંદડા લગભગ દ્વિપક્ષીય સમમિત હોય છે',
    butterfliesTitle: 'તિતલીઓ',
    butterfliesDesc: 'તિતલીના પાંખો શરીર અક્ષ પાર દર્પણ કરે છે.',
    logosSymbolsTitle: 'લોગો અને પ્રતીકો',
    logosSymbolsDesc: 'ઘણા લોગો ઊભી અથવા આડી સમમિતિ રેખાઓનો ઉપયોગ કરે છે.',
    patternsRugsTitle: 'પેટર્ન અને કાર્પેટ',
    patternsRugsDesc: 'ભૂમિતીય પેટર્ન ઘણીવાર અનેક સમમિતિ રેખાઓ સાથે પુનરાવર્તિત થાય છે.',

    whyMatterTitle: 'સમમિતિ શા માટે મહત્વપૂર્ણ?',
    whyMatterPoint1: 'દ્રશ્ય સંતુલન: સમમિતિ ડિઝાઇનને સ્થિર અને આકર્ષક બનાવે છે.',
    whyMatterPoint2: 'ઓળખ: ઘણા લોગો અને ચિહ્નોમાં સમમિતિ હોય છે.',
    whyMatterPoint3: 'ખરાપરખ: વાળ/કાચથી આકારોની સાચાઈ ચકાસી શકાય છે.',
    whyMatterPoint4: 'ગણિતીય સમજ: નિયમિત બહુકોણમાં ભુજાઓ જેટલા અક્ષ હોય છે.',
    proTipTitle: 'વિશેષજ્ઞ સૂચન!',
    proTipText: 'સમમિતિ તપાસતા ડાબે-જમણે બદલાય છે. શંકિત રેખા પર કાગળ વાળો અથવા કાચ રાખો.',

    q1: 'સમભુજ ત્રિકોણમાં કેટલા સમમિતિ અક્ષ?',
    q1Answer: '3',
    q1Hint: 'દરેક શિર્ષથી સામેવાળી ભુજાના મધ્યબિંદુ સુધી.',
    q1Solution: 'સમભુજ ત્રિકોણમાં 3 સમમિતિ અક્ષ હોય છે.',

    q2: 'ચોરસમાં કેટલા સમમિતિ અક્ષ?',
    q2Answer: '4',
    q2Hint: 'બે મધ્યરેખાઓ અને બે કાઠા.',
    q2Solution: 'ચોરસમાં ચાર સમમિતિ અક્ષ હોય છે.',

    q3: 'નિયમિત પંચભુજમાં સમમિતિ અક્ષ?',
    q3Answer: '5',
    q3Hint: 'નિયમિત બહુકોણ: ભુજાઓ જેટલા.',
    q3Solution: 'નિયમિત પંચભુજમાં પાંચ સમમિતિ અક્ષ હોય છે.',

    q4: 'વિકર્ણબાહુ (સ્કેલિન) ત્રિકોણમાં સમમિતિ અક્ષ?',
    q4Answer: '0',
    q4Hint: 'કોઈ બે ભુજાઓ સમાન નથી.',
    q4Solution: 'સ્કેલિન ત્રિકોણમાં કોઈ સમમિતિ અક્ષ નથી.',

    q5: 'કાઇટ આકાર ઊભી રેખા વિશે સમમિત છે?',
    q5Answer: 'હા',
    q5Hint: 'ડાબે-જમણે ભાગ મિરર ઇમેજ છે.',
    q5Solution: 'હા, ઊભી રેખા વિશે સમમિત છે.',

    q6: 'નિયમિત ષટ્ભુજમાં સમમિતિ અક્ષ કેટલા?',
    q6Answer: '6',
    q6Hint: 'ભુજાઓ જેટલા.',
    q6Solution: 'નિયમિત ષટ્ભુજમાં 6 સમમિતિ અક્ષ છે.',
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


