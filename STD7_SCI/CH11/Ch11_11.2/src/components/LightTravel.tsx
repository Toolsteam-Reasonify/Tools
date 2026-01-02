import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from "react";

// Translation types (merged from locales/a.tsx)
type Language = "en" | "hi" | "gu";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualType: "matchbox" | "pipe" | "concept";
}

interface Application {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
}

interface StepContent {
  title: string;
  description: string;
}

interface CanvasContent {
  title?: string;
  questionMark?: string;
  instruction?: string;
  boxLabel?: string;
  message?: string;
  question?: string;
}

interface Translations {
  nav: {
    logo: string;
    tabs: {
      learn: string;
      practice: string;
      realWorld: string;
    };
  };
  language: {
    en: string;
    hi: string;
    gu: string;
    selectorLabel: string;
  };
  controls: {
    step: string;
    of: string;
    previous: string;
    next: string;
    play: string;
    pause: string;
    reset: string;
  };
  steps: {
    intro: StepContent;
    matchbox_setup: StepContent;
    matchbox_aligned: StepContent;
    matchbox_misaligned: StepContent;
    pipe_intro: StepContent;
    pipe_straight: StepContent;
    pipe_bent: StepContent;
  };
  canvas: {
    intro: CanvasContent;
    matchbox_setup: CanvasContent;
    matchbox_aligned: CanvasContent;
    matchbox_misaligned: CanvasContent;
    pipe_intro: CanvasContent;
    pipe_straight: CanvasContent;
    pipe_bent: CanvasContent;
  };
  practice: {
    title: string;
    subtitle: string;
    question: string;
    score: string;
    selectAnswer: string;
    checkAnswer: string;
    nextQuestion: string;
    correct: string;
    incorrect: string;
    explanation: string;
    complete: string;
    finalScore: string;
    restart: string;
    loading: string;
    scoreMessages: {
      perfect: string;
      great: string;
      good: string;
      keepLearning: string;
    };
    questions: Question[];
  };
  realWorld: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    loading: string;
    example: string;
    applications: Application[];
  };
}

type TranslationsData = {
  [K in Language]: Translations;
};

// Translations data (merged from locales files - all translation content inlined)
const translationsData: TranslationsData = {"en":{"nav":{"logo":"Does Light Travel in a Straight Line?","tabs":{"learn":"Learn","practice":"Practice","realWorld":"Real World"}},"language":{"en":"English","hi":"हिंदी","gu":"ગુજરાતી","selectorLabel":"Select Language"},"controls":{"step":"Step","of":"of","previous":"Previous","next":"Next","play":"Play","pause":"Pause","reset":"Reset"},"steps":{"intro":{"title":"Does Light Travel in a Straight Line?","description":"Let us do an activity to try to find out if light travels in a straight line. We will perform two different experiments to investigate this question."},"matchbox_setup":{"title":"Activity 11.1: Matchbox Experiment Setup","description":"Take three matchboxes and make a hole in the inner tray of each matchbox, exactly at the same position. Arrange these three matchboxes in a straight line."},"matchbox_aligned":{"title":"Aligned Matchboxes - Light Passes Through","description":"Make sure that all three holes are exactly at the same height and are in a line. Place a torch light on one side and a screen on the other side. You can see a bright spot on the screen!"},"matchbox_misaligned":{"title":"Misaligned Matchboxes - Light is Blocked","description":"Move one of the matchboxes slightly to a side or up and down. When all three holes are not in the same line, we cannot obtain the light spot on the screen. This suggests that light travels in a straight line."},"pipe_intro":{"title":"Activity 11.2: Pipe Experiment","description":"Can we check this in some other way? Let us try to see the candle flame through a bent pipe! Take a long hollow pipe of some flexible material."},"pipe_straight":{"title":"Straight Pipe - Candle Visible","description":"Align the pipe so that you can see the candle flame through the straight pipe. Light travels through the pipe and reaches your eyes."},"pipe_bent":{"title":"Bent Pipe - Candle Not Visible","description":"Now, bend the pipe and try to see the candle flame again. Can you still see it? You cannot see the candle flame through a bent pipe. This shows that light travels in a straight line."}},"canvas":{"intro":{"title":"Does Light Travel in a Straight Line?","questionMark":"?"},"matchbox_setup":{"instruction":"Make holes in the same position on each matchbox","boxLabel":"Box"},"matchbox_aligned":{"message":"Aligned holes - Light passes through!"},"matchbox_misaligned":{"message":"Misaligned holes - Light is blocked!"},"pipe_intro":{"question":"Can we see through a pipe?"},"pipe_straight":{"message":"Straight pipe - You can see the flame!"},"pipe_bent":{"message":"Bent pipe - Cannot see the flame!"}},"practice":{"title":"Practice Questions","subtitle":"Test your understanding of how light travels","question":"Question","score":"Score","selectAnswer":"Please select an answer!","checkAnswer":"Check Answer","nextQuestion":"Next Question","correct":"Correct! Well done! 🎉","incorrect":"Not quite right. Let's learn from this!","explanation":"Explanation:","complete":"Quiz Complete!","finalScore":"Your Final Score:","restart":"Restart Quiz","loading":"Loading questions...","scoreMessages":{"perfect":"Perfect score! You're a light expert! 🌟","great":"Great job! You understand the concepts well! 👏","good":"Good effort! Keep practicing! 💪","keepLearning":"Keep learning! Review and try again! 📚"},"questions":[{"id":1,"question":"What happens when you place three matchboxes with holes in a straight line and shine light through them?","options":["Light bends around the holes","Light passes through all holes and creates a spot on the screen","Light stops at the first matchbox","Light spreads in all directions"],"correctAnswer":1,"explanation":"When the holes are aligned in a straight line, light passes through all of them and creates a bright spot on the screen. This proves that light travels in a straight line.","visualType":"matchbox"},{"id":2,"question":"In the matchbox experiment, what happens when one matchbox is moved slightly up or down?","options":["Light still passes through normally","Light becomes brighter","The light spot on the screen disappears","Light changes color"],"correctAnswer":2,"explanation":"When the matchboxes are not aligned, the holes are not in the same straight line. Since light travels in a straight line, it cannot pass through misaligned holes.","visualType":"matchbox"},{"id":3,"question":"Can you see a candle flame through a straight pipe?","options":["No, never","Yes, if the pipe is aligned properly","Only if the pipe is very short","Only if there is a mirror inside"],"correctAnswer":1,"explanation":"You can see the candle flame through a straight pipe when it is properly aligned. Light from the candle travels in a straight line through the pipe.","visualType":"pipe"},{"id":4,"question":"What happens when you try to see a candle flame through a bent pipe?","options":["You can see it more clearly","You cannot see the flame","The flame appears upside down","The flame appears larger"],"correctAnswer":1,"explanation":"You cannot see the candle flame through a bent pipe because light travels in a straight line and cannot follow the curve.","visualType":"pipe"},{"id":5,"question":"Why does light not travel through a bent pipe?","options":["The pipe is too long","Light is absorbed by the pipe material","Light travels in a straight line and cannot follow the curve","There is not enough light"],"correctAnswer":2,"explanation":"Light travels in a straight line and cannot change direction to follow a curved path.","visualType":"concept"},{"id":6,"question":"What do both the matchbox and pipe experiments prove?","options":["Light can bend around corners","Light needs air to travel","Light travels in a straight line","Light travels in circles"],"correctAnswer":2,"explanation":"Both experiments demonstrate that light travels in a straight line.","visualType":"concept"},{"id":7,"question":"If you want to see around a corner, what property of light prevents you from doing so directly?","options":["Light is too slow","Light travels in a straight line","Light is too bright","Light has no color"],"correctAnswer":1,"explanation":"You cannot see directly around a corner because light travels in a straight line.","visualType":"concept"},{"id":8,"question":"In which situation would light NOT be able to pass through?","options":["Three holes arranged in a perfect line","A completely straight tunnel","Three holes where the middle one is offset","A straight glass tube"],"correctAnswer":2,"explanation":"Light cannot pass through when the middle hole is offset because the three holes are not in a straight line.","visualType":"matchbox"}]},"realWorld":{"title":"Real World Applications","subtitle":"Discover how the straight-line property of light is used in everyday life","searchPlaceholder":"Search applications...","allCategories":"All Categories","loading":"Loading applications...","example":"Example:","applications":[{"id":1,"title":"Periscopes in Submarines","description":"Submarines use periscopes to see above water while staying submerged. Periscopes use mirrors to redirect light in straight paths, allowing submariners to see the surface from below.","icon":"🔭","category":"Military & Navigation","example":"Two mirrors at 45° angles reflect light in straight lines to see over obstacles."},{"id":2,"title":"Laser Pointers & Alignment","description":"Laser pointers create perfectly straight reference lines in construction and surveying. Because light travels in a straight line, lasers can accurately mark straight paths over long distances.","icon":"🔦","category":"Construction & Engineering","example":"Construction workers use laser levels to ensure walls are perfectly vertical."},{"id":3,"title":"Fiber Optic Cables","description":"Fiber optic cables use the principle that light travels in straight lines within glass fiber. Light signals travel through long fiber paths to transmit internet data at the speed of light.","icon":"🌐","category":"Communication Technology","example":"Your internet uses fiber optics where light travels through thin glass fibers."},{"id":4,"title":"Flashlights & Spotlights","description":"Flashlights create focused beams of light that travel in straight lines. Reflectors direct the light into a straight beam for illuminating specific areas.","icon":"🔦","category":"Lighting & Safety","example":"Emergency responders use spotlights that send straight beams to search in darkness."},{"id":5,"title":"Cameras & Photography","description":"Cameras work because light travels in straight lines from the subject through the lens to the sensor. The straight-line path creates sharp, clear images.","icon":"📷","category":"Imaging & Art","example":"When you take a photo, light travels in straight lines through the camera lens."},{"id":6,"title":"Solar Cookers","description":"Solar cookers use curved mirrors to redirect sunlight to a single point. Sunlight travels in straight lines, reflects off mirrors, and concentrates at the cooking pot.","icon":"☀️","category":"Sustainable Energy","example":"Solar cookers provide a free, clean way to cook food using focused sunlight."},{"id":7,"title":"Shadows & Sundials","description":"Shadows form because light travels in straight lines and cannot bend around opaque objects. Ancient sundials used this to tell time by tracking shadows.","icon":"🌤️","category":"Astronomy & Time","example":"Sundials have been used for thousands of years using shadow positions."},{"id":8,"title":"Traffic Signals","description":"Traffic lights are positioned so drivers have a clear straight-line view. Traffic engineers use the straight-line property to ensure signals are visible from safe distances.","icon":"🚦","category":"Transportation & Safety","example":"Traffic lights are placed high at intersections for clear straight-path visibility."},{"id":9,"title":"Optical Instruments","description":"Microscopes, telescopes, and binoculars rely on light traveling in straight lines through lenses and mirrors to magnify distant or tiny objects.","icon":"🔬","category":"Science & Research","example":"Astronomers use telescopes that collect light traveling from distant stars."},{"id":10,"title":"Barcode Scanners","description":"Barcode scanners use laser light that travels in straight lines to read patterns on products. The straight beam reflects differently from light and dark bars.","icon":"🏪","category":"Retail & Commerce","example":"Checkout scanners send straight beams across barcodes to read product codes."},{"id":11,"title":"Medical Endoscopes","description":"Doctors use endoscopes to see inside the body. These instruments use fiber optic cables that guide light in straight paths through flexible tubes.","icon":"🏥","category":"Medical Technology","example":"Doctors examine internal organs using light through thin tubes."},{"id":12,"title":"Stage Lighting","description":"Theater spotlights create dramatic effects by directing bright beams in straight lines onto performers. Lighting designers use predictable straight-path behavior.","icon":"🎭","category":"Entertainment & Arts","example":"Follow-spots track performers with straight beams creating dramatic effects."}]}},"hi":{"nav":{"logo":"क्या प्रकाश सीधी रेखा में यात्रा करता है?","tabs":{"learn":"सीखें","practice":"अभ्यास","realWorld":"वास्तविक दुनिया"}},"language":{"en":"English","hi":"हिंदी","gu":"ગુજરાતી","selectorLabel":"भाषा चुनें"},"controls":{"step":"चरण","of":"का","previous":"पिछला","next":"अगला","play":"चलाएं","pause":"रोकें","reset":"रीसेट"},"steps":{"intro":{"title":"क्या प्रकाश सीधी रेखा में यात्रा करता है?","description":"आइए यह पता लगाने के लिए एक गतिविधि करें कि क्या प्रकाश सीधी रेखा में यात्रा करता है। हम इस प्रश्न की जांच करने के लिए दो अलग-अलग प्रयोग करेंगे।"},"matchbox_setup":{"title":"गतिविधि 11.1: माचिस के डिब्बे का प्रयोग सेटअप","description":"तीन माचिस के डिब्बे लें और प्रत्येक माचिस के डिब्बे की भीतरी ट्रे में एक ही स्थान पर एक छेद करें। इन तीन माचिस के डिब्बों को एक सीधी रेखा में व्यवस्थित करें।"},"matchbox_aligned":{"title":"संरेखित माचिस के डिब्बे - प्रकाश गुजरता है","description":"सुनिश्चित करें कि सभी तीन छेद बिल्कुल एक ही ऊंचाई पर हैं और एक रेखा में हैं। एक तरफ टॉर्च की रोशनी और दूसरी तरफ स्क्रीन रखें। आप स्क्रीन पर एक चमकीला स्थान देख सकते हैं!"},"matchbox_misaligned":{"title":"गलत संरेखित माचिस के डिब्बे - प्रकाश अवरुद्ध है","description":"माचिस के डिब्बों में से एक को थोड़ा बगल में या ऊपर और नीचे ले जाएं। जब सभी तीन छेद एक ही रेखा में नहीं होते हैं, तो हम स्क्रीन पर प्रकाश स्थान प्राप्त नहीं कर सकते। यह सुझाव देता है कि प्रकाश सीधी रेखा में यात्रा करता है।"},"pipe_intro":{"title":"गतिविधि 11.2: पाइप प्रयोग","description":"क्या हम किसी अन्य तरीके से इसकी जांच कर सकते हैं? आइए एक मुड़े हुए पाइप के माध्यम से मोमबत्ती की लौ को देखने की कोशिश करें! कुछ लचीली सामग्री का एक लंबा खोखला पाइप लें।"},"pipe_straight":{"title":"सीधा पाइप - मोमबत्ती दिखाई देती है","description":"पाइप को संरेखित करें ताकि आप सीधे पाइप के माध्यम से मोमबत्ती की लौ देख सकें। प्रकाश पाइप के माध्यम से यात्रा करता है और आपकी आंखों तक पहुंचता है।"},"pipe_bent":{"title":"मुड़ा हुआ पाइप - मोमबत्ती दिखाई नहीं देती","description":"अब, पाइप को मोड़ें और फिर से मोमबत्ती की लौ देखने की कोशिश करें। क्या आप अभी भी इसे देख सकते हैं? आप मुड़े हुए पाइप के माध्यम से मोमबत्ती की लौ नहीं देख सकते। यह दर्शाता है कि प्रकाश सीधी रेखा में यात्रा करता है।"}},"canvas":{"intro":{"title":"क्या प्रकाश सीधी रेखा में यात्रा करता है?","questionMark":"?"},"matchbox_setup":{"instruction":"प्रत्येक माचिस के डिब्बे में एक ही स्थान पर छेद करें","boxLabel":"डिब्बा"},"matchbox_aligned":{"message":"संरेखित छेद - प्रकाश गुजरता है!"},"matchbox_misaligned":{"message":"गलत संरेखित छेद - प्रकाश अवरुद्ध है!"},"pipe_intro":{"question":"क्या हम पाइप के माध्यम से देख सकते हैं?"},"pipe_straight":{"message":"सीधा पाइप - आप लौ देख सकते हैं!"},"pipe_bent":{"message":"मुड़ा हुआ पाइप - लौ नहीं देख सकते!"}},"practice":{"title":"अभ्यास प्रश्न","subtitle":"प्रकाश कैसे यात्रा करता है, इसकी अपनी समझ का परीक्षण करें","question":"प्रश्न","score":"स्कोर","selectAnswer":"कृपया एक उत्तर चुनें!","checkAnswer":"उत्तर जांचें","nextQuestion":"अगला प्रश्न","correct":"सही! बहुत बढ़िया! 🎉","incorrect":"बिल्कुल सही नहीं। आइए इससे सीखें!","explanation":"व्याख्या:","complete":"प्रश्नोत्तरी पूर्ण!","finalScore":"आपका अंतिम स्कोर:","restart":"पुनः आरंभ करें","loading":"प्रश्न लोड हो रहे हैं...","scoreMessages":{"perfect":"पूर्ण स्कोर! आप प्रकाश के विशेषज्ञ हैं! 🌟","great":"बहुत बढ़िया! आप अवधारणाओं को अच्छी तरह समझते हैं! 👏","good":"अच्छा प्रयास! अभ्यास जारी रखें! 💪","keepLearning":"सीखना जारी रखें! समीक्षा करें और फिर से कोशिश करें! 📚"},"questions":[{"id":1,"question":"जब आप तीन माचिस की डिब्बियों को छेद के साथ सीधी रेखा में रखते हैं और उनके माध्यम से प्रकाश चमकाते हैं तो क्या होता है?","options":["प्रकाश छेद के चारों ओर मुड़ता है","प्रकाश सभी छेदों से गुजरता है और स्क्रीन पर एक स्थान बनाता है","प्रकाश पहले माचिस के डिब्बे पर रुक जाता है","प्रकाश सभी दिशाओं में फैलता है"],"correctAnswer":1,"explanation":"जब छेद एक सीधी रेखा में संरेखित होते हैं, तो प्रकाश उन सभी से गुजरता है और स्क्रीन पर एक चमकीला स्थान बनाता है। यह साबित करता है कि प्रकाश सीधी रेखा में यात्रा करता है।","visualType":"matchbox"},{"id":2,"question":"माचिस के डिब्बे के प्रयोग में, जब एक माचिस के डिब्बे को थोड़ा ऊपर या नीचे ले जाया जाता है तो क्या होता है?","options":["प्रकाश अभी भी सामान्य रूप से गुजरता है","प्रकाश अधिक चमकीला हो जाता है","स्क्रीन पर प्रकाश स्थान गायब हो जाता है","प्रकाश रंग बदलता है"],"correctAnswer":2,"explanation":"जब माचिस के डिब्बे संरेखित नहीं होते हैं, तो छेद एक ही सीधी रेखा में नहीं होते हैं। चूंकि प्रकाश सीधी रेखा में यात्रा करता है, यह गलत संरेखित छेदों से नहीं गुजर सकता।","visualType":"matchbox"},{"id":3,"question":"क्या आप सीधे पाइप के माध्यम से मोमबत्ती की लौ देख सकते हैं?","options":["नहीं, कभी नहीं","हाँ, अगर पाइप ठीक से संरेखित है","केवल अगर पाइप बहुत छोटा है","केवल अगर अंदर एक दर्पण है"],"correctAnswer":1,"explanation":"जब पाइप ठीक से संरेखित होता है तो आप सीधे पाइप के माध्यम से मोमबत्ती की लौ देख सकते हैं। मोमबत्ती से प्रकाश सीधी रेखा में पाइप के माध्यम से यात्रा करता है।","visualType":"pipe"},{"id":4,"question":"जब आप मुड़े हुए पाइप के माध्यम से मोमबत्ती की लौ देखने की कोशिश करते हैं तो क्या होता है?","options":["आप इसे अधिक स्पष्ट रूप से देख सकते हैं","आप लौ नहीं देख सकते","लौ उल्टा दिखाई देती है","लौ बड़ा दिखाई देता है"],"correctAnswer":1,"explanation":"आप मुड़े हुए पाइप के माध्यम से मोमबत्ती की लौ नहीं देख सकते क्योंकि प्रकाश सीधी रेखा में यात्रा करता है और वक्र का पालन नहीं कर सकता।","visualType":"pipe"},{"id":5,"question":"प्रकाश मुड़े हुए पाइप के माध्यम से क्यों नहीं जाता है?","options":["पाइप बहुत लंबा है","प्रकाश पाइप सामग्री द्वारा अवशोषित होता है","प्रकाश सीधी रेखा में यात्रा करता है और वक्र का पालन नहीं कर सकता","पर्याप्त प्रकाश नहीं है"],"correctAnswer":2,"explanation":"प्रकाश सीधी रेखा में यात्रा करता है और वक्र पथ का पालन करने के लिए दिशा नहीं बदल सकता।","visualType":"concept"},{"id":6,"question":"माचिस के डिब्बे और पाइप दोनों प्रयोग क्या साबित करते हैं?","options":["प्रकाश कोनों के चारों ओर मुड़ सकता है","प्रकाश को यात्रा करने के लिए हवा की आवश्यकता होती है","प्रकाश सीधी रेखा में यात्रा करता है","प्रकाश वृत्त में यात्रा करता है"],"correctAnswer":2,"explanation":"दोनों प्रयोग यह प्रदर्शित करते हैं कि प्रकाश सीधी रेखा में यात्रा करता है।","visualType":"concept"},{"id":7,"question":"यदि आप कोने के चारों ओर देखना चाहते हैं, तो प्रकाश की कौन सी संपत्ति आपको रोकती है?","options":["प्रकाश बहुत धीमा है","प्रकाश सीधी रेखा में यात्रा करता है","प्रकाश बहुत उज्ज्वल है","प्रकाश का कोई रंग नहीं है"],"correctAnswer":1,"explanation":"आप सीधे कोने के चारों ओर नहीं देख सकते क्योंकि प्रकाश सीधी रेखा में यात्रा करता है।","visualType":"concept"},{"id":8,"question":"किस स्थिति में प्रकाश गुजरने में सक्षम नहीं होगा?","options":["एक पूर्ण रेखा में व्यवस्थित तीन छेद","एक पूरी तरह से सीधी सुरंग","तीन छेद जहाँ बीच वाला ऑफसेट है","एक सीधी कांच की नली"],"correctAnswer":2,"explanation":"जब बीच का छेद ऑफसेट होता है तो प्रकाश पास नहीं हो सकता क्योंकि तीन छेद एक सीधी रेखा में नहीं हैं।","visualType":"matchbox"}]},"realWorld":{"title":"वास्तविक दुनिया के अनुप्रयोग","subtitle":"जानें कि रोजमर्रा की जिंदगी में प्रकाश की सीधी-रेखा संपत्ति का उपयोग कैसे किया जाता है","searchPlaceholder":"अनुप्रयोग खोजें...","allCategories":"सभी श्रेणियां","loading":"अनुप्रयोग लोड हो रहे हैं...","example":"उदाहरण:","applications":[{"id":1,"title":"पनडुब्बियों में पेरिस्कोप","description":"पनडुब्बियां पानी के नीचे रहते हुए पानी के ऊपर देखने के लिए पेरिस्कोप का उपयोग करती हैं। पेरिस्कोप सीधे पथों में प्रकाश को पुनर्निर्देशित करने के लिए दर्पणों का उपयोग करते हैं।","icon":"🔭","category":"सैन्य और नेविगेशन","example":"45° कोण पर दो दर्पण प्रकाश को प्रतिबिंबित करते हैं।"},{"id":2,"title":"लेजर पॉइंटर","description":"निर्माण में पूरी तरह से सीधी संदर्भ रेखाएं बनाने के लिए उपयोग किया जाता है।","icon":"🔦","category":"निर्माण और इंजीनियरिंग","example":"निर्माण कार्यकर्ता लेजर स्तरों का उपयोग करते हैं।"},{"id":3,"title":"फाइबर ऑप्टिक केबल","description":"इंटरनेट डेटा संचारित करने के लिए प्रकाश का उपयोग करते हैं।","icon":"🌐","category":"संचार प्रौद्योगिकी","example":"आपका इंटरनेट फाइबर ऑप्टिक्स का उपयोग करता है।"},{"id":4,"title":"टॉर्च और स्पॉटलाइट","description":"केंद्रित प्रकाश बीम बनाते हैं।","icon":"🔦","category":"प्रकाश और सुरक्षा","example":"आपातकालीन उत्तरदाता स्पॉटलाइट का उपयोग करते हैं।"},{"id":5,"title":"कैमरा और फोटोग्राफी","description":"सीधी रेखाओं में प्रकाश यात्रा के कारण काम करते हैं।","icon":"📷","category":"इमेजिंग और कला","example":"फोटो लेते समय प्रकाश सीधी रेखाओं में यात्रा करता है।"},{"id":6,"title":"सौर कुकर","description":"सूर्य के प्रकाश को केंद्रित करने के लिए दर्पणों का उपयोग करते हैं।","icon":"☀️","category":"सतत ऊर्जा","example":"सौर कुकर भोजन पकाने का स्वच्छ तरीका प्रदान करते हैं।"},{"id":7,"title":"छाया और धूपघड़ी","description":"प्रकाश की सीधी रेखा गति के कारण छाया बनती है।","icon":"🌤️","category":"खगोल विज्ञान","example":"धूपघड़ी का उपयोग हजारों वर्षों से किया जाता है।"},{"id":8,"title":"यातायात संकेत","description":"स्पष्ट दृश्य के लिए रखे गए हैं।","icon":"🚦","category":"परिवहन","example":"यातायात लाइट चौराहों पर ऊंची रखी जाती हैं।"},{"id":9,"title":"ऑप्टिकल उपकरण","description":"माइक्रोस्कोप और टेलीस्कोप।","icon":"🔬","category":"विज्ञान","example":"खगोलविद टेलीस्कोप का उपयोग करते हैं।"},{"id":10,"title":"बारकोड स्कैनर","description":"उत्पाद कोड पढ़ने के लिए लेजर का उपयोग करते हैं।","icon":"🏪","category":"खुदरा","example":"स्कैनर बारकोड पर सीधी बीम भेजते हैं।"},{"id":11,"title":"चिकित्सा एंडोस्कोप","description":"शरीर के अंदर देखने के लिए।","icon":"🏥","category":"चिकित्सा","example":"डॉक्टर पतली ट्यूबों के माध्यम से प्रकाश का उपयोग करते हैं।"},{"id":12,"title":"मंच प्रकाश","description":"नाटकीय प्रभाव बनाते हैं।","icon":"🎭","category":"मनोरंजन","example":"थिएटर में स्पॉटलाइट कलाकारों को ट्रैक करते हैं।"}]}},"gu":{"nav":{"logo":"શું પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે?","tabs":{"learn":"શીખો","practice":"અભ્યાસ","realWorld":"વાસ્તવિક દુનિયા"}},"language":{"en":"English","hi":"हिंदी","gu":"ગુજરાતી","selectorLabel":"ભાષા પસંદ કરો"},"controls":{"step":"પગલું","of":"નું","previous":"અગાઉ","next":"આગળ","play":"ચલાવો","pause":"થોભાવો","reset":"રીસેટ"},"steps":{"intro":{"title":"શું પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે?","description":"ચાલો આ શોધવા માટે એક પ્રવૃત્તિ કરીએ કે શું પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે. આ પ્રશ્નની તપાસ કરવા માટે આપણે બે અલગ અલગ પ્રયોગો કરીશું।"},"matchbox_setup":{"title":"પ્રવૃત્તિ 11.1: માચીસની પેટીનો પ્રયોગ સેટઅપ","description":"ત્રણ માચીસની પેટીઓ લો અને દરેક માચીસની પેટીની અંદરની ટ્રેમાં બરાબર એક જ સ્થાને એક છિદ્ર બનાવો. આ ત્રણ માચીસની પેટીઓને સીધી રેખામાં ગોઠવો।"},"matchbox_aligned":{"title":"સંરેખિત માચીસની પેટીઓ - પ્રકાશ પસાર થાય છે","description":"ખાતરી કરો કે ત્રણેય છિદ્રો બરાબર એક જ ઊંચાઈએ છે અને એક રેખામાં છે। એક બાજુએ ટોર્ચ લાઇટ અને બીજી બાજુએ સ્ક્રીન મૂકો। તમે સ્ક્રીન પર તેજસ્વી સ્થળ જોઈ શકો છો!"},"matchbox_misaligned":{"title":"ખોટી સંરેખિત માચીસની પેટીઓ - પ્રકાશ અવરોધાયો છે","description":"માચીસની પેટીઓમાંથી એકને થોડી બાજુમાં અથવા ઉપર અને નીચે ખસેડો। જ્યારે ત્રણેય છિદ્રો એક જ રેખામાં નથી, ત્યારે આપણે સ્ક્રીન પર પ્રકાશ સ્થાન મેળવી શકતા નથી। આ સૂચવે છે કે પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે।"},"pipe_intro":{"title":"પ્રવૃત્તિ 11.2: પાઈપ પ્રયોગ","description":"શું આપણે કોઈ બીજી રીતે આની તપાસ કરી શકીએ? ચાલો વળેલી પાઈપ દ્વારા મીણબત્તીની જ્યોત જોવાનો પ્રયાસ કરીએ! કેટલીક લવચીક સામગ્રીની લાંબી ખોખલી પાઈપ લો।"},"pipe_straight":{"title":"સીધી પાઈપ - મીણબત્તી દેખાય છે","description":"પાઈપને સંરેખિત કરો જેથી તમે સીધી પાઈપ દ્વારા મીણબત્તીની જ્યોત જોઈ શકો। પ્રકાશ પાઈપ દ્વારા મુસાફરી કરે છે અને તમારી આંખો સુધી પહોંચે છે।"},"pipe_bent":{"title":"વળેલી પાઈપ - મીણબત્તી દેખાતી નથી","description":"હવે, પાઈપને વાળો અને ફરીથી મીણબત્તીની જ્યોત જોવાનો પ્રયાસ કરો। શું તમે હજુ પણ તેને જોઈ શકો છો? તમે વળેલી પાઈપ દ્વારા મીણબત્તીની જ્યોત જોઈ શકતા નથી. આ દર્શાવે છે કે પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે।"}},"canvas":{"intro":{"title":"શું પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે?","questionMark":"?"},"matchbox_setup":{"instruction":"દરેક માચીસની પેટીમાં એક જ સ્થાને છિદ્ર બનાવો","boxLabel":"પેટી"},"matchbox_aligned":{"message":"સંરેખિત છિદ્રો - પ્રકાશ પસાર થાય છે!"},"matchbox_misaligned":{"message":"ખોટી સંરેખિત છિદ્રો - પ્રકાશ અવરોધાયો છે!"},"pipe_intro":{"question":"શું આપણે પાઈપ દ્વારા જોઈ શકીએ છીએ?"},"pipe_straight":{"message":"સીધી પાઈપ - તમે જ્યોત જોઈ શકો છો!"},"pipe_bent":{"message":"વળેલી પાઈપ - જ્યોત જોઈ શકતા નથી!"}},"practice":{"title":"અભ્યાસ પ્રશ્નો","subtitle":"પ્રકાશ કેવી રીતે મુસાફરી કરે છે તેની સમજણ ચકાસો","question":"પ્રશ્ન","score":"સ્કોર","selectAnswer":"કૃપા કરીને જવાબ પસંદ કરો!","checkAnswer":"જવાબ તપાસો","nextQuestion":"આગળનો પ્રશ્ન","correct":"સાચું! સારું કર્યું! 🎉","incorrect":"બરાબર સાચું નથી। આપણે આનાથી શીખીએ!","explanation":"સમજૂતી:","complete":"ક્વિઝ પૂર્ણ!","finalScore":"તમારો અંતિમ સ્કોર:","restart":"ફરી શરૂ કરો","loading":"પ્રશ્નો લોડ થઈ રહ્યા છે...","scoreMessages":{"perfect":"પરફેક્ટ સ્કોર! તમે પ્રકાશના નિષ્ણાત છો! 🌟","great":"સારું કામ! તમે ખ્યાલોને સારી રીતે સમજો છો! 👏","good":"સારો પ્રયાસ! અભ્યાસ ચાલુ રાખો! 💪","keepLearning":"શીખવાનું ચાલુ રાખો! સમીક્ષા કરો અને ફરીથી પ્રયાસ કરો! 📚"},"questions":[{"id":1,"question":"જ્યારે તમે ત્રણ માચીસની પેટીઓને સીધી રેખામાં મૂકો અને પ્રકાશ ચમકાવો ત્યારે શું થાય?","options":["પ્રકાશ છિદ્રોની આસપાસ વળે છે","પ્રકાશ બધા છિદ્રોમાંથી પસાર થાય છે","પ્રકાશ પ્રથમ પેટી પર અટકે છે","પ્રકાશ બધી દિશાઓમાં ફેલાય છે"],"correctAnswer":1,"explanation":"જ્યારે છિદ્રો સીધી રેખામાં હોય, પ્રકાશ પસાર થાય છે।","visualType":"matchbox"},{"id":2,"question":"જ્યારે એક પેટી ખસેડવામાં આવે ત્યારે શું થાય?","options":["પ્રકાશ હજુ પણ પસાર થાય છે","પ્રકાશ વધુ તેજસ્વી બને છે","સ્ક્રીન પર પ્રકાશ અદૃશ્ય થઈ જાય છે","પ્રકાશ રંગ બદલે છે"],"correctAnswer":2,"explanation":"જ્યારે છિદ્રો સંરેખિત ન હોય, પ્રકાશ પસાર થતો નથી।","visualType":"matchbox"},{"id":3,"question":"શું તમે સીધી પાઈપ દ્વારા મીણબત્તી જોઈ શકો?","options":["ના, ક્યારેય નહીં","હા, જો પાઈપ સંરેખિત હોય","ફક્ત જો પાઈપ ટૂંકી હોય","ફક્ત જો અરીસો હોય"],"correctAnswer":1,"explanation":"સીધી પાઈપ દ્વારા મીણબત્તી જોઈ શકો છો।","visualType":"pipe"},{"id":4,"question":"વળેલી પાઈપ દ્વારા શું થાય?","options":["વધુ સ્પષ્ટપણે જોઈ શકો","જ્યોત જોઈ શકતા નથી","જ્યોત ઊલટી દેખાય","જ્યોત મોટી દેખાય"],"correctAnswer":1,"explanation":"વળેલી પાઈપ દ્વારા જોઈ શકતા નથી।","visualType":"pipe"},{"id":5,"question":"પ્રકાશ વળેલી પાઈપ દ્વારા શા માટે મુસાફરી કરતો નથી?","options":["પાઈપ લાંબી છે","પ્રકાશ શોષાય છે","પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે","પૂરતો પ્રકાશ નથી"],"correctAnswer":2,"explanation":"પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે।","visualType":"concept"},{"id":6,"question":"બંને પ્રયોગો શું સાબિત કરે છે?","options":["પ્રકાશ ખૂણાની આસપાસ વળી શકે છે","પ્રકાશને હવાની જરૂર છે","પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે","પ્રકાશ વર્તુળોમાં મુસાફરી કરે છે"],"correctAnswer":2,"explanation":"બંને પ્રયોગો દર્શાવે છે કે પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે।","visualType":"concept"},{"id":7,"question":"ખૂણાની આસપાસ જોવા માટે કઈ ગુણધર્મ અટકાવે છે?","options":["પ્રકાશ ધીમો છે","પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે","પ્રકાશ તેજસ્વી છે","પ્રકાશનો રંગ નથી"],"correctAnswer":1,"explanation":"પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે।","visualType":"concept"},{"id":8,"question":"કઈ પરિસ્થિતિમાં પ્રકાશ પસાર થઈ શકશે નહીં?","options":["સીધી રેખામાં ત્રણ છિદ્રો","સંપૂર્ણ સીધી ટનલ","ત્રણ છિદ્રો જ્યાં મધ્યમ ઓફસેટ છે","સીધી કાચની નળી"],"correctAnswer":2,"explanation":"મધ્યમ છિદ્ર ઓફસેટ હોય ત્યારે પ્રકાશ પસાર થઈ શકતો નથી।","visualType":"matchbox"}]},"realWorld":{"title":"વાસ્તવિક દુનિયા એપ્લિકેશન્સ","subtitle":"રોજિંદા જીવનમાં પ્રકાશની સીધી-રેખા ગુણધર્મનો ઉપયોગ જાણો","searchPlaceholder":"એપ્લિકેશન્સ શોધો...","allCategories":"બધી શ્રેણીઓ","loading":"એપ્લિકેશન્સ લોડ થઈ રહ્યા છે...","example":"ઉદાહરણ:","applications":[{"id":1,"title":"સબમરીનમાં પેરિસ્કોપ","description":"સબમરીન પાણીની નીચે રહીને જોવા માટે પેરિસ્કોપનો ઉપયોગ કરે છે।","icon":"🔭","category":"લશ્કરી","example":"બે અરીસાઓ પ્રકાશને પ્રતિબિંબિત કરે છે।"},{"id":2,"title":"લેસર પોઇન્ટર","description":"બાંધકામમાં સીધી રેખાઓ બનાવવા માટે વપરાય છે।","icon":"🔦","category":"બાંધકામ","example":"બાંધકામ કામદારો લેસરનો ઉપયોગ કરે છે।"},{"id":3,"title":"ફાઇબર ઓપ્ટિક કેબલ્સ","description":"ઇન્ટરનેટ ડેટા માટે પ્રકાશનો ઉપયોગ કરે છે।","icon":"🌐","category":"સંચાર","example":"તમારું ઇન્ટરનેટ ફાઇબર ઓપ્ટિક્સનો ઉપયોગ કરે છે।"},{"id":4,"title":"ટોર્ચ અને સ્પોટલાઇટ્સ","description":"કેન્દ્રિત બીમ બનાવે છે।","icon":"🔦","category":"પ્રકાશ","example":"કટોકટી સ્પોટલાઇટ્સનો ઉપયોગ કરે છે।"},{"id":5,"title":"કેમેરા અને ફોટોગ્રાફી","description":"સીધી રેખાઓમાં પ્રકાશનો ઉપયોગ કરે છે।","icon":"📷","category":"કલા","example":"ફોટો લેતી વખતે પ્રકાશ સીધી રેખાઓમાં મુસાફરી કરે છે।"},{"id":6,"title":"સોલર કૂકર","description":"સૂર્યપ્રકાશને કેન્દ્રિત કરે છે।","icon":"☀️","category":"ઊર્જા","example":"સોલર કૂકર સ્વચ્છ રીત પ્રદાન કરે છે।"},{"id":7,"title":"પડછાયા અને સૂર્યઘડિયાળ","description":"પ્રકાશની સીધી રેખા ગતિને કારણે પડછાયા રચાય છે।","icon":"🌤️","category":"ખગોળશાસ્ત્ર","example":"સૂર્યઘડિયાળનો ઉપયોગ હજારો વર્ષોથી થાય છે।"},{"id":8,"title":"ટ્રાફિક સિગ્નલ્સ","description":"સ્પષ્ટ દૃશ્ય માટે સ્થિત છે।","icon":"🚦","category":"પરિવહન","example":"ટ્રાફિક લાઇટ્સ ઊંચી મૂકવામાં આવે છે।"},{"id":9,"title":"ઓપ્ટિકલ સાધનો","description":"માઇક્રોસ્કોપ અને ટેલિસ્કોપ।","icon":"🔬","category":"વિજ્ઞાન","example":"ખગોળશાસ્ત્રીઓ ટેલિસ્કોપનો ઉપયોગ કરે છે।"},{"id":10,"title":"બારકોડ સ્કેનર્સ","description":"ઉત્પાદન કોડ વાંચવા માટે લેસરનો ઉપયોગ કરે છે।","icon":"🏪","category":"રિટેલ","example":"સ્કેનર બારકોડ પર સીધો બીમ મોકલે છે।"},{"id":11,"title":"તબીબી એન્ડોસ્કોપ","description":"શરીરની અંદર જોવા માટે।","icon":"🏥","category":"તબીબી","example":"ડોક્ટર પાતળી નળી દ્વારા પ્રકાશનો ઉપયોગ કરે છે।"},{"id":12,"title":"સ્ટેજ લાઇટિંગ","description":"નાટકીય અસરો બનાવે છે।","icon":"🎭","category":"મનોરંજન","example":"થિયેટરમાં સ્પોટલાઇટ્સ કલાકારોને ટ્રેક કરે છે।"}]}}};

// Simple icon components
const Play = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Pause = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const RotateCcw = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const Lightbulb = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 18h6M10 22h4M15 8a5 5 0 1 0-6 0c0 2 1 3 1 5h4c0-2 1-3 1-5z" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
  </svg>
);

const BookOpen = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClipboardCheck = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
  </svg>
);

const Globe = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

type TabType = "learn" | "practice" | "realWorld";

interface Step {
  id: number;
  title: string;
  description: string;
  activity: "matchbox" | "pipe" | "conclusion";
}

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualType?: "matchbox" | "pipe" | "concept";
}

interface RealWorldApp {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
}


// Translation type definition
type TranslationValue = string | string[] | number | { [key: string]: TranslationValue } | Array<{ [key: string]: TranslationValue }>;


// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tValue: (key: string) => TranslationValue;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lightTravelLang", lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem("lightTravelLang") as Language;
    if (saved && ["en", "hi", "gu"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translationsData[language];
    for (const k of keys) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        value = (value as Record<string, any>)[k];
        if (value === undefined) {
          return key;
        }
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  const tValue = (key: string): TranslationValue => {
    const keys = key.split(".");
    let value: any = translationsData[language];
    for (const k of keys) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        value = (value as Record<string, any>)[k];
        if (value === undefined) {
          return key;
        }
      } else {
        return key;
      }
    }
    return value !== undefined ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t, tValue }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// Language Selector
const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: t("language.en"), flag: "🇬🇧" },
    { code: "hi", name: t("language.hi"), flag: "🇮🇳" },
    { code: "gu", name: t("language.gu"), flag: "🇮🇳" },
  ];

  return (
    <div className="relative">
      <select
        aria-label={t("language.selectorLabel")}
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-blue-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 w-40 sm:w-48 md:w-56 text-xs sm:text-sm md:text-base text-blue-700 font-medium cursor-pointer hover:border-teal-500 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2">
        <svg
          className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-blue-500 transition-transform duration-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// Default steps data
const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    title: "Introduction",
    description: "",
    activity: "matchbox",
  },
  {
    id: 2,
    title: "Matchbox Setup",
    description: "",
    activity: "matchbox",
  },
  {
    id: 3,
    title: "Aligned Matchboxes",
    description: "",
    activity: "matchbox",
  },
  {
    id: 4,
    title: "Misaligned Matchboxes",
    description: "",
    activity: "matchbox",
  },
  {
    id: 5,
    title: "Pipe Introduction",
    description: "",
    activity: "pipe",
  },
  {
    id: 6,
    title: "Straight Pipe",
    description: "",
    activity: "pipe",
  },
  {
    id: 7,
    title: "Bent Pipe",
    description: "",
    activity: "pipe",
  },
];

interface LightTravelProps {
  width?: number;
  height?: number;
}

export const LightTravelStraightLine: React.FC<LightTravelProps> = ({
  width = 800,
  height = 600,
}) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const steps = DEFAULT_STEPS;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 500);
      } else {
        setIsPlaying(false);
      }
    }, 12000); // Increased from 7000ms to 12000ms (12 seconds per step)
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  // Animation loop - reduced speed by half (0.02 -> 0.01)
  useEffect(() => {
    const animate = () => {
      setAnimationProgress((prev) => (prev + 0.01) % 1); // Slower animation
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const stepKey = getStepKey(currentStepIndex);
    drawVisualization(ctx, width, height, stepKey, animationProgress, t);
  }, [currentStepIndex, animationProgress, width, height, t]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 500); // Increased from 300ms to 500ms
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 500); // Increased from 300ms to 500ms
    }
  };

  const resetMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStepIndex(0);
      setIsTransitioning(false);
    }, 500); // Increased from 300ms to 500ms
  };

  const getStepKey = (index: number): string => {
    const keys = [
      "intro",
      "matchbox_setup",
      "matchbox_aligned",
      "matchbox_misaligned",
      "pipe_intro",
      "pipe_straight",
      "pipe_bent",
    ];
    return keys[index] || "intro";
  };

  const stepKey = getStepKey(currentStepIndex);
  const title = t(`steps.${stepKey}.title`);
  const description = t(`steps.${stepKey}.description`);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50">
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-6 transform transition-all duration-700 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-4 sm:p-6 animate-gradient-x">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className={`text-xl sm:text-2xl font-semibold transition-all duration-700 ${isTransitioning ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                {title}
              </h2>
              <div className="text-sm bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm transition-all duration-500 hover:bg-white/30 hover:scale-105">
                {t("controls.step")} {currentStepIndex + 1} {t("controls.of")}{" "}
                {steps.length}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className={`bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6 mb-6 transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="w-full border-2 border-blue-300 rounded-lg transition-all duration-500"
              />
            </div>

            <div className={`bg-gradient-to-r from-blue-50 via-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 mb-6 border-l-4 border-blue-500 transition-all duration-700 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all duration-500 hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-500 group-hover:-translate-x-1" />
                {t("controls.previous")}
              </button>

              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-500 hover:scale-105 active:scale-95 flex-1 sm:flex-none"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 animate-pulse" />
                      {t("controls.pause")}
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {t("controls.play")}
                    </>
                  )}
                </button>

                <button
                  onClick={resetMode}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-500 hover:scale-105 active:scale-95 flex-1 sm:flex-none"
                >
                  <RotateCcw className="w-5 h-5 transition-transform duration-500 hover:rotate-180" />
                  {t("controls.reset")}
                </button>
              </div>

              <button
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-500 hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                {t("controls.next")}
                <ChevronRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 transition-all duration-1000 ease-out rounded-full animate-pulse-slow"
                  style={{
                    width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite; /* Increased from 3s to 6s */
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite; /* Increased from 2s to 4s */
        }
      `}</style>
    </div>
  );
};

// Drawing function for visualizations
function drawVisualization(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stage: string,
  progress: number,
  t: (key: string) => string
) {
  // Dark background
  const bgGradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width / 2
  );
  bgGradient.addColorStop(0, "#1e293b");
  bgGradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  if (stage === "intro") {
    drawIntro(ctx, width, height, progress, t);
  } else if (stage === "matchbox_setup") {
    drawMatchboxSetup(ctx, width, height, progress, t);
  } else if (stage === "matchbox_aligned") {
    drawMatchboxAligned(ctx, width, height, progress, t);
  } else if (stage === "matchbox_misaligned") {
    drawMatchboxMisaligned(ctx, width, height, progress, t);
  } else if (stage === "pipe_intro") {
    drawPipeIntro(ctx, width, height, progress, t);
  } else if (stage === "pipe_straight") {
    drawPipeStraight(ctx, width, height, progress, t);
  } else if (stage === "pipe_bent") {
    drawPipeBent(ctx, width, height, progress, t);
  }
}

function drawIntro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Question mark
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 120px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(96, 165, 250, 0.5)";
  ctx.shadowBlur = 20;
  ctx.fillText(t("canvas.intro.questionMark"), centerX, centerY);
  ctx.shadowBlur = 0;

  // Animated light rays
  const numRays = 8;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * (360 / numRays) + progress * 180) * (Math.PI / 180);
    const rayLength = 100 + Math.sin(progress * Math.PI * 1 + i) * 20; // Slower oscillation

    ctx.strokeStyle = `rgba(255, 215, 0, ${
      0.3 + Math.sin(progress * Math.PI * 1 + i) * 0.3 // Slower oscillation
    })`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * 80,
      centerY + Math.sin(angle) * 80
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * (80 + rayLength),
      centerY + Math.sin(angle) * (80 + rayLength)
    );
    ctx.stroke();
  }

  // Title
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.intro.title"), centerX, height - 50);
  ctx.shadowBlur = 0;
}

function drawMatchboxSetup(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  // Draw three matchboxes
  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    const y = centerY - boxHeight / 2;

    // Matchbox body
    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // Inner tray
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    // Hole (animated appearance)
    const holeSize = Math.min(progress * 15, 15);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, centerY, holeSize, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = "#FFF";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${t("canvas.matchbox_setup.boxLabel")} ${i + 1}`, x + boxWidth / 2, y + boxHeight + 25);
  }

  // Instructions
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(
    t("canvas.matchbox_setup.instruction"),
    width / 2,
    80
  );
  ctx.shadowBlur = 0;
}

function drawMatchboxAligned(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  // Draw torch
  const torchX = 50;
  const torchY = centerY;

  // Torch body
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, torchY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Light beam (animated) - reduced speed
  const beamProgress = Math.min(progress * 1.0, 1);
  const beamEndX = startX + 3 * spacing + 100;

  ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 - progress * 0.2})`;
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(torchX + 20 + (beamEndX - torchX - 20) * beamProgress, torchY);
  ctx.stroke();

  // Focused beam
  ctx.strokeStyle = `rgba(255, 255, 150, ${0.8})`;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(torchX + 20 + (beamEndX - torchX - 20) * beamProgress, torchY);
  ctx.stroke();

  // Draw three matchboxes
  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    const y = centerY - boxHeight / 2;

    // Matchbox body
    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // Inner tray
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    // Hole
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw screen
  const screenX = beamEndX;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX, centerY - 100, 10, 200);

  // Light spot on screen (animated)
  if (beamProgress > 0.8) {
    const spotProgress = (beamProgress - 0.8) * 5;
    const spotSize = 30 * spotProgress;

    const spotGradient = ctx.createRadialGradient(
      screenX,
      centerY,
      0,
      screenX,
      centerY,
      spotSize
    );
    spotGradient.addColorStop(0, "rgba(255, 255, 150, 0.9)");
    spotGradient.addColorStop(1, "rgba(255, 255, 150, 0)");

    ctx.fillStyle = spotGradient;
    ctx.beginPath();
    ctx.arc(screenX, centerY, spotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Instructions
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.matchbox_aligned.message"), width / 2, 80);
  ctx.shadowBlur = 0;
}

function drawMatchboxMisaligned(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  // Draw torch
  const torchX = 50;
  const torchY = centerY;

  // Torch body
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, torchY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Light beam (blocked) - reduced speed
  const beamProgress = Math.min(progress * 1.0, 1);
  const blockX = startX + spacing + boxWidth / 2 - 30;

  ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 - progress * 0.2})`;
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(
    Math.min(torchX + 20 + (blockX - torchX - 20) * beamProgress, blockX),
    torchY
  );
  ctx.stroke();

  // Focused beam
  ctx.strokeStyle = `rgba(255, 255, 150, ${0.8})`;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(
    Math.min(torchX + 20 + (blockX - torchX - 20) * beamProgress, blockX),
    torchY
  );
  ctx.stroke();

  // Draw three matchboxes (middle one misaligned)
  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    let y = centerY - boxHeight / 2;

    // Middle box is offset - slower animation
    const offset = i === 1 ? 30 * Math.sin(progress * Math.PI * 0.5) : 0;
    y += offset;

    // Matchbox body
    ctx.fillStyle = i === 1 ? "#A0522D" : "#8B4513";
    ctx.strokeStyle = i === 1 ? "#8B4513" : "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // Inner tray
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    // Hole
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, y + boxHeight / 2, 15, 0, Math.PI * 2);
    ctx.fill();

    // Arrow showing misalignment
    if (i === 1 && offset > 5) {
      ctx.strokeStyle = "#EF4444";
      ctx.fillStyle = "#EF4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + boxWidth / 2, y - 30);
      ctx.lineTo(x + boxWidth / 2, y - 10);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x + boxWidth / 2, y - 10);
      ctx.lineTo(x + boxWidth / 2 - 5, y - 18);
      ctx.lineTo(x + boxWidth / 2 + 5, y - 18);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Draw screen
  const screenX = startX + 3 * spacing + 100;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX, centerY - 100, 10, 200);

  // No light spot (with X mark)
  if (beamProgress > 0.8) {
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(screenX - 20, centerY - 20);
    ctx.lineTo(screenX + 20, centerY + 20);
    ctx.moveTo(screenX + 20, centerY - 20);
    ctx.lineTo(screenX - 20, centerY + 20);
    ctx.stroke();
  }

  // Instructions
  ctx.fillStyle = "#EF4444";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(
    t("canvas.matchbox_misaligned.message"),
    width / 2,
    80
  );
  ctx.shadowBlur = 0;
}

function drawPipeIntro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw pipe (animated appearance) - reduced speed
  const pipeLength = 300 * Math.min(progress * 1.0, 1);
  const pipeY = centerY;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(centerX - 150, pipeY);
  ctx.lineTo(centerX - 150 + pipeLength, pipeY);
  ctx.stroke();

  // Inner pipe
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(centerX - 150, pipeY);
  ctx.lineTo(centerX - 150 + pipeLength, pipeY);
  ctx.stroke();

  // Candle (on left)
  if (progress > 0.3) {
    const candleX = centerX - 180;
    const candleY = centerY + 50;

    // Candle body
    ctx.fillStyle = "#F3E5AB";
    ctx.fillRect(candleX - 10, candleY, 20, 60);

    // Flame - slower flicker
    const flameSize = 20 + Math.sin(progress * Math.PI * 4) * 3;
    const flameGradient = ctx.createRadialGradient(
      candleX,
      candleY - 10,
      0,
      candleX,
      candleY - 10,
      flameSize
    );
    flameGradient.addColorStop(0, "#FFF");
    flameGradient.addColorStop(0.4, "#FFD700");
    flameGradient.addColorStop(1, "#FF4500");

    ctx.fillStyle = flameGradient;
    ctx.beginPath();
    ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eye (on right)
  if (progress > 0.6) {
    const eyeX = centerX + 180;
    const eyeY = centerY;

    // Eye white
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye outline
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pupil
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(eyeX - 5, eyeY, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Instructions
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.pipe_intro.question"), centerX, 80);
  ctx.shadowBlur = 0;
}

function drawPipeStraight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw straight pipe
  const pipeStartX = centerX - 200;
  const pipeEndX = centerX + 200;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(pipeEndX, centerY);
  ctx.stroke();

  // Inner pipe
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(pipeEndX, centerY);
  ctx.stroke();

  // Light ray through pipe (animated) - reduced speed
  const rayProgress = Math.min(progress * 1.0, 1);
  const rayEndX = pipeStartX + (pipeEndX - pipeStartX) * rayProgress;

  ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(rayEndX, centerY);
  ctx.stroke();

  // Brighter center ray
  ctx.strokeStyle = "rgba(255, 255, 150, 0.9)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(rayEndX, centerY);
  ctx.stroke();

  // Candle (on left)
  const candleX = pipeStartX - 50;
  const candleY = centerY + 80;

  // Candle body
  ctx.fillStyle = "#F3E5AB";
  ctx.fillRect(candleX - 10, candleY, 20, 60);

  // Flame
  const flameSize = 20 + Math.sin(progress * Math.PI * 8) * 3;
  const flameGradient = ctx.createRadialGradient(
    candleX,
    candleY - 10,
    0,
    candleX,
    candleY - 10,
    flameSize
  );
  flameGradient.addColorStop(0, "#FFF");
  flameGradient.addColorStop(0.4, "#FFD700");
  flameGradient.addColorStop(1, "#FF4500");

  ctx.fillStyle = flameGradient;
  ctx.beginPath();
  ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye (on right)
  const eyeX = pipeEndX + 50;
  const eyeY = centerY;

  // Eye white
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye outline
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pupil (looking at flame)
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(eyeX - 5, eyeY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Glint in eye if light reaches
  if (rayProgress > 0.9) {
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(eyeX - 3, eyeY - 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Checkmark
  if (rayProgress > 0.9) {
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pipeEndX + 80, centerY - 80);
    ctx.lineTo(pipeEndX + 100, centerY - 60);
    ctx.lineTo(pipeEndX + 140, centerY - 100);
    ctx.stroke();
  }

  // Instructions
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.pipe_straight.message"), centerX, 80);
  ctx.shadowBlur = 0;
}

function drawPipeBent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw bent pipe (animated bending)
  const bendAmount = Math.min(progress, 1) * 100;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(centerX - 200, centerY);
  ctx.lineTo(centerX - 50, centerY);
  ctx.quadraticCurveTo(
    centerX,
    centerY - bendAmount,
    centerX + 50,
    centerY
  );
  ctx.lineTo(centerX + 200, centerY);
  ctx.stroke();

  // Inner pipe
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(centerX - 200, centerY);
  ctx.lineTo(centerX - 50, centerY);
  ctx.quadraticCurveTo(
    centerX,
    centerY - bendAmount,
    centerX + 50,
    centerY
  );
  ctx.lineTo(centerX + 200, centerY);
  ctx.stroke();

  // Light ray (stops at bend) - reduced speed
  if (progress > 0.3) {
    const rayProgress = Math.min((progress - 0.3) * 1.0, 1);
    const rayLength = 150 * rayProgress;

    ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY);
    ctx.lineTo(centerX - 200 + rayLength, centerY);
    ctx.stroke();

    // Brighter center ray
    ctx.strokeStyle = "rgba(255, 255, 150, 0.9)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY);
    ctx.lineTo(centerX - 200 + rayLength, centerY);
    ctx.stroke();

    // Show light blocked (X mark at bend point)
    if (rayProgress > 0.9) {
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(centerX - 60, centerY - 10);
      ctx.lineTo(centerX - 40, centerY + 10);
      ctx.moveTo(centerX - 40, centerY - 10);
      ctx.lineTo(centerX - 60, centerY + 10);
      ctx.stroke();
    }
  }

  // Candle (on left)
  const candleX = centerX - 250;
  const candleY = centerY + 80;

  // Candle body
  ctx.fillStyle = "#F3E5AB";
  ctx.fillRect(candleX - 10, candleY, 20, 60);

  // Flame
  const flameSize = 20 + Math.sin(progress * Math.PI * 8) * 3;
  const flameGradient = ctx.createRadialGradient(
    candleX,
    candleY - 10,
    0,
    candleX,
    candleY - 10,
    flameSize
  );
  flameGradient.addColorStop(0, "#FFF");
  flameGradient.addColorStop(0.4, "#FFD700");
  flameGradient.addColorStop(1, "#FF4500");

  ctx.fillStyle = flameGradient;
  ctx.beginPath();
  ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye (on right) - confused/unable to see
  const eyeX = centerX + 250;
  const eyeY = centerY;

  // Eye white
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye outline
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pupil (looking confused)
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(eyeX, eyeY + 5, 8, 0, Math.PI * 2);
  ctx.fill();

  // X mark over eye (can't see)
  if (progress > 0.8) {
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(eyeX - 30, eyeY - 30);
    ctx.lineTo(eyeX + 30, eyeY + 30);
    ctx.moveTo(eyeX + 30, eyeY - 30);
    ctx.lineTo(eyeX - 30, eyeY + 30);
    ctx.stroke();
  }

  // Instructions
  ctx.fillStyle = "#EF4444";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.pipe_bent.message"), centerX, 80);
  ctx.shadowBlur = 0;
}

// Practice Mode Component
const PracticeMode: React.FC = () => {
  const { t, tValue } = useLanguage();

  const questionsData = tValue("practice.questions");
  const questions: PracticeQuestion[] = useMemo(() => {
    return Array.isArray(questionsData) ? (questionsData as unknown as PracticeQuestion[]) : [];
  }, [questionsData]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);


  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">{t("practice.loading")}</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) {
      alert(t("practice.selectAnswer"));
      return;
    }
    setShowResult(true);
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect && !answeredQuestions.includes(currentQuestion)) {
      setScore(score + 1);
    }
    if (!answeredQuestions.includes(currentQuestion)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const isQuizComplete = answeredQuestions.length === questions.length;

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t("practice.complete")}
            </h2>
            <p className="text-2xl text-gray-600 mb-3">
              {t("practice.finalScore")}
            </p>
            <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
              {score} / {questions.length}
            </p>
            <div className="mb-8">
              <p className="text-lg text-gray-700">
                {percentage === 100
                  ? t("practice.scoreMessages.perfect")
                  : percentage >= 75
                  ? t("practice.scoreMessages.great")
                  : percentage >= 50
                  ? t("practice.scoreMessages.good")
                  : t("practice.scoreMessages.keepLearning")}
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              {t("practice.restart")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = showResult && selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-5xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-6">
            <h2 className="text-3xl font-bold mb-2">{t("practice.title")}</h2>
            <p className="text-blue-100 text-lg">{t("practice.subtitle")}</p>
            <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
              <span className="text-sm bg-white/20 px-5 py-2.5 rounded-full font-semibold">
                {t("practice.question")} {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-sm bg-white/20 px-5 py-2.5 rounded-full font-semibold">
                {t("practice.score")}: {score}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">
              {question.question}
            </h3>

            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const showCorrect = showResult && index === question.correctAnswer;
                const showWrong = showResult && isSelected && !showCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`
                      w-full text-left p-5 rounded-xl border-2 transition-all transform
                      ${
                        showCorrect
                          ? "border-green-500 bg-green-50 scale-105 shadow-lg"
                          : showWrong
                          ? "border-red-500 bg-red-50"
                          : isSelected
                          ? "border-blue-500 bg-blue-50 scale-105"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }
                      ${showResult ? "cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    <div className="flex items-center">
                      <span
                        className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4
                        ${
                          showCorrect
                            ? "bg-green-500 text-white"
                            : showWrong
                            ? "bg-red-500 text-white"
                            : isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }
                      `}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium text-gray-800 text-lg flex-1">
                        {option}
                      </span>
                      {showResult && (
                        <span className="ml-auto">
                          {showCorrect ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          ) : isSelected ? (
                            <XCircle className="w-8 h-8 text-red-500" />
                          ) : null}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div
                className={`
                p-6 rounded-xl mb-6 border-2
                ${
                  isCorrect
                    ? "bg-green-50 border-green-300"
                    : "bg-amber-50 border-amber-300"
                }
              `}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <Lightbulb className="w-7 h-7 text-amber-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <p className="font-bold text-xl mb-2">
                      {isCorrect ? t("practice.correct") : t("practice.incorrect")}
                    </p>
                    <p className="text-gray-800 leading-relaxed">
                      <span className="font-semibold">
                        {t("practice.explanation")}
                      </span>{" "}
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {!showResult ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("practice.checkAnswer")}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("practice.nextQuestion")}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-full p-2 shadow-md">
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
              style={{
                width: `${(answeredQuestions.length / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { t, tValue } = useLanguage();

  const applicationsData = tValue("realWorld.applications");
  const applications: RealWorldApp[] = useMemo(() => {
    return Array.isArray(applicationsData) ? (applicationsData as unknown as RealWorldApp[]) : [];
  }, [applicationsData]);


  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">{t("realWorld.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-8">
            <h2 className="text-4xl font-bold mb-3">{t("realWorld.title")}</h2>
            <p className="text-blue-100 text-xl">{t("realWorld.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-transparent hover:border-blue-400 hover:scale-105 transform duration-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl">{app.icon}</div>
                <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {app.category}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {app.title}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {app.description}
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{t("realWorld.example")}</span> {app.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component (internal, uses LanguageProvider)
const MainApp: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("learn");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                {t("nav.logo")}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("learn")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-500 ${
                    activeTab === "learn"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  {t("nav.tabs.learn")} 
                </button>
                <button
                  onClick={() => setActiveTab("practice")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-500 ${
                    activeTab === "practice"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <ClipboardCheck className="w-5 h-5" />
                  {t("nav.tabs.practice")}
                </button>
                <button
                  onClick={() => setActiveTab("realWorld")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-500 ${
                    activeTab === "realWorld"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  {t("nav.tabs.realWorld")}
                </button>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {activeTab === "learn" ? (
          <LightTravelStraightLine width={800} height={600} />
        ) : activeTab === "practice" ? (
          <PracticeMode />
        ) : (
          <RealWorldMode />
        )}
      </div>
    </div>
  );
};

// Main App Component with Provider (exported for use in main App.tsx)
export const LightTravelApp: React.FC = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
};