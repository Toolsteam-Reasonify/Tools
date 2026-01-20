/* eslint-disable react-refresh/only-export-components */
import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// Type Definitions
export type Language = 'en' | 'hi' | 'gu';
export type Mode = 'learn' | 'activity' | 'realworld';

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════

const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
  };
};



// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.logo': 'Speed & Motion',
    'nav.learn': 'Learn',
    'nav.activity': 'Activities',
    'nav.realworld': 'Real World',
    
    // Learn Mode
    'learn.hero.title': 'Understanding Speed & Motion',
    'learn.hero.subtitle': 'Learn the fundamental concepts of speed through interactive visuals and real-world examples',
    'learn.intro.title': 'What is Speed? 🤔',
    'learn.intro.content': 'Speed measures how fast an object moves. It tells us the distance covered in a specific amount of time. When you compare two objects traveling the same distance, the one that takes less time is moving faster!',
    'learn.distance.label': 'Distance',
    'learn.distance.desc': 'How far you travel',
    'learn.time.label': 'Time',
    'learn.time.desc': 'How long it takes',
    'learn.speed.label': 'Speed',
    'learn.speed.desc': 'Distance ÷ Time',
    
    // Concept Cards
    'card.formula.title': 'Speed Formula',
    'card.formula.desc': 'Speed is calculated by dividing the distance traveled by the time taken. The faster you move, the higher your speed!',
    'card.formula.example': '100 meters ÷ 10 seconds = 10 m/s',
    'card.unit.title': 'SI Unit',
    'card.unit.desc': 'The standard unit for measuring speed is metre per second (m/s). We also commonly use kilometre per hour (km/h).',
    'card.unit.example': '1 m/s = 3.6 km/h',
    'card.conversion.title': 'Unit Conversion',
    'card.conversion.desc': 'To convert m/s to km/h, multiply by 3.6. To convert km/h to m/s, divide by 3.6.',
    'card.conversion.example': '20 m/s × 3.6 = 72 km/h',
    
    // Key Takeaways
    'takeaway.title': 'Key Takeaways',
    'takeaway.subtitle': 'Remember these important concepts about speed',
    'takeaway.formula.title': 'FORMULA',
    'takeaway.formula.text': 'Speed = Distance ÷ Time',
    'takeaway.unit.title': 'SI UNIT',
    'takeaway.unit.text': 'Metre per second (m/s)',
    'takeaway.concept.title': 'CONCEPT',
    'takeaway.concept.text': 'Higher speed = More distance in less time',
    'takeaway.conversion.title': 'CONVERSION',
    'takeaway.conversion.text': '1 m/s = 3.6 km/h',
    
    // Concepts
    'concept.speed': 'Speed',
    'concept.distance': 'Distance',
    'concept.time': 'Time',
    
    // Relationship
    'relationship.title': 'Speed-Distance-Time Relationship',
    'relationship.subtitle': 'Click on any circle to see how these three quantities are related',
    
    // Formulas
    'formula.speed.title': 'Calculate Speed',
    'formula.speed.formula': 'Speed = Distance ÷ Time',
    'formula.speed.example': 'If you travel 100 km in 2 hours: Speed = 100 ÷ 2 = 50 km/h',
    'formula.speed.explanation': 'Speed tells you how fast you are moving',
    
    'formula.distance.title': 'Calculate Distance',
    'formula.distance.formula': 'Distance = Speed × Time',
    'formula.distance.example': 'At 50 km/h for 2 hours: Distance = 50 × 2 = 100 km',
    'formula.distance.explanation': 'Distance is how far you travel',
    
    'formula.time.title': 'Calculate Time',
    'formula.time.formula': 'Time = Distance ÷ Speed',
    'formula.time.example': 'To travel 100 km at 50 km/h: Time = 100 ÷ 50 = 2 hours',
    'formula.time.explanation': 'Time is how long your journey takes',
    
    // Activity Mode
    'activity.hero.title': 'Interactive Activities',
    'activity.hero.subtitle': 'Learn by doing! Try these hands-on activities to master speed concepts',
    'activity.1.title': '🏁 Speed Race Simulator',
    'activity.1.desc': 'Compare two racers with different speeds and see who wins!',
    'activity.2.title': '📏 Distance Calculator',
    'activity.2.desc': 'Calculate how far you can travel at a given speed and time',
    'activity.3.title': '🔄 Unit Converter',
    'activity.3.desc': 'Convert between m/s and km/h instantly',
    'activity.4.title': '⚖️ Speed Comparison',
    'activity.4.desc': 'Compare speeds of any two objects',
    
    // Real World Mode
    'realworld.hero.title': 'Real World Applications',
    'realworld.hero.subtitle': 'Discover how speed applies to everyday objects around us',
    'realworld.facts.title': 'Interesting Speed Facts',
    'realworld.facts.subtitle': 'Amazing facts about speed in nature and technology',
    
    // Speed items
    'speed.snail': 'Snail',
    'speed.snail.desc': 'One of the slowest creatures',
    'speed.walking': 'Walking',
    'speed.walking.desc': 'Average human walking speed',
    'speed.running': 'Running',
    'speed.running.desc': 'Average human running speed',
    'speed.cycling': 'Cycling',
    'speed.cycling.desc': 'Typical bicycle speed',
    'speed.car': 'Car (City)',
    'speed.car.desc': 'City traffic speed limit',
    'speed.train': 'Train',
    'speed.train.desc': 'Regular train speed',
    'speed.bullettrain': 'Bullet Train',
    'speed.bullettrain.desc': 'High-speed rail',
    'speed.airplane': 'Airplane',
    'speed.airplane.desc': 'Commercial jet cruising speed',
    'speed.rocket': 'Rocket',
    'speed.rocket.desc': 'Space rocket speed',
    'speed.light': 'Light',
    'speed.light.desc': 'Fastest speed in universe',
    
    // Fact cards
    'speed.usain': 'Usain Bolt',
    'speed.cheetah': 'Cheetah',
    'speed.falcon': 'Peregrine Falcon',
    'speed.shinkansen': 'Bullet Train',
    'speed.earth': 'Earth\'s Rotation',
    'speed.sound': 'Sound Speed',
    
    'realworld.fact.usain': 'The fastest human sprinter reached 44.72 km/h during his 100m world record!',
    'realworld.fact.cheetah': 'The fastest land animal can reach speeds up to 120 km/h in short bursts!',
    'realworld.fact.falcon': 'The fastest bird can dive at speeds exceeding 380 km/h when hunting!',
    'realworld.fact.train': 'Japan\'s Shinkansen can travel at speeds up to 320 km/h!',
    'realworld.fact.earth': 'Earth spins at about 1,670 km/h at the equator, but we don\'t feel it!',
    'realworld.fact.sound': 'Sound travels at approximately 1,235 km/h through air at sea level!',
    
    'common.example': 'Example',
    'common.exampleLabel': 'Example:',
  },
  hi: {
    'nav.logo': 'गति और चाल',
    'nav.learn': 'सीखें',
    'nav.activity': 'गतिविधियाँ',
    'nav.realworld': 'वास्तविक दुनिया',
    
    // Learn Mode
    'learn.hero.title': 'गति और चाल को समझना',
    'learn.hero.subtitle': 'इंटरैक्टिव दृश्यों और वास्तविक दुनिया के उदाहरणों के माध्यम से गति की मूलभूत अवधारणाओं को सीखें',
    'learn.intro.title': 'चाल क्या है? 🤔',
    'learn.intro.content': 'चाल मापती है कि कोई वस्तु कितनी तेजी से चलती है। यह हमें एक निश्चित समय में तय की गई दूरी बताती है। जब आप समान दूरी तय करने वाली दो वस्तुओं की तुलना करते हैं, तो जो कम समय लेती है वह तेजी से चल रही है!',
    'learn.distance.label': 'दूरी',
    'learn.distance.desc': 'आप कितनी दूर यात्रा करते हैं',
    'learn.time.label': 'समय',
    'learn.time.desc': 'इसमें कितना समय लगता है',
    'learn.speed.label': 'चाल',
    'learn.speed.desc': 'दूरी ÷ समय',
    
    // Concept Cards
    'card.formula.title': 'चाल का सूत्र',
    'card.formula.desc': 'चाल की गणना तय की गई दूरी को लिए गए समय से विभाजित करके की जाती है। आप जितनी तेजी से चलते हैं, आपकी चाल उतनी ही अधिक होती है!',
    'card.formula.example': '100 मीटर ÷ 10 सेकंड = 10 मी/से',
    'card.unit.title': 'SI इकाई',
    'card.unit.desc': 'चाल को मापने की मानक इकाई मीटर प्रति सेकंड (मी/से) है। हम आमतौर पर किलोमीटर प्रति घंटा (किमी/घंटा) का भी उपयोग करते हैं।',
    'card.unit.example': '1 मी/से = 3.6 किमी/घंटा',
    'card.conversion.title': 'इकाई रूपांतरण',
    'card.conversion.desc': 'मी/से को किमी/घंटा में बदलने के लिए, 3.6 से गुणा करें। किमी/घंटा को मी/से में बदलने के लिए, 3.6 से विभाजित करें।',
    'card.conversion.example': '20 मी/से × 3.6 = 72 किमी/घंटा',
    
    // Key Takeaways
    'takeaway.title': 'मुख्य बातें',
    'takeaway.subtitle': 'चाल के बारे में इन महत्वपूर्ण अवधारणाओं को याद रखें',
    'takeaway.formula.title': 'सूत्र',
    'takeaway.formula.text': 'चाल = दूरी ÷ समय',
    'takeaway.unit.title': 'SI इकाई',
    'takeaway.unit.text': 'मीटर प्रति सेकंड (मी/से)',
    'takeaway.concept.title': 'अवधारणा',
    'takeaway.concept.text': 'अधिक चाल = कम समय में अधिक दूरी',
    'takeaway.conversion.title': 'रूपांतरण',
    'takeaway.conversion.text': '1 मी/से = 3.6 किमी/घंटा',
    
    'concept.speed': 'चाल',
    'concept.distance': 'दूरी',
    'concept.time': 'समय',
    
    'relationship.title': 'चाल-दूरी-समय संबंध',
    'relationship.subtitle': 'इन तीन मात्राओं का संबंध देखने के लिए किसी भी वृत्त पर क्लिक करें',
    
    'formula.speed.title': 'चाल की गणना',
    'formula.speed.formula': 'चाल = दूरी ÷ समय',
    'formula.speed.example': 'यदि आप 2 घंटे में 100 किमी यात्रा करते हैं: चाल = 100 ÷ 2 = 50 किमी/घंटा',
    'formula.speed.explanation': 'चाल बताती है कि आप कितनी तेजी से चल रहे हैं',
    
    'formula.distance.title': 'दूरी की गणना',
    'formula.distance.formula': 'दूरी = चाल × समय',
    'formula.distance.example': '50 किमी/घंटा पर 2 घंटे के लिए: दूरी = 50 × 2 = 100 किमी',
    'formula.distance.explanation': 'दूरी बताती है कि आप कितनी दूर यात्रा करते हैं',
    
    'formula.time.title': 'समय की गणना',
    'formula.time.formula': 'समय = दूरी ÷ चाल',
    'formula.time.example': '50 किमी/घंटा पर 100 किमी यात्रा करने के लिए: समय = 100 ÷ 50 = 2 घंटे',
    'formula.time.explanation': 'समय बताता है कि आपकी यात्रा में कितना समय लगता है',
    
    // Activity Mode
    'activity.hero.title': 'इंटरैक्टिव गतिविधियाँ',
    'activity.hero.subtitle': 'करके सीखें! चाल की अवधारणाओं में महारत हासिल करने के लिए इन व्यावहारिक गतिविधियों को आज़माएं',
    'activity.1.title': '🏁 चाल रेस सिम्युलेटर',
    'activity.1.desc': 'विभिन्न चाल वाले दो धावकों की तुलना करें और देखें कौन जीतता है!',
    'activity.2.title': '📏 दूरी कैलकुलेटर',
    'activity.2.desc': 'दी गई चाल और समय पर आप कितनी दूर यात्रा कर सकते हैं, गणना करें',
    'activity.3.title': '🔄 इकाई परिवर्तक',
    'activity.3.desc': 'मी/से और किमी/घंटा के बीच तुरंत रूपांतरण करें',
    'activity.4.title': '⚖️ चाल तुलना',
    'activity.4.desc': 'किन्हीं दो वस्तुओं की चाल की तुलना करें',
    
    // Real World Mode
    'realworld.hero.title': 'वास्तविक दुनिया के अनुप्रयोग',
    'realworld.hero.subtitle': 'जानें कि चाल हमारे आसपास की रोजमर्रा की वस्तुओं पर कैसे लागू होती है',
    'realworld.facts.title': 'दिलचस्प चाल तथ्य',
    'realworld.facts.subtitle': 'प्रकृति और प्रौद्योगिकी में चाल के बारे में आश्चर्यजनक तथ्य',
    
    // Speed items
    'speed.snail': 'घोंघा',
    'speed.snail.desc': 'सबसे धीमे जीवों में से एक',
    'speed.walking': 'चलना',
    'speed.walking.desc': 'औसत मानव चलने की चाल',
    'speed.running': 'दौड़ना',
    'speed.running.desc': 'औसत मानव दौड़ने की चाल',
    'speed.cycling': 'साइकिल चलाना',
    'speed.cycling.desc': 'सामान्य साइकिल की चाल',
    'speed.car': 'कार (शहर)',
    'speed.car.desc': 'शहर की यातायात गति सीमा',
    'speed.train': 'ट्रेन',
    'speed.train.desc': 'नियमित ट्रेन की चाल',
    'speed.bullettrain': 'बुलेट ट्रेन',
    'speed.bullettrain.desc': 'उच्च गति रेल',
    'speed.airplane': 'हवाई जहाज',
    'speed.airplane.desc': 'व्यावसायिक जेट क्रूजिंग चाल',
    'speed.rocket': 'रॉकेट',
    'speed.rocket.desc': 'अंतरिक्ष रॉकेट की चाल',
    'speed.light': 'प्रकाश',
    'speed.light.desc': 'ब्रह्मांड में सबसे तेज गति',
    
    // Fact cards
    'speed.usain': 'उसेन बोल्ट',
    'speed.cheetah': 'चीता',
    'speed.falcon': 'पेरेग्रीन फाल्कन',
    'speed.shinkansen': 'बुलेट ट्रेन',
    'speed.earth': 'पृथ्वी का घूर्णन',
    'speed.sound': 'ध्वनि की चाल',
    
    'realworld.fact.usain': 'सबसे तेज मानव धावक ने अपने 100 मीटर विश्व रिकॉर्ड के दौरान 44.72 किमी/घंटा की चाल हासिल की!',
    'realworld.fact.cheetah': 'सबसे तेज भूमि जानवर छोटे विस्फोटों में 120 किमी/घंटा तक की चाल तक पहुंच सकता है!',
    'realworld.fact.falcon': 'सबसे तेज पक्षी शिकार करते समय 380 किमी/घंटा से अधिक की चाल से गोता लगा सकता है!',
    'realworld.fact.train': 'जापान की शिंकानसेन 320 किमी/घंटा तक की चाल से यात्रा कर सकती है!',
    'realworld.fact.earth': 'पृथ्वी भूमध्य रेखा पर लगभग 1,670 किमी/घंटा की चाल से घूमती है, लेकिन हमें यह महसूस नहीं होता!',
    'realworld.fact.sound': 'ध्वनि समुद्र तल पर हवा के माध्यम से लगभग 1,235 किमी/घंटा की चाल से यात्रा करती है!',
    
    'common.example': 'उदाहरण',
    'common.exampleLabel': 'उदाहरण:',
  },
  gu: {
    'nav.logo': 'ઝડપ અને ગતિ',
    'nav.learn': 'શીખો',
    'nav.activity': 'પ્રવૃત્તિઓ',
    'nav.realworld': 'વાસ્તવિક દુનિયા',
    
    // Learn Mode
    'learn.hero.title': 'ઝડપ અને ગતિને સમજવી',
    'learn.hero.subtitle': 'ઇન્ટરએક્ટિવ વિઝ્યુઅલ્સ અને વાસ્તવિક દુનિયાના ઉદાહરણો દ્વારા ઝડપની મૂળભૂત વિભાવનાઓ શીખો',
    'learn.intro.title': 'ઝડપ શું છે? 🤔',
    'learn.intro.content': 'ઝડપ માપે છે કે કોઈ વસ્તુ કેટલી ઝડપથી આગળ વધે છે. તે આપણને ચોક્કસ સમયમાં કાપેલ અંતર જણાવે છે. જ્યારે તમે સમાન અંતર કાપતી બે વસ્તુઓની તુલના કરો છો, ત્યારે જે ઓછો સમય લે છે તે ઝડપથી આગળ વધી રહી છે!',
    'learn.distance.label': 'અંતર',
    'learn.distance.desc': 'તમે કેટલું દૂર મુસાફરી કરો છો',
    'learn.time.label': 'સમય',
    'learn.time.desc': 'તેમાં કેટલો સમય લાગે છે',
    'learn.speed.label': 'ઝડપ',
    'learn.speed.desc': 'અંતર ÷ સમય',
    
    // Concept Cards
    'card.formula.title': 'ઝડપનું સૂત્ર',
    'card.formula.desc': 'ઝડપની ગણતરી કાપેલ અંતરને લીધેલા સમયથી ભાગીને કરવામાં આવે છે. તમે જેટલી ઝડપથી આગળ વધો છો, તમારી ઝડપ એટલી વધારે હોય છે!',
    'card.formula.example': '100 મીટર ÷ 10 સેકન્ડ = 10 મી/સે',
    'card.unit.title': 'SI એકમ',
    'card.unit.desc': 'ઝડપને માપવા માટેનો માનક એકમ મીટર પ્રતિ સેકન્ડ (મી/સે) છે. અમે સામાન્ય રીતે કિલોમીટર પ્રતિ કલાક (કિમી/કલાક) નો પણ ઉપયોગ કરીએ છીએ.',
    'card.unit.example': '1 મી/સે = 3.6 કિમી/કલાક',
    'card.conversion.title': 'એકમ રૂપાંતરણ',
    'card.conversion.desc': 'મી/સેને કિમી/કલાકમાં રૂપાંતરિત કરવા માટે, 3.6 વડે ગુણો. કિમી/કલાકને મી/સેમાં રૂપાંતરિત કરવા માટે, 3.6 વડે ભાગો.',
    'card.conversion.example': '20 મી/સે × 3.6 = 72 કિમી/કલાક',
    
    // Key Takeaways
    'takeaway.title': 'મુખ્ય મુદ્દાઓ',
    'takeaway.subtitle': 'ઝડપ વિશેની આ મહત્વપૂર્ણ વિભાવનાઓ યાદ રાખો',
    'takeaway.formula.title': 'સૂત્ર',
    'takeaway.formula.text': 'ઝડપ = અંતર ÷ સમય',
    'takeaway.unit.title': 'SI એકમ',
    'takeaway.unit.text': 'મીટર પ્રતિ સેકન્ડ (મી/સે)',
    'takeaway.concept.title': 'વિભાવના',
    'takeaway.concept.text': 'વધુ ઝડપ = ઓછા સમયમાં વધુ અંતર',
    'takeaway.conversion.title': 'રૂપાંતરણ',
    'takeaway.conversion.text': '1 મી/સે = 3.6 કિમી/કલાક',
    
    'concept.speed': 'ઝડપ',
    'concept.distance': 'અંતર',
    'concept.time': 'સમય',
    
    'relationship.title': 'ઝડપ-અંતર-સમય સંબંધ',
    'relationship.subtitle': 'આ ત્રણ જથ્થાઓ કેવી રીતે સંબંધિત છે તે જોવા માટે કોઈપણ વર્તુળ પર ક્લિક કરો',
    
    'formula.speed.title': 'ઝડપની ગણતરી',
    'formula.speed.formula': 'ઝડપ = અંતર ÷ સમય',
    'formula.speed.example': 'જો તમે 2 કલાકમાં 100 કિમી મુસાફરી કરો: ઝડપ = 100 ÷ 2 = 50 કિમી/કલાક',
    'formula.speed.explanation': 'ઝડપ તમને કહે છે કે તમે કેટલી ઝડપથી આગળ વધી રહ્યા છો',
    
    'formula.distance.title': 'અંતરની ગણતરી',
    'formula.distance.formula': 'અંતર = ઝડપ × સમય',
    'formula.distance.example': '50 કિમી/કલાકે 2 કલાક માટે: અંતર = 50 × 2 = 100 કિમી',
    'formula.distance.explanation': 'અંતર તમને કહે છે કે તમે કેટલું દૂર મુસાફરી કરો છો',
    
    'formula.time.title': 'સમયની ગણતરી',
    'formula.time.formula': 'સમય = અંતર ÷ ઝડપ',
    'formula.time.example': '50 કિમી/કલાકે 100 કિમી મુસાફરી કરવા માટે: સમય = 100 ÷ 50 = 2 કલાક',
    'formula.time.explanation': 'સમય તમને કહે છે કે તમારી મુસાફરી કેટલો સમય લે છે',
    
    // Activity Mode
    'activity.hero.title': 'ઇન્ટરએક્ટિવ પ્રવૃત્તિઓ',
    'activity.hero.subtitle': 'કરીને શીખો! ઝડપની વિભાવનાઓમાં નિપુણતા મેળવવા માટે આ વ્યવહારુ પ્રવૃત્તિઓ અજમાવો',
    'activity.1.title': '🏁 ઝડપ રેસ સિમ્યુલેટર',
    'activity.1.desc': 'વિવિધ ઝડપ સાથે બે રેસર્સની તુલના કરો અને જુઓ કોણ જીતે છે!',
    'activity.2.title': '📏 અંતર કેલ્ક્યુલેટર',
    'activity.2.desc': 'આપેલ ઝડપ અને સમયે તમે કેટલું દૂર મુસાફરી કરી શકો છો તેની ગણતરી કરો',
    'activity.3.title': '🔄 એકમ કન્વર્ટર',
    'activity.3.desc': 'મી/સે અને કિમી/કલાક વચ્ચે તરત જ રૂપાંતરણ કરો',
    'activity.4.title': '⚖️ ઝડપ સરખામણી',
    'activity.4.desc': 'કોઈપણ બે વસ્તુઓની ઝડપની સરખામણી કરો',
    
    // Real World Mode
    'realworld.hero.title': 'વાસ્તવિક દુનિયાના ઉપયોગો',
    'realworld.hero.subtitle': 'શોધો કે ઝડપ આપણી આસપાસની રોજિંદી વસ્તુઓ પર કેવી રીતે લાગુ પડે છે',
    'realworld.facts.title': 'રસપ્રદ ઝડપ તથ્યો',
    'realworld.facts.subtitle': 'પ્રકૃતિ અને ટેકનોલોજીમાં ઝડપ વિશે આશ્ચર્યજનક તથ્યો',
    
    // Speed items
    'speed.snail': 'ગોકળગાય',
    'speed.snail.desc': 'સૌથી ધીમા જીવોમાંનું એક',
    'speed.walking': 'ચાલવું',
    'speed.walking.desc': 'સરેરાશ માનવ ચાલવાની ઝડપ',
    'speed.running': 'દોડવું',
    'speed.running.desc': 'સરેરાશ માનવ દોડવાની ઝડપ',
    'speed.cycling': 'સાયકલ ચલાવવી',
    'speed.cycling.desc': 'સામાન્ય સાયકલની ઝડપ',
    'speed.car': 'કાર (શહેર)',
    'speed.car.desc': 'શહેર ટ્રાફિક ઝડપ મર્યાદા',
    'speed.train': 'ટ્રેન',
    'speed.train.desc': 'નિયમિત ટ્રેનની ઝડપ',
    'speed.bullettrain': 'બુલેટ ટ્રેન',
    'speed.bullettrain.desc': 'હાઈ-સ્પીડ રેલ',
    'speed.airplane': 'વિમાન',
    'speed.airplane.desc': 'કોમર્શિયલ જેટ ક્રૂઝિંગ ઝડપ',
    'speed.rocket': 'રોકેટ',
    'speed.rocket.desc': 'અંતરિક્ષ રોકેટની ઝડપ',
    'speed.light': 'પ્રકાશ',
    'speed.light.desc': 'બ્રહ્માંડમાં સૌથી ઝડપી ગતિ',
    
    // Fact cards
    'speed.usain': 'ઉસેઇન બોલ્ટ',
    'speed.cheetah': 'ચિતો',
    'speed.falcon': 'પેરેગ્રિન ફાલ્કન',
    'speed.shinkansen': 'બુલેટ ટ્રેન',
    'speed.earth': 'પૃથ્વીનું પરિભ્રમણ',
    'speed.sound': 'ધ્વનિની ઝડપ',
    
    'realworld.fact.usain': 'સૌથી ઝડપી માનવ સ્પ્રિન્ટર તેના 100મીના વિશ્વ રેકોર્ડ દરમિયાન 44.72 કિમી/કલાકની ઝડપે પહોંચ્યો!',
    'realworld.fact.cheetah': 'સૌથી ઝડપી જમીન પ્રાણી ટૂંકા વિસ્ફોટોમાં 120 કિમી/કલાકની ઝડપે પહોંચી શકે છે!',
    'realworld.fact.falcon': 'સૌથી ઝડપી પક્ષી શિકાર કરતી વખતે 380 કિમી/કલાકથી વધુની ઝડપે ડૂબકી મારી શકે છે!',
    'realworld.fact.train': 'જાપાનની શિંકાન્સેન 320 કિમી/કલાકની ઝડપે મુસાફરી કરી શકે છે!',
    'realworld.fact.earth': 'પૃથ્વી વિષુવવૃત્ત પર લગભગ 1,670 કિમી/કલાકની ઝડપે ફરે છે, પરંતુ આપણે તેને અનુભવતા નથી!',
    'realworld.fact.sound': 'ધ્વનિ સમુદ્ર સપાટી પર હવા દ્વારા લગભગ 1,235 કિમી/કલાકની ઝડપે મુસાફરી કરે છે!',
    
    'common.example': 'ઉદાહરણ',
    'common.exampleLabel': 'ઉદાહરણ:',
  }
};
  

// Contexts
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: string): string => translations[language][key] || key;
  const contextValue = useMemo(() => ({ language, setLanguage, t }), [language]);
  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

interface ModeContextType {
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<Mode>('learn');
  const contextValue = useMemo(() => ({ currentMode, setCurrentMode }), [currentMode]);
  return <ModeContext.Provider value={contextValue}>{children}</ModeContext.Provider>;
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within ModeProvider');
  return context;
};

// Navbar
const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentMode, setCurrentMode } = useMode();
  const { width } = useResponsive();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', zIndex: 1000, padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', height: '70px'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', fontSize: '26px', fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          <span style={{ fontSize: '32px' }}>⚡</span>
          {t('nav.logo')}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', position: 'relative' }}>
          {width > 938 ? (
            <>
              {(['learn', 'activity', 'realworld'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCurrentMode(mode)}
                  style={{
                    padding: '12px 28px', fontSize: '15px',
                    fontWeight: currentMode === mode ? '600' : '500',
                    color: currentMode === mode ? 'white' : '#4B5563',
                    background: currentMode === mode
                      ? mode === 'learn' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : mode === 'activity' ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : 'transparent',
                    border: currentMode === mode ? 'none' : '2px solid #E5E7EB',
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease',
                    boxShadow: currentMode === mode ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                >
                  {mode === 'learn' ? '📚' : mode === 'activity' ? '🎯' : '🌍'} {t(`nav.${mode}`)}
                </button>
              ))}

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={{
                  padding: '10px 16px', fontSize: '15px', fontWeight: '500', color: '#374151',
                  border: '2px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer',
                  backgroundColor: 'white', minWidth: '130px'
                }}
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="gu">🇮🇳 ગુજરાતી</option>
              </select>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Open menu"
                style={{
                  padding: '10px 14px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  background: 'white',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#1f2937'
                }}
              >
                ☰
              </button>
              {isMobileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '70px',
                  right: 0,
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                  padding: '12px',
                  width: 'calc(100vw - 40px)',
                  maxWidth: '320px',
                  zIndex: 1100
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(['learn', 'activity', 'realworld'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => { setCurrentMode(mode); setIsMobileMenuOpen(false); }}
                        style={{
                          padding: '12px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                          background: currentMode === mode
                            ? (mode === 'learn'
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : mode === 'activity'
                                ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)')
                            : '#f8fafc',
                          color: currentMode === mode ? 'white' : '#475569',
                          fontSize: '0.95em', fontWeight: 700, transition: 'all 0.3s ease',
                          display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                      >
                        {mode === 'learn' ? '📚' : mode === 'activity' ? '🎯' : '🌍'} {t(`nav.${mode}`)}
                      </button>
                    ))}
                    <select value={language} onChange={(e) => { setLanguage(e.target.value as Language);  setIsMobileMenuOpen(false); }}
                        style={{
                          padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px',
                          background: 'white', fontSize: '0.95em', fontWeight: 600,
                          cursor: 'pointer', width: '100%',color: '#374151'
                        }}>
                        <option value="en">🇬🇧 English</option>
                        <option value="hi">🇮🇳 हिंदी</option>
                        <option value="gu">🇮🇳 ગુજરાતી</option>
                      </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Interactive Concept Cards
const ConceptCard: React.FC<{ 
  titleKey?: string;
  descKey?: string;
  exampleKey?: string;
  title?: string; 
  description?: string; 
  example?: string; 
  color: string; 
  icon: string;
}> = ({ titleKey, descKey, exampleKey, title, description, example, color, icon }) => {
  const { t } = useLanguage();
  
  const displayTitle = titleKey ? t(titleKey) : (title || '');
  const displayDesc = descKey ? t(descKey) : (description || '');
  const displayExample = exampleKey ? t(exampleKey) : (example || '');
  
  return (
    <div style={{
      background: 'white', borderRadius: '20px', padding: '32px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: `3px solid ${color}20`,
      transition: 'transform 0.3s ease', cursor: 'pointer'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{
        width: '60px', height: '60px', borderRadius: '50%',
        background: `${color}20`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '32px', marginBottom: '20px'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px' }}>
        {displayTitle}
      </h3>
      <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px', wordBreak: 'break-word' }}>
        {displayDesc}
      </p>
      <div style={{
        padding: '16px', background: `${color}10`, borderRadius: '12px',
        border: `2px solid ${color}30`
      }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: color, marginBottom: '6px' }}>
          {t('common.exampleLabel')}
        </div>
        <div style={{ fontSize: '14px', color: '#374151', fontFamily: 'monospace' }}>
          {displayExample}
        </div>
      </div>
    </div>
  );
};

// Speed Relationship Visual - Modern Circular Design (Instead of Triangle)
const SpeedRelationshipVisual: React.FC = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<'speed' | 'distance' | 'time'>('speed');

  const formulas = {
    speed: { 
      title: t('formula.speed.title'),
      formula: t('formula.speed.formula'),
      example: t('formula.speed.example'),
      explanation: t('formula.speed.explanation')
    },
    distance: { 
      title: t('formula.distance.title'),
      formula: t('formula.distance.formula'),
      example: t('formula.distance.example'),
      explanation: t('formula.distance.explanation')
    },
    time: { 
      title: t('formula.time.title'),
      formula: t('formula.time.formula'),
      example: t('formula.time.example'),
      explanation: t('formula.time.explanation')
    }
  };

  return (
    <div style={{
      background: 'white', borderRadius: '24px', padding: '48px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '2px solid #E5E7EB'
    }}>
      <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px', textAlign: 'center' }}>
        🔗 {t('relationship.title')}
      </h3>
      <p style={{ color: '#6B7280', marginBottom: '40px', fontSize: '15px', textAlign: 'center' }}>
        {t('relationship.subtitle')}
      </p>

      {/* Circular Relationship Diagram */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', position: 'relative' }}>
        <svg style={{ width: '100%', maxWidth: '500px', height: 'auto' }} preserveAspectRatio="xMidYMid meet" viewBox="0 0 500 400">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2"/>
            </filter>
            <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 0.6 }} />
              <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.6 }} />
            </linearGradient>
          </defs>

          {/* Central Connection Circle */}
          <circle
            cx="250" cy="200"
            r="80"
            fill="url(#connectionGrad)"
            opacity="0.15"
          />
          
          {/* Connection Lines */}
          <line x1="250" y1="200" x2="250" y2="80" stroke="#667eea" strokeWidth="4" opacity="0.4" strokeDasharray="8,6" />
          <line x1="250" y1="200" x2="120" y2="300" stroke="#06b6d4" strokeWidth="4" opacity="0.4" strokeDasharray="8,6" />
          <line x1="250" y1="200" x2="380" y2="300" stroke="#8b5cf6" strokeWidth="4" opacity="0.4" strokeDasharray="8,6" />

          {/* Speed Circle - Top */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelected('speed')}
            filter="url(#shadow)"
          >
            <circle
              cx="250" cy="80"
              r="65"
              fill={selected === 'speed' ? '#667eea' : 'white'}
              stroke="#667eea"
              strokeWidth="5"
            />
            <text
              x="250" y="72"
              textAnchor="middle"
              fontSize="26"
              fontWeight="bold"
              fill={selected === 'speed' ? 'white' : '#667eea'}
            >
              {t('concept.speed')}
            </text>
            <text
              x="250" y="95"
              textAnchor="middle"
              fontSize="18"
              fill={selected === 'speed' ? 'white' : '#667eea'}
              opacity="0.9"
            >
              (S)
            </text>
          </g>

          {/* Distance Circle - Bottom Left */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelected('distance')}
            filter="url(#shadow)"
          >
            <circle
              cx="120" cy="300"
              r="65"
              fill={selected === 'distance' ? '#06b6d4' : 'white'}
              stroke="#06b6d4"
              strokeWidth="5"
            />
            <text
              x="120" y="292"
              textAnchor="middle"
              fontSize="24"
              fontWeight="bold"
              fill={selected === 'distance' ? 'white' : '#06b6d4'}
            >
              {t('concept.distance')}
            </text>
            <text
              x="120" y="315"
              textAnchor="middle"
              fontSize="18"
              fill={selected === 'distance' ? 'white' : '#06b6d4'}
              opacity="0.9"
            >
              (D)
            </text>
          </g>

          {/* Time Circle - Bottom Right */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setSelected('time')}
            filter="url(#shadow)"
          >
            <circle
              cx="380" cy="300"
              r="65"
              fill={selected === 'time' ? '#8b5cf6' : 'white'}
              stroke="#8b5cf6"
              strokeWidth="5"
            />
            <text
              x="380" y="292"
              textAnchor="middle"
              fontSize="26"
              fontWeight="bold"
              fill={selected === 'time' ? 'white' : '#8b5cf6'}
            >
              {t('concept.time')}
            </text>
            <text
              x="380" y="315"
              textAnchor="middle"
              fontSize="18"
              fill={selected === 'time' ? 'white' : '#8b5cf6'}
              opacity="0.9"
            >
              (T)
            </text>
          </g>

          {/* Formula indicators */}
          <text x="250" y="180" textAnchor="middle" fontSize="16" fill="#667eea" fontWeight="600">
            S = D ÷ T
          </text>
          <text x="185" y="240" textAnchor="middle" fontSize="16" fill="#06b6d4" fontWeight="600">
            D = S × T
          </text>
          <text x="315" y="240" textAnchor="middle" fontSize="16" fill="#8b5cf6" fontWeight="600">
            T = D ÷ S
          </text>
        </svg>
      </div>

      <div style={{
        padding: '32px',
        background: `linear-gradient(135deg, ${
          selected === 'speed' ? '#667eea' :
          selected === 'distance' ? '#06b6d4' : '#8b5cf6'
        }08 0%, ${
          selected === 'speed' ? '#764ba2' :
          selected === 'distance' ? '#3b82f6' : '#6366f1'
        }08 100%)`,
        borderRadius: '20px',
        border: `3px solid ${
          selected === 'speed' ? '#667eea' :
          selected === 'distance' ? '#06b6d4' : '#8b5cf6'
        }30`
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1F2937', marginBottom: '10px' }}>
          {formulas[selected].title}
        </div>
        <div style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: selected === 'speed' ? '#667eea' : selected === 'distance' ? '#06b6d4' : '#8b5cf6', 
          marginBottom: '14px',
          fontFamily: 'monospace'
        }}>
          {formulas[selected].formula}
        </div>
        <div style={{ fontSize: '15px', color: '#4B5563', marginBottom: '14px', fontStyle: 'italic' }}>
          {formulas[selected].explanation}
        </div>
        <div style={{
          padding: '16px 20px', background: 'white', borderRadius: '12px',
          fontSize: '15px', color: '#374151', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <span style={{ fontWeight: '600' }}>📝 {t('common.example')}:</span> {formulas[selected].example}
        </div>
      </div>
    </div>
  );
};

// Comparison Chart
const SpeedComparisonChart: React.FC = () => {
  const items = [
    { name: 'Snail', speed: 0.05, icon: '🐌', color: '#ef4444' },
    { name: 'Walking', speed: 5, icon: '🚶', color: '#f59e0b' },
    { name: 'Running', speed: 10, icon: '🏃', color: '#eab308' },
    { name: 'Cycling', speed: 20, icon: '🚴', color: '#84cc16' },
    { name: 'Car', speed: 60, icon: '🚗', color: '#10b981' },
    { name: 'Train', speed: 120, icon: '🚄', color: '#06b6d4' },
    { name: 'Airplane', speed: 900, icon: '✈️', color: '#3b82f6' },
    { name: 'Rocket', speed: 28000, icon: '🚀', color: '#8b5cf6' },
  ];

  const maxSpeed = Math.max(...items.map(i => i.speed));

  return (
    <div style={{
      background: 'white', borderRadius: '20px', padding: '32px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
    }}>
      <h3 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px' }}>
        🌍 Real-World Speed Comparison
      </h3>
      <p style={{ color: '#6B7280', marginBottom: '28px', fontSize: '15px' }}>
        Compare speeds of different objects around us
      </p>

      {items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{item.icon}</span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>{item.name}</span>
            </div>
            <span style={{
              fontSize: '15px', fontWeight: 'bold', color: item.color,
              background: `${item.color}20`, padding: '6px 16px', borderRadius: '20px'
            }}>
              {item.speed >= 1000 ? (item.speed / 1000).toFixed(0) + 'K' : item.speed} km/h
            </span>
          </div>
          <div style={{
            height: '12px', background: '#F3F4F6', borderRadius: '6px', overflow: 'hidden', position: 'relative'
          }}>
            <div style={{
              height: '100%',
              width: `${(Math.log10(item.speed + 1) / Math.log10(maxSpeed + 1)) * 100}%`,
              background: item.color,
              borderRadius: '6px',
              transition: 'width 0.8s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Learn Mode
const LearnMode: React.FC = () => {
  const { t } = useLanguage();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
      padding: '16px', paddingTop: '90px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center', marginBottom: '50px', padding: '50px 30px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '24px', color: 'white',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.35)'
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {t('learn.hero.title')}
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, maxWidth: '800px', margin: '0 auto' }}>
            {t('learn.hero.subtitle')}
          </p>
        </div>

        {/* Introduction */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '40px',
          marginBottom: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937', marginBottom: '20px', textAlign: 'center' }}>
            {t('learn.intro.title')}
          </h2>
          <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', textAlign: 'center', maxWidth: '900px', margin: '0 auto 30px' }}>
            {t('learn.intro.content')}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
            gap: '24px', marginTop: '30px'
          }}>
            <div style={{
              padding: '28px', background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
              borderRadius: '16px', textAlign: 'center', border: '2px solid #3b82f640',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📏</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
                {t('learn.distance.label')}
              </div>
              <div style={{ fontSize: '14px', color: '#1e3a8a' }}>
                {t('learn.distance.desc')}
              </div>
            </div>
            <div style={{
              padding: '28px', background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
              borderRadius: '16px', textAlign: 'center', border: '2px solid #ef444440',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏱️</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', marginBottom: '8px' }}>
                {t('learn.time.label')}
              </div>
              <div style={{ fontSize: '14px', color: '#991b1b' }}>
                {t('learn.time.desc')}
              </div>
            </div>
            <div style={{
              padding: '28px', background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
              borderRadius: '16px', textAlign: 'center', border: '2px solid #10b98140',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚡</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>
                {t('learn.speed.label')}
              </div>
              <div style={{ fontSize: '14px', color: '#065f46' }}>
                {t('learn.speed.desc')}
              </div>
            </div>
          </div>
        </div>

        {/* Key Concepts - Single Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
          gap: '24px', marginBottom: '40px'
        }}>
          <ConceptCard
            icon="📐"
            titleKey="card.formula.title" 
            descKey="card.formula.desc" 
            exampleKey="card.formula.example"
            color="#667eea"
          />
          <ConceptCard
            icon="📊"
            titleKey="card.unit.title"
            descKey="card.unit.desc"
            exampleKey="card.unit.example"
            color="#06b6d4"
          />
          <ConceptCard
            icon="🔄"
            titleKey="card.conversion.title"
            descKey="card.conversion.desc"
            exampleKey="card.conversion.example"
            color="#8b5cf6"
          />
        </div>


        {/* Speed Relationship Diagram */}
        <div style={{ marginBottom: '40px' }}>
          <SpeedRelationshipVisual />
        </div>

        {/* Key Takeaways - Improved Design */}
        <div style={{
          background: 'white',
          borderRadius: '24px', 
          padding: isMobile ? '24px' : '48px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '3px solid #667eea20'
        }}
          className="key-takeaways-section"
        >
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '28px' : '40px' }}>
            <div style={{ fontSize: isMobile ? '40px' : '48px', marginBottom: '12px' }}>💡</div>
            <h3 style={{ 
              fontSize: isMobile ? '24px' : '32px', 
              fontWeight: 'bold', 
              color: '#1F2937', 
              marginBottom: '12px' 
            }}>
              {t('takeaway.title')}
            </h3>
            <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#6B7280', lineHeight: '1.6' }}>
              {t('takeaway.subtitle')}
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
            gap: isMobile ? '16px' : '24px'
          }}
            className="takeaways-grid"
          >
            {[
              { icon: '📐', titleKey: 'takeaway.formula.title', textKey: 'takeaway.formula.text', color: '#667eea' },
              { icon: '📏', titleKey: 'takeaway.unit.title', textKey: 'takeaway.unit.text', color: '#06b6d4' },
              { icon: '⚡', titleKey: 'takeaway.concept.title', textKey: 'takeaway.concept.text', color: '#10b981' },
              { icon: '🔄', titleKey: 'takeaway.conversion.title', textKey: 'takeaway.conversion.text', color: '#8b5cf6' },
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: isMobile ? '20px' : '28px',
                background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
                borderRadius: '16px',
                border: `3px solid ${item.color}30`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              className="takeaway-card"
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 12px 30px ${item.color}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              >
                <div style={{
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'center' : 'flex-start', 
                  gap: isMobile ? '12px' : '16px',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  <div style={{
                    width: isMobile ? '48px' : '56px', 
                    height: isMobile ? '48px' : '56px', 
                    borderRadius: '50%',
                    background: `${item.color}20`, 
                    display: 'flex',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: isMobile ? '24px' : '28px',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: isMobile ? '12px' : '14px', 
                      fontWeight: '600', 
                      color: '#6B7280',
                      marginBottom: '6px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      wordBreak: 'break-word'
                    }}>
                      {t(item.titleKey)}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '15px' : '18px', 
                      fontWeight: 'bold', 
                      color: '#1F2937',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {t(item.textKey)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Activity Mode - Interactive Hands-On Experience
const ActivityMode: React.FC = () => {
  const { t } = useLanguage();
  const [activeActivity, setActiveActivity] = useState<number>(0);
  
  // Activity 1: Speed Race Simulator
  const [raceDistance, setRaceDistance] = useState('100');
  const [racer1Speed, setRacer1Speed] = useState('10');
  const [racer2Speed, setRacer2Speed] = useState('15');
  const [raceResult, setRaceResult] = useState<{winner: number; time1: number; time2: number} | null>(null);
  
  // Activity 2: Distance Calculator
  const [speed, setSpeed] = useState('');
  const [time, setTime] = useState('');
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  
  // Activity 3: Unit Converter
  const [convertValue, setConvertValue] = useState('');
  const [convertFrom, setConvertFrom] = useState<'ms' | 'kmh'>('ms');
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  
  // Activity 4: Speed Comparison
  const [object1, setObject1] = useState('');
  const [speed1, setSpeed1] = useState('');
  const [object2, setObject2] = useState('');
  const [speed2, setSpeed2] = useState('');
  const [comparison, setComparison] = useState<string | null>(null);

  const activities = [
    {
      id: 0,
      title: '🏁 Speed Race Simulator',
      description: 'Compare two racers with different speeds and see who wins!',
      color: '#3b82f6'
    },
    {
      id: 1,
      title: '📏 Distance Calculator',
      description: 'Calculate how far you can travel at a given speed and time',
      color: '#10b981'
    },
    {
      id: 2,
      title: '🔄 Unit Converter',
      description: 'Convert between m/s and km/h instantly',
      color: '#8b5cf6'
    },
    {
      id: 3,
      title: '⚖️ Speed Comparison',
      description: 'Compare speeds of any two objects',
      color: '#f59e0b'
    }
  ];

  const runRace = () => {
    const dist = parseFloat(raceDistance);
    const s1 = parseFloat(racer1Speed);
    const s2 = parseFloat(racer2Speed);
    
    if (!isNaN(dist) && !isNaN(s1) && !isNaN(s2) && s1 > 0 && s2 > 0) {
      const time1 = dist / s1;
      const time2 = dist / s2;
      setRaceResult({
        winner: time1 < time2 ? 1 : 2,
        time1,
        time2
      });
    }
  };

  const calculateDistance = () => {
    const s = parseFloat(speed);
    const t = parseFloat(time);
    if (!isNaN(s) && !isNaN(t)) {
      setCalculatedDistance(s * t);
    }
  };

  const convertUnit = () => {
    const val = parseFloat(convertValue);
    if (!isNaN(val)) {
      setConvertedValue(convertFrom === 'ms' ? val * 3.6 : val / 3.6);
    }
  };

  const compareObjects = () => {
    const s1 = parseFloat(speed1);
    const s2 = parseFloat(speed2);
    
    if (!isNaN(s1) && !isNaN(s2) && object1 && object2) {
      const diff = Math.abs(s1 - s2);
      const faster = s1 > s2 ? object1 : object2;
      const percent = ((Math.max(s1, s2) / Math.min(s1, s2) - 1) * 100).toFixed(1);
      setComparison(`${faster} is faster by ${diff.toFixed(2)} km/h (${percent}% faster)!`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #EFF6FF, #FFFFFF)',
      padding: '16px',
      paddingTop: '90px'
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Hero */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          padding: '50px 40px',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          borderRadius: '28px',
          color: 'white',
          boxShadow: '0 20px 60px rgba(6, 182, 212, 0.4)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '18px' }}>🎯</div>
          <h1 style={{
            fontSize: '52px',
            fontWeight: 'bold',
            marginBottom: '18px',
            textShadow: '0 2px 4px rgba(0,0,0,0.15)'
          }}>
            {t('activity.hero.title')}
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, lineHeight: '1.6' }}>
            {t('activity.hero.subtitle')}
          </p>
        </div>

        {/* Activity Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setActiveActivity(activity.id)}
              style={{
                padding: '28px',
                background: activeActivity === activity.id ? activity.color : 'white',
                color: activeActivity === activity.id ? 'white' : '#374151',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: `3px solid ${activity.color}${activeActivity === activity.id ? '' : '30'}`,
                boxShadow: activeActivity === activity.id ? `0 12px 30px ${activity.color}40` : '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                if (activeActivity !== activity.id) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${activity.color}30`;
                }
              }}
              onMouseLeave={(e) => {
                if (activeActivity !== activity.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                {activity.title}
              </h3>
              <p style={{
                fontSize: '14px',
                opacity: activeActivity === activity.id ? 0.95 : 0.7,
                lineHeight: '1.5'
              }}>
                {activity.description}
              </p>
            </div>
          ))}
        </div>

        {/* Activity Content */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '2px solid #E5E7EB'
        }}>
          {/* Activity 0: Speed Race */}
          {activeActivity === 0 && (
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>
                🏁 Speed Race Simulator
              </h2>
              <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.7' }}>
                Set the distance and speeds for two racers, then see who crosses the finish line first!
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
                  borderRadius: '16px',
                  border: '2px solid #3b82f640'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1e40af',
                    marginBottom: '12px'
                  }}>
                    📏 Race Distance (meters)
                  </label>
                  <input
                    type="number"
                    value={raceDistance}
                    onChange={(e) => setRaceDistance(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      border: '2px solid #3b82f6',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}
                  />
                </div>

                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
                  borderRadius: '16px',
                  border: '2px solid #ef444440'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#dc2626',
                    marginBottom: '12px'
                  }}>
                    🏃 Racer 1 Speed (m/s)
                  </label>
                  <input
                    type="number"
                    value={racer1Speed}
                    onChange={(e) => setRacer1Speed(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      border: '2px solid #ef4444',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}
                  />
                </div>

                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                  borderRadius: '16px',
                  border: '2px solid #10b98140'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#059669',
                    marginBottom: '12px'
                  }}>
                    🏃 Racer 2 Speed (m/s)
                  </label>
                  <input
                    type="number"
                    value={racer2Speed}
                    onChange={(e) => setRacer2Speed(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      border: '2px solid #10b981',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={runRace}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  marginBottom: '32px',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                }}
              >
                🚀 Start Race!
              </button>

              {raceResult && (
                <div style={{
                  padding: '32px',
                  background: raceResult.winner === 1 
                    ? 'linear-gradient(135deg, #FEE2E2, #FECACA)' 
                    : 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                  borderRadius: '20px',
                  border: `4px solid ${raceResult.winner === 1 ? '#ef4444' : '#10b981'}`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                  <h3 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: raceResult.winner === 1 ? '#dc2626' : '#059669',
                    marginBottom: '16px'
                  }}>
                    Racer {raceResult.winner} Wins!
                  </h3>
                  <div style={{
                    fontSize: '18px',
                    color: '#374151',
                    marginBottom: '24px'
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      🏃 Racer 1 finished in <strong>{raceResult.time1.toFixed(2)} seconds</strong>
                    </div>
                    <div>
                      🏃 Racer 2 finished in <strong>{raceResult.time2.toFixed(2)} seconds</strong>
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: '#6B7280'
                  }}>
                    💡 <strong>Why?</strong> Racer {raceResult.winner} had a higher speed, so they covered the same distance in less time!
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity 1: Distance Calculator */}
          {activeActivity === 1 && (
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>
                📏 Distance Calculator
              </h2>
              <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.7' }}>
                Use the formula: Distance = Speed × Time to calculate how far you can travel
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '24px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '10px'
                  }}>
                    ⚡ Speed (km/h)
                  </label>
                  <input
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="Enter speed"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '18px',
                      border: '2px solid #10b981',
                      borderRadius: '12px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '10px'
                  }}>
                    ⏱️ Time (hours)
                  </label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Enter time"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '18px',
                      border: '2px solid #10b981',
                      borderRadius: '12px'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={calculateDistance}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  marginBottom: '32px',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
                }}
              >
                🧮 Calculate Distance
              </button>

              {calculatedDistance !== null && (
                <div style={{
                  padding: '36px',
                  background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                  borderRadius: '20px',
                  border: '4px solid #10b981',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '18px', color: '#059669', marginBottom: '12px', fontWeight: '600' }}>
                    📏 Distance Traveled
                  </div>
                  <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#059669', marginBottom: '16px' }}>
                    {calculatedDistance.toFixed(2)} km
                  </div>
                  <div style={{
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: '#6B7280'
                  }}>
                    💡 At {speed} km/h for {time} hours, you would travel {calculatedDistance.toFixed(2)} kilometers!
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity 2: Unit Converter */}
          {activeActivity === 2 && (
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>
                🔄 Unit Converter
              </h2>
              <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.7' }}>
                Convert between metres per second (m/s) and kilometres per hour (km/h)
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '10px'
                }}>
                  Convert from:
                </label>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setConvertFrom('ms')}
                    style={{
                      flex: 1,
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: convertFrom === 'ms' ? 'white' : '#374151',
                      background: convertFrom === 'ms' ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'white',
                      border: convertFrom === 'ms' ? 'none' : '2px solid #E5E7EB',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    m/s → km/h
                  </button>
                  <button
                    onClick={() => setConvertFrom('kmh')}
                    style={{
                      flex: 1,
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: convertFrom === 'kmh' ? 'white' : '#374151',
                      background: convertFrom === 'kmh' ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'white',
                      border: convertFrom === 'kmh' ? 'none' : '2px solid #E5E7EB',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    km/h → m/s
                  </button>
                </div>

                <label style={{
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '10px'
                }}>
                  Value to convert:
                </label>
                <input
                  type="number"
                  value={convertValue}
                  onChange={(e) => setConvertValue(e.target.value)}
                  placeholder={`Enter value in ${convertFrom === 'ms' ? 'm/s' : 'km/h'}`}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '18px',
                    border: '2px solid #8b5cf6',
                    borderRadius: '12px',
                    marginBottom: '20px'
                  }}
                />
              </div>

              <button
                onClick={convertUnit}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  marginBottom: '32px',
                  boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
                }}
              >
                🔄 Convert
              </button>

              {convertedValue !== null && (
                <div style={{
                  padding: '36px',
                  background: 'linear-gradient(135deg, #E9D5FF, #D8B4FE)',
                  borderRadius: '20px',
                  border: '4px solid #8b5cf6',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
                  <div style={{ fontSize: '24px', color: '#6b21a8', marginBottom: '12px', fontWeight: '600' }}>
                    {convertValue} {convertFrom === 'ms' ? 'm/s' : 'km/h'} =
                  </div>
                  <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#6b21a8', marginBottom: '16px' }}>
                    {convertedValue.toFixed(2)} {convertFrom === 'ms' ? 'km/h' : 'm/s'}
                  </div>
                  <div style={{
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: '#6B7280'
                  }}>
                    💡 Remember: {convertFrom === 'ms' ? 'Multiply by 3.6 to convert m/s to km/h' : 'Divide by 3.6 to convert km/h to m/s'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity 3: Speed Comparison */}
          {activeActivity === 3 && (
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>
                ⚖️ Speed Comparison
              </h2>
              <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.7' }}>
                Compare the speeds of any two objects and see which is faster!
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '28px',
                  background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                  borderRadius: '20px',
                  border: '3px solid #f59e0b60'
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400e', marginBottom: '20px' }}>
                    First Object
                  </h3>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#78350f',
                    marginBottom: '8px'
                  }}>
                    Object Name
                  </label>
                  <input
                    type="text"
                    value={object1}
                    onChange={(e) => setObject1(e.target.value)}
                    placeholder="e.g., Car"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '16px',
                      border: '2px solid #f59e0b',
                      borderRadius: '12px',
                      marginBottom: '16px'
                    }}
                  />
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#78350f',
                    marginBottom: '8px'
                  }}>
                    Speed (km/h)
                  </label>
                  <input
                    type="number"
                    value={speed1}
                    onChange={(e) => setSpeed1(e.target.value)}
                    placeholder="Enter speed"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '16px',
                      border: '2px solid #f59e0b',
                      borderRadius: '12px'
                    }}
                  />
                </div>

                <div style={{
                  padding: '28px',
                  background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
                  borderRadius: '20px',
                  border: '3px solid #3b82f660'
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af', marginBottom: '20px' }}>
                    Second Object
                  </h3>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e3a8a',
                    marginBottom: '8px'
                  }}>
                    Object Name
                  </label>
                  <input
                    type="text"
                    value={object2}
                    onChange={(e) => setObject2(e.target.value)}
                    placeholder="e.g., Bicycle"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '16px',
                      border: '2px solid #3b82f6',
                      borderRadius: '12px',
                      marginBottom: '16px'
                    }}
                  />
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e3a8a',
                    marginBottom: '8px'
                  }}>
                    Speed (km/h)
                  </label>
                  <input
                    type="number"
                    value={speed2}
                    onChange={(e) => setSpeed2(e.target.value)}
                    placeholder="Enter speed"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '16px',
                      border: '2px solid #3b82f6',
                      borderRadius: '12px'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={compareObjects}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  marginBottom: '32px',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)'
                }}
              >
                ⚖️ Compare Speeds
              </button>

              {comparison && (
                <div style={{
                  padding: '36px',
                  background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                  borderRadius: '20px',
                  border: '4px solid #10b981',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginBottom: '20px' }}>
                    {comparison}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginTop: '24px'
                  }}>
                    <div style={{
                      padding: '16px',
                      background: 'white',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '6px' }}>
                        {object1}
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
                        {speed1} km/h
                      </div>
                    </div>
                    <div style={{
                      padding: '16px',
                      background: 'white',
                      borderRadius: '12px'
                    }}>
                      <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '6px' }}>
                        {object2}
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
                        {speed2} km/h
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Real World Application Mode - Blue Theme
const RealWorldMode: React.FC = () => {
  const { t } = useLanguage();
  const items = [
    { name: t('speed.snail'), speed: 0.05, icon: '🐌', color: '#ef4444', desc: t('speed.snail.desc') },
    { name: t('speed.walking'), speed: 5, icon: '🚶', color: '#f59e0b', desc: t('speed.walking.desc') },
    { name: t('speed.running'), speed: 10, icon: '🏃', color: '#eab308', desc: t('speed.running.desc') },
    { name: t('speed.cycling'), speed: 20, icon: '🚴', color: '#84cc16', desc: t('speed.cycling.desc') },
    { name: t('speed.car'), speed: 60, icon: '🚗', color: '#10b981', desc: t('speed.car.desc') },
    { name: t('speed.train'), speed: 120, icon: '🚄', color: '#06b6d4', desc: t('speed.train.desc') },
    { name: t('speed.bullettrain'), speed: 300, icon: '🚅', color: '#3b82f6', desc: t('speed.bullettrain.desc') },
    { name: t('speed.airplane'), speed: 900, icon: '✈️', color: '#8b5cf6', desc: t('speed.airplane.desc') },
    { name: t('speed.rocket'), speed: 28000, icon: '🚀', color: '#ec4899', desc: t('speed.rocket.desc') },
    { name: t('speed.light'), speed: 1080000000, icon: '💡', color: '#f97316', desc: t('speed.light.desc') },
  ];

  const maxSpeed = Math.max(...items.map(i => i.speed));

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(to bottom, #EFF6FF, #FFFFFF)',
      padding: '16px', paddingTop: '90px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero - Blue Theme */}
        <div style={{
          textAlign: 'center', marginBottom: '50px', padding: '55px 40px',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          borderRadius: '28px', color: 'white',
          boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '18px' }}>🌍</div>
          <h1 style={{ fontSize: '52px', fontWeight: 'bold', marginBottom: '18px', textShadow: '0 2px 4px rgba(0,0,0,0.15)', letterSpacing: '-0.5px' }}>
            {t('realworld.hero.title')}
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
            {t('realworld.hero.subtitle')}
          </p>
        </div>

        {/* Speed Comparison Cards - Wider Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '28px',
          marginBottom: '50px'
        }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `3px solid ${item.color}20`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 24px 48px ${item.color}35`;
                e.currentTarget.style.border = `3px solid ${item.color}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.border = `3px solid ${item.color}20`;
              }}
            >
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${item.color}25, ${item.color}10)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '52px',
                marginBottom: '22px',
                border: `4px solid ${item.color}30`,
                boxShadow: `0 4px 16px ${item.color}20`
              }}>
                {item.icon}
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '10px'
              }}>
                {item.name}
              </h3>
              
              <p style={{
                fontSize: '15px',
                color: '#6B7280',
                marginBottom: '18px',
                lineHeight: '1.6'
              }}>
                {item.desc}
              </p>
              
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: item.color,
                marginBottom: '14px'
              }}>
                {item.speed >= 1000000 
                  ? `${(item.speed / 1000000).toFixed(0)}M` 
                  : item.speed >= 1000 
                  ? `${(item.speed / 1000).toFixed(0)}K` 
                  : item.speed} km/h
              </div>
              
              <div style={{
                height: '10px',
                background: '#F3F4F6',
                borderRadius: '5px',
                overflow: 'hidden',
                marginTop: '14px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(Math.log10(item.speed + 1) / Math.log10(maxSpeed + 1)) * 100}%`,
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                  borderRadius: '5px',
                  transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Fun Facts Section */}
        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '48px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '2px solid #E5E7EB'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '12px'
            }}>
              {t('realworld.facts.title')}
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>
              {t('realworld.facts.subtitle')}
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {[
              {
                icon: '🏃',
                title: t('speed.usain'),
                fact: t('realworld.fact.usain'),
                color: '#eab308'
              },
              {
                icon: '🐆',
                title: t('speed.cheetah'),
                fact: t('realworld.fact.cheetah'),
                color: '#f59e0b'
              },
              {
                icon: '🦅',
                title: t('speed.falcon'),
                fact: t('realworld.fact.falcon'),
                color: '#06b6d4'
              },
              {
                icon: '🚄',
                title: t('speed.shinkansen'),
                fact: t('realworld.fact.train'),
                color: '#3b82f6'
              },
              {
                icon: '🌍',
                title: t('speed.earth'),
                fact: t('realworld.fact.earth'),
                color: '#10b981'
              },
              {
                icon: '🌟',
                title: t('speed.sound'),
                fact: t('realworld.fact.sound'),
                color: '#8b5cf6'
              },
            ].map((fact, idx) => (
              <div
                key={idx}
                style={{
                  padding: '28px',
                  background: `linear-gradient(135deg, ${fact.color}12, ${fact.color}06)`,
                  borderRadius: '20px',
                  border: `3px solid ${fact.color}25`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 16px 40px ${fact.color}25`;
                  e.currentTarget.style.border = `3px solid ${fact.color}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.border = `3px solid ${fact.color}25`;
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>{fact.icon}</div>
                <h4 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  marginBottom: '10px'
                }}>
                  {fact.title}
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4B5563',
                  lineHeight: '1.7'
                }}>
                  {fact.fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export const SpeedAndMotion: React.FC = () => {
  const { currentMode } = useMode();
  return (
    <>
      <Navbar />
      {currentMode === 'learn' && <LearnMode />}
      {currentMode === 'activity' && <ActivityMode />}
      {currentMode === 'realworld' && <RealWorldMode />}
    </>
  );
};

// App Wrapper
const SpeedAndMotionApp: React.FC = () => {
  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  
  * { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }
  
  body {
    overflow-x: hidden;
    background-color: #FFFFFF !important;
    font-family: 'Poppins', sans-serif !important;
  }
  
  button { 
    transition: all 0.3s ease; 
  }
  
  button:hover:not(:disabled) { 
    transform: translateY(-2px); 
  }
  
  button:active:not(:disabled) { 
    transform: translateY(0); 
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translate(-50%, -50%) translateY(0);
    }
    50% {
      transform: translate(-50%, -50%) translateY(-10px);
    }
  }
  
  @media (max-width: 768px) {
    h1 { font-size: 28px !important; }
    h2 { font-size: 24px !important; }
    h3 { font-size: 18px !important; }
    body { font-size: 14px !important; }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    h1 { font-size: 36px !important; }
    h2 { font-size: 28px !important; }
    h3 { font-size: 20px !important; }
  }
  
  /* Very small screens - Key Takeaways fix */
  @media (max-width: 532px) {
    .key-takeaways-section {
      padding: 20px !important;
      border-radius: 16px !important;
    }
    
    .takeaways-grid {
      gap: 14px !important;
    }
    
    .takeaway-card {
      padding: 16px !important;
    }
    
    .takeaway-card > div {
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
    }
    
    .takeaway-card div[style*="fontSize"] {
      font-size: 14px !important;
      line-height: 1.5 !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
    }
    
    .takeaway-card div[style*="textTransform"] {
      font-size: 11px !important;
    }
    
    h1 { font-size: 24px !important; }
    h2 { font-size: 20px !important; }
    h3 { font-size: 16px !important; }
  }
  
  /* Extra small screens */
  @media (max-width: 375px) {
    .key-takeaways-section {
      padding: 16px !important;
    }
    
    .takeaway-card {
      padding: 14px !important;
    }
    
    .takeaway-card div[style*="fontSize: '15px'"],
    .takeaway-card div[style*="fontSize: '18px'"] {
      font-size: 13px !important;
    }
    
    h1 { font-size: 22px !important; }
    h2 { font-size: 18px !important; }
    h3 { font-size: 15px !important; }
  }
`}</style>
      <LanguageProvider>
        <ModeProvider>
          <SpeedAndMotion />
        </ModeProvider>
      </LanguageProvider>
    </>
  );
};

export default SpeedAndMotionApp;