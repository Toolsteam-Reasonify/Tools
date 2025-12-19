const fs = require('fs');

// Read the translation file
const data = JSON.parse(fs.readFileSync('src/locales/translation.json', 'utf8'));

console.log('Starting comprehensive translations...');

// ============================================================================
// HINDI TRANSLATIONS
// ============================================================================

// Hindi: Convection Practice Questions
if (data.hi && data.hi.convection && data.hi.convection.practice && data.hi.convection.practice.questions) {
  const questions = data.hi.convection.practice.questions;
  
  // Question 1
  if (questions[0]) {
    questions[0].question = "संवहन क्या है?";
    questions[0].options = [
      "कणों की गति के बिना ऊष्मा स्थानांतरण",
      "कणों की वास्तविक गति के माध्यम से ऊष्मा स्थानांतरण",
      "विद्युत चुम्बकीय तरंगों के माध्यम से ऊष्मा स्थानांतरण",
      "छूने से ऊष्मा स्थानांतरण"
    ];
    questions[0].correctAnswer = "कणों की वास्तविक गति के माध्यम से ऊष्मा स्थानांतरण";
    questions[0].explanation = "संवहन ऊष्मा स्थानांतरण की वह प्रक्रिया है जहाँ गर्म कण स्वयं एक स्थान से दूसरे स्थान पर चले जाते हैं। यह तरल पदार्थों (द्रव और गैसों) में होता है।";
  }
  
  // Question 2
  if (questions[1]) {
    questions[1].question = "गतिविधि 7.2 में, मोमबत्ती के ऊपर का कागज़ का कप ऊपर उठता है क्योंकि गर्म हवा ठंडी हवा से भारी होती है।";
    questions[1].options = ["सत्य", "असत्य"];
    questions[1].correctAnswer = "असत्य";
    questions[1].explanation = "असत्य! गर्म हवा ठंडी हवा से हल्की होती है। जब हवा गर्म होती है, तो यह फैलती है और कम घनत्व वाली हो जाती है, जिससे यह ऊपर उठती है। इसीलिए कप ऊपर की ओर झुक जाता है।";
  }
  
  // Question 3
  if (questions[2]) {
    questions[2].question = "गर्म हवा क्यों ऊपर उठती है?";
    questions[2].options = [
      "क्योंकि यह ठंडी हवा से भारी होती है",
      "क्योंकि यह फैलती है और हल्की हो जाती है",
      "गुरुत्वाकर्षण के कारण",
      "हवा के कारण"
    ];
    questions[2].correctAnswer = "क्योंकि यह फैलती है और हल्की हो जाती है";
    questions[2].explanation = "जब हवा गर्म होती है, तो यह फैलती है और अधिक स्थान घेरती है। यह इसे ठंडी हवा की तुलना में कम घनत्व (हल्का) बनाता है, इसलिए यह ऊपर उठती है।";
  }
  
  // Question 4
  if (questions[3]) {
    questions[3].question = "नीचे से गर्म किए जा रहे बीकर में पानी कहाँ चलता है?";
    questions[3].options = [
      "गर्म पानी केंद्र में ऊपर उठता है, ठंडा पानी किनारों पर नीचे जाता है",
      "गर्म पानी नीचे जाता है, ठंडा पानी ऊपर उठता है",
      "पानी स्थिर रहता है",
      "सभी पानी बेतरतीब ढंग से चलता है"
    ];
    questions[3].correctAnswer = "गर्म पानी केंद्र में ऊपर उठता है, ठंडा पानी किनारों पर नीचे जाता है";
    questions[3].explanation = "नीचे का पानी गर्म होता है, फैलता है, हल्का हो जाता है, और केंद्र से ऊपर उठता है। किनारों से ठंडा पानी नीचे चला जाता है, जिससे एक संवहन धारा बनती है।";
  }
  
  // Question 5
  if (questions[4]) {
    questions[4].question = "समुद्री हवा क्या है?";
    questions[4].options = [
      "दिन के दौरान जमीन से समुद्र की ओर हवा",
      "दिन के दौरान समुद्र से जमीन की ओर हवा",
      "रात के दौरान समुद्र से जमीन की ओर हवा",
      "केवल समुद्र में होने वाली हवा"
    ];
    questions[4].correctAnswer = "दिन के दौरान समुद्र से जमीन की ओर हवा";
    questions[4].explanation = "दिन के दौरान, जमीन पानी से तेजी से गर्म होती है। जमीन के ऊपर की गर्म हवा ऊपर उठती है, और समुद्र से ठंडी हवा जमीन की ओर चलती है। यह समुद्री हवा है।";
  }
  
  // Question 6
  if (questions[5]) {
    questions[5].question = "भूमि हवा क्या है?";
    questions[5].options = [
      "दिन के दौरान जमीन से समुद्र की ओर हवा",
      "दिन के दौरान समुद्र से जमीन की ओर हवा",
      "रात के दौरान जमीन से समुद्र की ओर हवा",
      "केवल जमीन पर होने वाली हवा"
    ];
    questions[5].correctAnswer = "रात के दौरान जमीन से समुद्र की ओर हवा";
    questions[5].explanation = "रात में, जमीन पानी से तेजी से ठंडी होती है। समुद्र के ऊपर की हवा गर्म होती है और ऊपर उठती है। जमीन से ठंडी हवा समुद्र की ओर चलती है। यह भूमि हवा है।";
  }
  
  // Question 7
  if (questions[6]) {
    questions[6].question = "संवहन ठोस में हो सकता है।";
    questions[6].options = ["सत्य", "असत्य"];
    questions[6].correctAnswer = "असत्य";
    questions[6].explanation = "असत्य! संवहन के लिए कणों का एक स्थान से दूसरे स्थान पर चलना आवश्यक है। ठोस में, कण अपनी स्थिति में स्थिर होते हैं, इसलिए संवहन नहीं हो सकता। संवहन केवल तरल पदार्थों (द्रव और गैसों) में होता है।";
  }
  
  // Question 8
  if (questions[7]) {
    questions[7].question = "दिन के दौरान, जमीन और समुद्र का तापमान कैसा व्यवहार करता है:";
    questions[7].options = [
      "जमीन तेजी से गर्म होती है, समुद्र धीरे-धीरे गर्म होता है",
      "समुद्र तेजी से गर्म होता है, जमीन धीरे-धीरे गर्म होती है",
      "दोनों एक ही दर से गर्म होते हैं",
      "जमीन ठंडी होती है, समुद्र गर्म होता है"
    ];
    questions[7].correctAnswer = "जमीन तेजी से गर्म होती है, समुद्र धीरे-धीरे गर्म होता है";
    questions[7].explanation = "जमीन की ताप क्षमता पानी से कम होती है, इसलिए यह दिन के दौरान तेजी से गर्म होती है। यह तापमान अंतर समुद्री हवा बनाता है।";
  }
  
  // Question 9
  if (questions[8]) {
    questions[8].question = "अगरबत्ती से धुआं क्यों ऊपर की ओर उठता है?";
    questions[8].options = [
      "क्योंकि धुआं ठोस है",
      "क्योंकि धुआं हवा से हल्का है",
      "क्योंकि धुआं गर्म गैसों का मिश्रण है और संवहन के कारण ऊपर उठता है",
      "हवा के कारण"
    ];
    questions[8].correctAnswer = "क्योंकि धुआं गर्म गैसों का मिश्रण है और संवहन के कारण ऊपर उठता है";
    questions[8].explanation = "धुआं गर्म गैसों और छोटे ठोस कणों का मिश्रण है। आसपास की हवा से गर्म होने के कारण, यह हल्का होता है और संवहन के माध्यम से ऊपर उठता है।";
  }
  
  // Question 10
  if (questions[9]) {
    questions[9].question = "रात में, समुद्र तट के पास हवा की दिशा दिन की तुलना में उलट जाती है।";
    questions[9].options = ["सत्य", "असत्य"];
    questions[9].correctAnswer = "सत्य";
    questions[9].explanation = "सत्य! दिन के दौरान, हमारे पास समुद्री हवा (समुद्र से जमीन) होती है। रात में, हमारे पास भूमि हवा (जमीन से समुद्र) होती है। दिशा अलग-अलग गर्म और ठंडा होने की दरों के कारण उलट जाती है।";
  }
  
  // Question 11 (Match)
  if (questions[10]) {
    questions[10].question = "प्रक्रिया को उसकी विशेषता से मिलाएं:";
    if (questions[10].pairs) {
      questions[10].pairs.left = [
        "चालन",
        "संवहन",
        "विकिरण",
        "संवहन धारा"
      ];
      questions[10].pairs.right = [
        "कण अपनी स्थिति में रहते हैं",
        "कण एक स्थान से दूसरे स्थान पर चलते हैं",
        "माध्यम की आवश्यकता नहीं",
        "तरल पदार्थ की गोलाकार गति"
      ];
    }
    if (questions[10].correctAnswer) {
      questions[10].correctAnswer = {
        "चालन": "कण अपनी स्थिति में रहते हैं",
        "संवहन": "कण एक स्थान से दूसरे स्थान पर चलते हैं",
        "विकिरण": "माध्यम की आवश्यकता नहीं",
        "संवहन धारा": "तरल पदार्थ की गोलाकार गति"
      };
    }
    questions[10].explanation = "चालन: कण अपनी जगह पर रहते हैं। संवहन: कण चलते हैं। विकिरण: माध्यम की आवश्यकता नहीं। संवहन धारा: गर्म तरल पदार्थ की निरंतर गोलाकार प्रवाह।";
  }
  
  // Question 12 (Sequence)
  if (questions[11]) {
    questions[11].question = "पानी गर्म करने में संवहन के चरणों को सही क्रम में व्यवस्थित करें:";
    if (questions[11].sequence) {
      questions[11].sequence = [
        "नीचे का पानी गर्म होता है",
        "गर्म पानी फैलता है और हल्का हो जाता है",
        "गर्म पानी ऊपर तक उठता है",
        "किनारों से ठंडा पानी नीचे चला जाता है",
        "नीचे ठंडा पानी गर्म होता है"
      ];
    }
    if (questions[11].correctAnswer) {
      questions[11].correctAnswer = [
        "नीचे का पानी गर्म होता है",
        "गर्म पानी फैलता है और हल्का हो जाता है",
        "गर्म पानी ऊपर तक उठता है",
        "किनारों से ठंडा पानी नीचे चला जाता है",
        "नीचे ठंडा पानी गर्म होता है"
      ];
    }
    questions[11].explanation = "यह पानी में संवहन का सही क्रम है। यह चक्र निरंतर दोहराता है, जिससे एक संवहन धारा बनती है।";
  }
}

// Hindi: Convection RealWorld Section
if (data.hi && data.hi.convection && data.hi.convection.realWorld) {
  const rw = data.hi.convection.realWorld;
  
  if (rw.header) {
    rw.header.title = "वास्तविक दुनिया के अनुप्रयोग";
    rw.header.subtitle = "रोजमर्रा की जिंदगी और प्रकृति में संवहन";
    rw.header.topic = "पाठ 7.2";
  }
  
  if (rw.intro) {
    rw.intro.title = "🌊 संवहन हमारे चारों ओर!";
    rw.intro.para1 = "संवहन केवल एक पाठ्यपुस्तक की अवधारणा नहीं है - यह हर जगह, हर पल हो रहा है!";
    rw.intro.para2 = "समुद्र तटीय शहरों को ठंडा करने वाली समुद्री हवा से लेकर आपकी सुबह की अगरबत्ती से उठने वाला धुआं,";
    rw.intro.para3 = "आपकी रसोई में उबलते पानी से लेकर पृथ्वी की जलवायु को नियंत्रित करने वाली विशाल समुद्री धाराओं तक।";
    rw.intro.para4 = "8 रोचक अनुप्रयोगों का अन्वेषण करें जहाँ संवहन एक महत्वपूर्ण भूमिका निभाता है,";
    rw.intro.para5 = "रोजमर्रा के अवलोकनों से लेकर ग्रह-स्तरीय घटनाओं तक। खोजें कि गर्म हवा का ऊपर उठना और";
    rw.intro.para6 = "ठंडी हवा का नीचे जाना हमारी दुनिया को कैसे आकार देता है!";
  }
  
  if (rw.filter) {
    rw.filter.title = "श्रेणी से फ़िल्टर करें:";
    rw.filter.all = "सभी अनुप्रयोग";
    rw.filter.showing = "दिखा रहे हैं";
    rw.filter.application = "अनुप्रयोग";
    rw.filter.applications = "अनुप्रयोग";
  }
  
  if (rw.categories) {
    rw.categories.all = "सभी अनुप्रयोग";
    rw.categories.Nature = "प्रकृति";
    rw.categories.Home = "घर";
    rw.categories.Kitchen = "रसोई";
    rw.categories.Everyday = "रोजमर्रा";
    rw.categories.Technology = "प्रौद्योगिकी";
  }
  
  if (rw.difficulty) {
    rw.difficulty.everyday = "रोजमर्रा की जिंदगी";
    rw.difficulty.nature = "प्राकृतिक घटना";
    rw.difficulty.technology = "प्रौद्योगिकी";
  }
  
  if (rw.labels) {
    rw.labels.howItWorks = "यह कैसे काम करता है:";
    rw.labels.scienceBehind = "🔬 इसके पीछे का विज्ञान:";
    rw.labels.realExample = "🌟 वास्तविक जीवन का उदाहरण:";
    rw.labels.benefits = "✨ लाभ और प्रभाव:";
  }
}

console.log('Hindi translations applied!');

// ============================================================================
// GUJARATI TRANSLATIONS
// ============================================================================

// Gujarati: Language and Nav
if (data.gu) {
  if (data.gu.language) {
    data.gu.language.en = "English";
    data.gu.language.hi = "હિન્દી";
    data.gu.language.gu = "ગુજરાતી";
    data.gu.language.selectorLabel = "ભાષા પસંદ કરો";
  }
  
  if (data.gu.nav) {
    data.gu.nav.logo = "ઉષ્ણતા સ્થાનાંતરણ";
    data.gu.nav.tabs.learn = "શીખો";
    data.gu.nav.tabs.practice = "પ્રેક્ટિસ કરો";
    data.gu.nav.tabs.applications = "વાસ્તવિક દુનિયાના ઉપયોગો";
  }
  
  // Gujarati: Conduction
  if (data.gu.conduction) {
    if (data.gu.conduction.header) {
      data.gu.conduction.header.badge = "પાઠ 7.1 - ઇન્ટરેક્ટિવ";
      data.gu.conduction.header.title = "ઉષ્ણતાનું conduction";
      data.gu.conduction.header.subtitle = "ખેંચો, મૂકો અને જાણો ઉષ્ણતા કેવી રીતે ચાલે છે!";
    }
    
    if (data.gu.conduction.intro) {
      data.gu.conduction.intro.title = "રસોઈના વાસણ ધાતુના જ કેમ હોય છે?";
      data.gu.conduction.intro.para1 = "પેમાએ તેની દાદીને મોટાં ધાતુના પેનમાં થુપ્પા બનાવતાં જોયાં. તેણે વિચાર્યું: \"રસોઈના વાસણ ધાતુથી જ કેમ બને છે?\"";
      data.gu.conduction.intro.para2 = "ચાલો, ઇન્ટરેક્ટિવ પ્રયોગોથી જવાબ શોધીએ!";
    }
  }
  
  // Gujarati: Convection Learn
  if (data.gu.convection && data.gu.convection.learn) {
    const learn = data.gu.convection.learn;
    
    if (learn.header) {
      learn.header.title = "પાઠ 7.2: Convection";
      learn.header.subtitle = "ગતિ દ્વારા ઉષ્ણતા સ્થાનાંતરણ સમજવું";
    }
    
    learn.step = "પગલું {current} / {total}";
    
    if (learn.controls) {
      learn.controls.previous = "પહેલાનું";
      learn.controls.next = "આગળ";
      learn.controls.play = "ચલાવો";
      learn.controls.pause = "રોકો";
      learn.controls.reset = "રીસેટ";
    }
    
    if (learn.indicators) {
      learn.indicators.practice = "ઇન્ટરેક્ટિવ પ્રેક્ટિસ મોડ";
      learn.indicators.realWorld = "વાસ્તવિક દુનિયાનો ઉપયોગ";
    }
    
    // Translate steps
    if (learn.steps && learn.steps.length > 0) {
      learn.steps[0].title = "Convection શું છે?";
      learn.steps[0].description = "Convection એ તરલ પદાર્થો (પ્રવાહી અને વાયુઓ) માં કણોની વાસ્તવિક ગતિ દ્વારા ઉષ્ણતા સ્થાનાંતરણની પ્રક્રિયા છે. Conductionથી વિપરીત જ્યાં કણો તેમની જગ્યાએ રહે છે, convection માં, ગરમ કણો પોતે એક જગ્યાથી બીજી જગ્યાએ જાય છે.";
      
      learn.steps[1].title = "પ્રવૃત્તિ 7.2: કાગળના કપનો પ્રયોગ";
      learn.steps[1].description = "એક લાકડી પર બે કાગળના કપ લટકાવવામાં આવ્યા છે. જ્યારે એક કપ નીચે મીણબત્તી મૂકવામાં આવે છે, ત્યારે અંદરની ગરમ હવા ઉપર ઉઠે છે, જે કપને ઉપર તરફ ઝુકાવે છે. આ દર્શાવે છે કે ગરમ હવા ઠંડી હવા કરતાં હળવી છે અને ઉપર ઉઠે છે.";
      
      learn.steps[2].title = "ગરમ હવા કેમ ઉપર ઉઠે છે?";
      learn.steps[2].description = "જ્યારે હવા ગરમ થાય છે, ત્યારે તે ફેલાય છે અને વધુ જગ્યા લે છે. આ તેને આસપાસની ઠંડી હવા કરતાં ઓછી ઘનતા (હળવી) બનાવે છે. હળવી ગરમ હવા ઉપર ઉઠે છે, જ્યારે ભારે ઠંડી હવા નીચે જાય છે.";
      
      learn.steps[3].title = "પ્રવાહીમાં Convection";
      learn.steps[3].description = "બીકરની તળિયેનું પાણી પહેલા ગરમ થાય છે. તે ફેલાય છે, હળવું બને છે, અને ઉપર ઉઠે છે. બાજુઓથી ઠંડું પાણી નીચે જાય છે. આ એક convection current બનાવે છે - ગરમ પાણીના ઉપર ઉઠવાનો અને ઠંડા પાણીના નીચે જવાનો સતત ચક્ર.";
      
      learn.steps[4].title = "ઇન્ટરેક્ટિવ: સમુદ્રની હવા (દિવસ)";
      learn.steps[4].description = "દિવસ દરમિયાન, જમીન પાણી કરતાં ઝડપથી ગરમ થાય છે. જમીનની ઉપરની ગરમ હવા ઉપર ઉઠે છે, અને સમુદ્રથી ઠંડી હવા જમીન તરફ જાય છે. આને સમુદ્રની હવા કહેવામાં આવે છે, જે ગરમ દિવસોમાં રાહત આપે છે.";
      
      learn.steps[5].title = "ઇન્ટરેક્ટિવ: જમીનની હવા (રાત્રિ)";
      learn.steps[5].description = "રાત્રે, જમીન પાણી કરતાં ઝડપથી ઠંડી થાય છે. સમુદ્રની ઉપરની હવા ગરમ હોય છે અને ઉપર ઉઠે છે. જમીનથી ઠંડી હવા સમુદ્ર તરફ જાય છે. આને જમીનની હવા કહેવામાં આવે છે, અને તે દિવસની હવાઓની દિશા ઉલટાવે છે.";
      
      learn.steps[6].title = "વાસ્તવિક દુનિયા: કિનારાની આબોહવા";
      learn.steps[6].description = "સમુદ્ર કિનારાની નજીક રહેતા લોકો દિવસે સમુદ્રની હવા (સમુદ્રથી ઠંડી હવા) અને રાત્રે જમીનની હવા (જમીનથી ઠંડી હવા) અનુભવે છે. આથી જ કિનારાના વિસ્તારોમાં મધ્યમ તાપમાન હોય છે અને સમુદ્ર તરફની બારીઓ પસંદ કરવામાં આવે છે.";
      
      learn.steps[7].title = "વાસ્તવિક દુનિયા: અગરબત્તીમાંથી ધુમાડો";
      learn.steps[7].description = "જ્યારે તમે અગરબત્તી (અગરબત્તી) સળગાવો છો, ત્યારે ધુમાડો ઉપર તરફ ઉઠે છે. આ એટલા માટે થાય છે કારણ કે ધુમાડો ગરમ વાયુઓ અને નાના કણોનું મિશ્રણ છે. આસપાસની હવા કરતાં ગરમ હોવાને કારણે, તે convection દ્વારા ઉપર ઉઠે છે.";
      
      learn.steps[8].title = "વાસ્તવિક દુનિયા: તમારા રૂમને ગરમ કરવું";
      learn.steps[8].description = "રૂમ હીટર convection પર કામ કરે છે. હીટરમાંથી ગરમ હવા છત સુધી ઉપર ઉઠે છે, પછી ઠંડી થઈને નીચે આવે છે. આ એક convection current બનાવે છે જે સમગ્ર રૂમમાં ગરમ હવાને પ્રસારિત કરે છે, તેને સમાન રીતે ગરમ કરે છે.";
    }
    
    if (learn.canvas) {
      learn.canvas.cup1 = "કપ 1";
      learn.canvas.cup2 = "કપ 2 (ગરમ)";
      learn.canvas.cup2Heated = "કપ 2";
      learn.canvas.hotAirRises = "🔥 ગરમ હવા ઉપર ઉઠે છે";
      learn.canvas.coldAirSinks = "❄️ ઠંડી હવા નીચે જાય છે";
      learn.canvas.hotWaterRises = "ગરમ પાણી ઉપર ઉઠે છે ↑";
      learn.canvas.coldWaterSinks = "ઠંડું પાણી નીચે જાય છે ↓";
      learn.canvas.daytime = "☀️ દિવસ";
      learn.canvas.nighttime = "🌙 રાત્રિ";
      learn.canvas.warmerLand = "ગરમ જમીન";
      learn.canvas.coolerSea = "ઠંડું સમુદ્ર";
      learn.canvas.coolerLand = "ઠંડી જમીન";
      learn.canvas.warmerSea = "ગરમ સમુદ્ર";
      learn.canvas.seaBreeze = "← સમુદ્રની હવા";
      learn.canvas.landBreeze = "જમીનની હવા →";
      learn.canvas.hot = "ગરમ";
      learn.canvas.cold = "ઠંડું";
      learn.canvas.convectionCurrent = "Convection Current";
    }
  }
  
  // Gujarati: Convection Practice
  if (data.gu.convection && data.gu.convection.practice) {
    const practice = data.gu.convection.practice;
    
    if (practice.header) {
      practice.header.title = "પ્રેક્ટિસ મોડ";
      practice.header.subtitle = "પાઠ 7.2: Convection";
    }
    
    if (practice.ui) {
      practice.ui.questionLabel = "પ્રશ્ન {current} / {total}";
      practice.ui.difficulty = {
        easy: "સરળ",
        medium: "મધ્યમ",
        hard: "કઠિન"
      };
      practice.ui.pointsLabel = "{points} પોઈન્ટ";
      practice.ui.progress = "પ્રગતિ";
      practice.ui.progressQuestions = "{answered} / {total} પ્રશ્નો";
      practice.ui.outOf = "{total} માંથી";
      practice.ui.previousButton = "← પહેલાનું";
      practice.ui.previousButtonShort = "← પહેલાનું";
      practice.ui.submitButton = "જવાબ તપાસો";
      practice.ui.submitButtonShort = "તપાસો";
      practice.ui.nextButton = "આગળનો પ્રશ્ન";
      practice.ui.nextButtonShort = "આગળ";
      practice.ui.tryAgainButton = "ફરીથી પ્રયાસ કરો";
      practice.ui.tryAgainButtonShort = "ફરીથી";
      practice.ui.startOverButton = "શરૂઆતથી કરો";
      practice.ui.completeTitle = "પ્રેક્ટિસ પૂર્ણ! 🎉";
      practice.ui.scoreSummary = "તમે {total} માંથી {score} પોઈન્ટ મેળવ્યા";
      practice.ui.questionsAnswered = "જવાબ આપેલા પ્રશ્નો";
      practice.ui.scorePercentage = "સ્કોર પ્રતિશત";
      practice.ui.gradeLabel = "ગ્રેડ";
      practice.ui.correctTitle = "🎉 સાચું!";
      practice.ui.incorrectTitle = "❌ ખોટું";
      practice.ui.matchHint = "દરેક વસ્તુને તેના સાચા વર્ગ સાથે મેળવો:";
      practice.ui.processes = "પ્રક્રિયાઓ:";
      practice.ui.characteristics = "લક્ષણો:";
      practice.ui.select = "પસંદ કરો...";
      practice.ui.sequenceHint = "ક્રમ ઠીક કરવા માટે તીર બટનનો ઉપયોગ કરો:";
      practice.ui.studyTips = "💡 અભ્યાસ ટિપ્સ:";
      practice.ui.tip1 = "• યાદ રાખો: Convection માં કણોની ગતિ જરૂરી છે (conductionથી વિપરીત)";
      practice.ui.tip2 = "• ગરમ હવા/પાણી ઉપર ઉઠે છે કારણ કે તે ફેલાય છે અને હળવું બને છે";
      practice.ui.tip3 = "• સમુદ્રની હવા = દિવસ (સમુદ્રથી જમીન), જમીનની હવા = રાત્રિ (જમીનથી સમુદ્ર)";
      practice.ui.tip4 = "• Convection માત્ર તરલ પદાર્થો (પ્રવાહી અને વાયુઓ) માં કામ કરે છે, ઘન પદાર્થોમાં નહીં";
    }
  }
  
  // Gujarati: Convection RealWorld
  if (data.gu.convection && data.gu.convection.realWorld) {
    const rw = data.gu.convection.realWorld;
    
    if (rw.header) {
      rw.header.title = "વાસ્તવિક દુનિયાના ઉપયોગો";
      rw.header.subtitle = "રોજિંદા જીવન અને પ્રકૃતિમાં Convection";
      rw.header.topic = "પાઠ 7.2";
    }
    
    if (rw.intro) {
      rw.intro.title = "🌊 Convection આપણી આસપાસ!";
      rw.intro.para1 = "Convection માત્ર પાઠ્યપુસ્તકનો ખ્યાલ નથી - તે દરેક જગ્યાએ, દરેક ક્ષણે થઈ રહ્યું છે!";
      rw.intro.para2 = "કિનારાના શહેરોને ઠંડક આપતી સમુદ્રની હવાથી લઈને તમારી સવારની અગરબત્તીમાંથી ઉઠતા ધુમાડા સુધી,";
      rw.intro.para3 = "તમારી રસોડામાં ઉકળતા પાણીથી લઈને પૃથ્વીની આબોહવાને નિયંત્રિત કરતી વિશાળ સમુદ્રની ધારાઓ સુધી.";
      rw.intro.para4 = "8 રસપ્રદ ઉપયોગોનું અન્વેષણ કરો જ્યાં Convection મહત્વપૂર્ણ ભૂમિકા ભજવે છે,";
      rw.intro.para5 = "રોજિંદા અવલોકનોથી લઈને ગ્રહ-સ્તરની ઘટનાઓ સુધી. શોધો કે ગરમ હવાનું ઉપર ઉઠવું અને";
      rw.intro.para6 = "ઠંડી હવાનું નીચે જવું આપણી દુનિયાને કેવી રીતે આકાર આપે છે!";
    }
    
    if (rw.filter) {
      rw.filter.title = "શ્રેણી દ્વારા ફિલ્ટર કરો:";
      rw.filter.all = "બધા ઉપયોગો";
      rw.filter.showing = "દર્શાવી રહ્યા છીએ";
      rw.filter.application = "ઉપયોગ";
      rw.filter.applications = "ઉપયોગો";
    }
    
    if (rw.categories) {
      rw.categories.all = "બધા ઉપયોગો";
      rw.categories.Nature = "પ્રકૃતિ";
      rw.categories.Home = "ઘર";
      rw.categories.Kitchen = "રસોડું";
      rw.categories.Everyday = "રોજિંદું";
      rw.categories.Technology = "ટેકનોલોજી";
    }
    
    if (rw.difficulty) {
      rw.difficulty.everyday = "રોજિંદું જીવન";
      rw.difficulty.nature = "પ્રાકૃતિક ઘટના";
      rw.difficulty.technology = "ટેકનોલોજી";
    }
    
    if (rw.labels) {
      rw.labels.howItWorks = "તે કેવી રીતે કામ કરે છે:";
      rw.labels.scienceBehind = "🔬 તેની પાછળનું વિજ્ઞાન:";
      rw.labels.realExample = "🌟 વાસ્તવિક જીવનનું ઉદાહરણ:";
      rw.labels.benefits = "✨ લાભ અને અસર:";
    }
  }
}

console.log('Gujarati translations applied!');

// Write back to file
fs.writeFileSync('src/locales/translation.json', JSON.stringify(data, null, 2), 'utf8');
console.log('All translations completed and saved!');

