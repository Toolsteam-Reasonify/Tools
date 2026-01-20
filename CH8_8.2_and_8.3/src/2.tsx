/* eslint-disable react-refresh/only-export-components */
import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// Type Definitions
export type Language = 'en' | 'hi' | 'gu';
export type Mode = 'learn' | 'activity' | 'realworld';

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
    
    // Speed items names
    'speed.usain': 'Usain Bolt',
    'speed.cheetah': 'Cheetah',
    'speed.falcon': 'Peregrine Falcon',
    'speed.train': 'Bullet Train',
    'speed.earth': 'Earth\'s Rotation',
    'speed.sound': 'Sound Speed',
    
    // Speed facts
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
    'realworld.facts.subtitle': 'प्रकृति और प्रौद्योगिकी में चाल के बारे में अद्भुत तथ्य',
    
    // Speed items names
    'speed.usain': 'उसेन बोल्ट',
    'speed.cheetah': 'चीता',
    'speed.falcon': 'पेरेग्रीन फाल्कन',
    'speed.train': 'बुलेट ट्रेन',
    'speed.earth': 'पृथ्वी का घूर्णन',
    'speed.sound': 'ध्वनि की चाल',
    
    // Speed facts
    'realworld.fact.usain': 'सबसे तेज मानव धावक अपने 100 मीटर विश्व रिकॉर्ड के दौरान 44.72 किमी/घंटा की चाल तक पहुंचा!',
    'realworld.fact.cheetah': 'सबसे तेज भूमि जानवर कम समय में 120 किमी/घंटा तक की चाल तक पहुंच सकता है!',
    'realworld.fact.falcon': 'सबसे तेज पक्षी शिकार करते समय 380 किमी/घंटा से अधिक की चाल से गोता लगा सकता है!',
    'realworld.fact.train': 'जापान की शिंकानसेन 320 किमी/घंटा तक की चाल से यात्रा कर सकती है!',
    'realworld.fact.earth': 'पृथ्वी भूमध्य रेखा पर लगभग 1,670 किमी/घंटा की चाल से घूमती है, लेकिन हमें महसूस नहीं होता!',
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
    'learn.hero.title': 'ઝડપ અને ગતિને સમજવું',
    'learn.hero.subtitle': 'ઇન્ટરેક્ટિવ વિઝ્યુઅલ્સ અને વાસ્તવિક દુનિયાના ઉદાહરણો દ્વારા ઝડપની મૂળભૂત વિભાવનાઓ શીખો',
    'learn.intro.title': 'ઝડપ શું છે? 🤔',
    'learn.intro.content': 'ઝડપ માપે છે કે કોઈ વસ્તુ કેટલી ઝડપથી ચાલે છે। તે આપણને ચોક્કસ સમયમાં કાપેલું અંતર કહે છે। જ્યારે તમે સમાન અંતર મુસાફરી કરતી બે વસ્તુઓની સરખામણી કરો છો, તો જે ઓછો સમય લે છે તે વધુ ઝડપથી ચાલી રહી છે!',
    'learn.distance.label': 'અંતર',
    'learn.distance.desc': 'તમે કેટલું દૂર પ્રવાસ કરો છો',
    'learn.time.label': 'સમય',
    'learn.time.desc': 'તેમાં કેટલો સમય લાગે છે',
    'learn.speed.label': 'ઝડપ',
    'learn.speed.desc': 'અંતર ÷ સમય',
    
    // Concept Cards
    'card.formula.title': 'ઝડપનું સૂત્ર',
    'card.formula.desc': 'ઝડપની ગણતરી કાપેલા અંતરને લીધેલા સમયથી વિભાજિત કરીને કરવામાં આવે છે। તમે જેટલી ઝડપથી ચાલો છો, તમારી ઝડપ એટલી વધારે છે!',
    'card.formula.example': '100 મીટર ÷ 10 સેકન્ડ = 10 મી/સે',
    'card.unit.title': 'SI એકમ',
    'card.unit.desc': 'ઝડપને માપવા માટેનું માનક એકમ મીટર પ્રતિ સેકન્ડ (મી/સે) છે। આપણે સામાન્ય રીતે કિલોમીટર પ્રતિ કલાક (કિમી/કલાક) નો પણ ઉપયોગ કરીએ છીએ।',
    'card.unit.example': '1 મી/સે = 3.6 કિમી/કલાક',
    'card.conversion.title': 'એકમ રૂપાંતરણ',
    'card.conversion.desc': 'મી/સેને કિમી/કલાકમાં રૂપાંતરિત કરવા માટે, 3.6થી ગુણાકાર કરો। કિમી/કલાકને મી/સેમાં રૂપાંતરિત કરવા માટે, 3.6થી વિભાજન કરો।',
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
    'relationship.subtitle': 'આ ત્રણ રાશિઓનો સંબંધ જોવા માટે કોઈપણ વર્તુળ પર ક્લિક કરો',
    
    'formula.speed.title': 'ઝડપની ગણતરી',
    'formula.speed.formula': 'ઝડપ = અંતર ÷ સમય',
    'formula.speed.example': 'જો તમે 2 કલાકમાં 100 કિમી મુસાફરી કરો છો: ઝડપ = 100 ÷ 2 = 50 કિમી/કલાક',
    'formula.speed.explanation': 'ઝડપ કહે છે કે તમે કેટલી ઝડપથી ચાલી રહ્યા છો',
    
    'formula.distance.title': 'અંતરની ગણતરી',
    'formula.distance.formula': 'અંતર = ઝડપ × સમય',
    'formula.distance.example': '50 કિમી/કલાકે 2 કલાક માટે: અંતર = 50 × 2 = 100 કિમી',
    'formula.distance.explanation': 'અંતર કહે છે કે તમે કેટલું દૂર મુસાફરી કરો છો',
    
    'formula.time.title': 'સમયની ગણતરી',
    'formula.time.formula': 'સમય = અંતર ÷ ઝડપ',
    'formula.time.example': '50 કિમી/કલાકે 100 કિમી મુસાફરી કરવા માટે: સમય = 100 ÷ 50 = 2 કલાક',
    'formula.time.explanation': 'સમય કહે છે કે તમારી મુસાફરીમાં કેટલો સમય લાગે છે',
    
    // Activity Mode
    'activity.hero.title': 'ઇન્ટરએક્ટિવ પ્રવૃત્તિઓ',
    'activity.hero.subtitle': 'કરીને શીખો! ઝડપની વિભાવનાઓમાં નિપુણતા મેળવવા માટે આ વ્યવહારુ પ્રવૃત્તિઓ અજમાવો',
    'activity.1.title': '🏁 ઝડપ રેસ સિમ્યુલેટર',
    'activity.1.desc': 'વિવિધ ઝડપ ધરાવતા બે દોડવીરોની તુલના કરો અને જુઓ કે કોણ જીતે છે!',
    'activity.2.title': '📏 અંતર કેલ્ક્યુલેટર',
    'activity.2.desc': 'આપેલી ઝડપ અને સમયે તમે કેટલું દૂર મુસાફરી કરી શકો છો તેની ગણતરી કરો',
    'activity.3.title': '🔄 એકમ પરિવર્તક',
    'activity.3.desc': 'મી/સે અને કિમી/કલાક વચ્ચે તરત જ રૂપાંતરણ કરો',
    'activity.4.title': '⚖️ ઝડપ તુલના',
    'activity.4.desc': 'કોઈપણ બે વસ્તુઓની ઝડપની તુલના કરો',
    
    // Real World Mode
    'realworld.hero.title': 'વાસ્તવિક દુનિયાના ઉપયોગો',
    'realworld.hero.subtitle': 'જાણો કે ઝડપ આપણી આસપાસની રોજિંદી વસ્તુઓ પર કેવી રીતે લાગુ પડે છે',
    'realworld.facts.title': 'રસપ્રદ ઝડપ તથ્યો',
    'realworld.facts.subtitle': 'પ્રકૃતિ અને ટેકનોલોજીમાં ઝડપ વિશે આશ્ચર્યજનક તથ્યો',
    
    // Speed items names
    'speed.usain': 'ઉસેઇન બોલ્ટ',
    'speed.cheetah': 'ચિતો',
    'speed.falcon': 'પેરેગ્રિન ફાલ્કન',
    'speed.train': 'બુલેટ ટ્રેન',
    'speed.earth': 'પૃથ્વીનું પરિભ્રમણ',
    'speed.sound': 'ધ્વનિની ઝડપ',
    
    // Speed facts
    'realworld.fact.usain': 'સૌથી ઝડપી માનવ દોડવીર તેના 100 મીટર વિશ્વ રેકોર્ડ દરમિયાન 44.72 કિમી/કલાકની ઝડપે પહોંચ્યો!',
    'realworld.fact.cheetah': 'સૌથી ઝડપી ભૂમિ પ્રાણી ટૂંકા વિસ્ફોટમાં 120 કિમી/કલાક સુધીની ઝડપે પહોંચી શકે છે!',
    'realworld.fact.falcon': 'સૌથી ઝડપી પક્ષી શિકાર કરતી વખતે 380 કિમી/કલાકથી વધુની ઝડપે ડૂબકી મારી શકે છે!',
    'realworld.fact.train': 'જાપાનની શિંકાનસેન 320 કિમી/કલાક સુધીની ઝડપે મુસાફરી કરી શકે છે!',
    'realworld.fact.earth': 'પૃથ્વી વિષુવવૃત્ત પર લગભગ 1,670 કિમી/કલાકની ઝડપે ફરે છે, પરંતુ આપણે તેને અનુભવતા નથી!',
    'realworld.fact.sound': 'ધ્વનિ સમુદ્ર સપાટી પર હવા દ્વારા લગભગ 1,235 કિમી/કલાકની ઝડપે મુસાફરી કરે છે!',
    
    'common.example': 'ઉદાહરણ',
    'common.exampleLabel': 'ઉદાહરણ:',
  },
};

// Context
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
} | null>(null);

const ModeContext = createContext<{
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
} | null>(null);

// Language Provider
const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('gu');
  
  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Mode Provider
const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<Mode>('learn');
  
  return (
    <ModeContext.Provider value={{ currentMode, setCurrentMode }}>
      {children}
    </ModeContext.Provider>
  );
};

// Hooks
const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within ModeProvider');
  return context;
};

// Navbar Component
const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentMode, setCurrentMode } = useMode();
  
  const modes: { key: Mode; icon: string }[] = [
    { key: 'learn', icon: '📚' },
    { key: 'activity', icon: '🎯' },
    { key: 'realworld', icon: '🌍' },
  ];
  
  return (
    <nav style={{
      padding: '24px 48px',
      background: 'white',
      borderBottom: '2px solid #E5E7EB',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '32px' }}>⚡</span>
        <h1 style={{
          fontSize: '26px',
          fontWeight: 'bold',
          color: '#1F2937',
          margin: 0
        }}>
          {t('nav.logo')}
        </h1>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setCurrentMode(mode.key)}
            style={{
              padding: '12px 24px',
              background: currentMode === mode.key 
                ? 'linear-gradient(135deg, #3B82F6, #2563EB)' 
                : 'white',
              color: currentMode === mode.key ? 'white' : '#4B5563',
              border: currentMode === mode.key ? 'none' : '2px solid #E5E7EB',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: currentMode === mode.key 
                ? '0 4px 14px rgba(59, 130, 246, 0.3)' 
                : 'none'
            }}
          >
            <span>{mode.icon}</span>
            {t(`nav.${mode.key}`)}
          </button>
        ))}
        
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            padding: '12px 16px',
            background: 'white',
            border: '2px solid #E5E7EB',
            borderRadius: '14px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#1F2937',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="en">IN English</option>
          <option value="hi">IN हिन्दी</option>
          <option value="gu">IN ગુજરાતી</option>
        </select>
      </div>
    </nav>
  );
};

// Learn Mode Component
const LearnMode: React.FC = () => {
  const { t } = useLanguage();
  const [selectedConcept, setSelectedConcept] = useState<'speed' | 'distance' | 'time' | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
      padding: '60px 48px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '48px',
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          borderRadius: '28px',
          boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            {t('learn.hero.title')}
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.95 }}>
            {t('learn.hero.subtitle')}
          </p>
        </div>

        {/* Introduction Card */}
        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '48px',
          marginBottom: '48px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '2px solid #E5E7EB'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '20px'
          }}>
            {t('learn.intro.title')}
          </h2>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.8',
            color: '#4B5563'
          }}>
            {t('learn.intro.content')}
          </p>
        </div>

        {/* Concept Visualization */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          marginBottom: '48px'
        }}>
          {[
            { key: 'distance', icon: '📏', color: '#3B82F6' },
            { key: 'time', icon: '⏱️', color: '#8B5CF6' },
            { key: 'speed', icon: '⚡', color: '#10B981' }
          ].map((item) => (
            <div
              key={item.key}
              style={{
                background: `linear-gradient(135deg, ${item.color}15, ${item.color}08)`,
                borderRadius: '24px',
                padding: '36px',
                border: `3px solid ${item.color}30`,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 16px 40px ${item.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '12px'
              }}>
                {t(`learn.${item.key}.label`)}
              </h3>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>
                {t(`learn.${item.key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Concept Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px',
          marginBottom: '48px'
        }}>
          {[
            { key: 'formula', icon: '📐', color: '#E0E7FF' },
            { key: 'unit', icon: '📊', color: '#DBEAFE' },
            { key: 'conversion', icon: '🔄', color: '#D1FAE5' }
          ].map((card) => (
            <div
              key={card.key}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '36px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                border: '2px solid #E5E7EB',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: card.color,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '20px'
              }}>
                {card.icon}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '12px'
              }}>
                {t(`card.${card.key}.title`)}
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#6B7280',
                marginBottom: '20px'
              }}>
                {t(`card.${card.key}.desc`)}
              </p>
              <div style={{
                background: '#F9FAFB',
                borderRadius: '12px',
                padding: '16px',
                border: '2px solid #E5E7EB'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#3B82F6',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {t('common.exampleLabel')}
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '15px',
                  color: '#1F2937',
                  fontWeight: '600'
                }}>
                  {t(`card.${card.key}.example`)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Relationship Section */}
        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '48px',
          marginBottom: '48px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '2px solid #E5E7EB'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '12px'
            }}>
              {t('relationship.title')}
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>
              {t('relationship.subtitle')}
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}>
            {[
              { key: 'speed', icon: '⚡', color: '#10B981' },
              { key: 'distance', icon: '📏', color: '#3B82F6' },
              { key: 'time', icon: '⏱️', color: '#8B5CF6' }
            ].map((concept) => (
              <button
                key={concept.key}
                onClick={() => setSelectedConcept(concept.key as 'speed' | 'distance' | 'time')}
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: selectedConcept === concept.key
                    ? `linear-gradient(135deg, ${concept.color}, ${concept.color}dd)`
                    : `linear-gradient(135deg, ${concept.color}20, ${concept.color}10)`,
                  border: `4px solid ${selectedConcept === concept.key ? concept.color : `${concept.color}40`}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: selectedConcept === concept.key ? 'white' : '#1F2937',
                  fontSize: '18px',
                  fontWeight: '600',
                  boxShadow: selectedConcept === concept.key 
                    ? `0 8px 30px ${concept.color}50` 
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedConcept !== concept.key) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = `0 8px 30px ${concept.color}30`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedConcept !== concept.key) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <span style={{ fontSize: '48px' }}>{concept.icon}</span>
                <span>{t(`concept.${concept.key}`)}</span>
              </button>
            ))}
          </div>

          {selectedConcept && (
            <div style={{
              background: `linear-gradient(135deg, ${
                selectedConcept === 'speed' ? '#10B98115' : 
                selectedConcept === 'distance' ? '#3B82F615' : '#8B5CF615'
              }, ${
                selectedConcept === 'speed' ? '#10B98108' : 
                selectedConcept === 'distance' ? '#3B82F608' : '#8B5CF608'
              })`,
              borderRadius: '20px',
              padding: '32px',
              border: `3px solid ${
                selectedConcept === 'speed' ? '#10B98130' : 
                selectedConcept === 'distance' ? '#3B82F630' : '#8B5CF630'
              }`,
              animation: 'fadeIn 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '16px'
              }}>
                {t(`formula.${selectedConcept}.title`)}
              </h3>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                border: '2px solid #E5E7EB'
              }}>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  textAlign: 'center'
                }}>
                  {t(`formula.${selectedConcept}.formula`)}
                </div>
              </div>
              <p style={{
                fontSize: '16px',
                color: '#4B5563',
                marginBottom: '12px',
                lineHeight: '1.7'
              }}>
                {t(`formula.${selectedConcept}.explanation`)}
              </p>
              <div style={{
                background: '#F9FAFB',
                borderRadius: '12px',
                padding: '16px',
                border: '2px solid #E5E7EB'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#3B82F6',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {t('common.exampleLabel')}
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#1F2937',
                  lineHeight: '1.6'
                }}>
                  {t(`formula.${selectedConcept}.example`)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Key Takeaways */}
        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '48px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '2px solid #E5E7EB'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💡</div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '12px'
            }}>
              {t('takeaway.title')}
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>
              {t('takeaway.subtitle')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              { key: 'formula', icon: '📐', color: '#E0E7FF', borderColor: '#818CF8' },
              { key: 'unit', icon: '📊', color: '#DBEAFE', borderColor: '#60A5FA' },
              { key: 'concept', icon: '💡', color: '#D1FAE5', borderColor: '#34D399' },
              { key: 'conversion', icon: '🔄', color: '#FEE2E2', borderColor: '#F87171' }
            ].map((item) => (
              <div
                key={item.key}
                style={{
                  background: item.color,
                  borderRadius: '20px',
                  padding: '28px',
                  border: `3px solid ${item.borderColor}`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 12px 30px ${item.borderColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '40px',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#6B7280',
                  marginBottom: '8px',
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}>
                  {t(`takeaway.${item.key}.title`)}
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  {t(`takeaway.${item.key}.text`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Activity Mode Component  
const ActivityMode: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      padding: '60px 48px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '48px',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          borderRadius: '28px',
          boxShadow: '0 20px 60px rgba(245, 158, 11, 0.3)',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            {t('activity.hero.title')}
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.95 }}>
            {t('activity.hero.subtitle')}
          </p>
        </div>

        {/* Activities Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px'
        }}>
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '36px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                border: '2px solid #E5E7EB',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
              }}
            >
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '12px'
              }}>
                {t(`activity.${num}.title`)}
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#6B7280'
              }}>
                {t(`activity.${num}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Real World Mode Component
const RealWorldMode: React.FC = () => {
  const { t } = useLanguage();

  const speedItems = useMemo(() => [
    { name: t('speed.usain'), speed: 44.72, icon: '🏃', color: '#eab308' },
    { name: t('speed.cheetah'), speed: 120, icon: '🐆', color: '#f59e0b' },
    { name: t('speed.falcon'), speed: 380, icon: '🦅', color: '#06b6d4' },
    { name: t('speed.train'), speed: 320, icon: '🚄', color: '#3b82f6' },
    { name: t('speed.earth'), speed: 1670, icon: '🌍', color: '#10b981' },
    { name: t('speed.sound'), speed: 1235, icon: '🌟', color: '#8b5cf6' },
  ], [t]);

  const maxSpeed = Math.max(...speedItems.map(item => item.speed));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
      padding: '60px 48px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '48px',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          borderRadius: '28px',
          boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            {t('realworld.hero.title')}
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.95 }}>
            {t('realworld.hero.subtitle')}
          </p>
        </div>

        {/* Speed Comparison Section */}
        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '48px',
          marginBottom: '48px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '2px solid #E5E7EB'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
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

          {speedItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '28px',
                padding: '24px',
                background: `linear-gradient(135deg, ${item.color}12, ${item.color}05)`,
                borderRadius: '18px',
                border: `2px solid ${item.color}30`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '14px'
              }}>
                <span style={{ fontSize: '42px' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1F2937'
                  }}>
                    {item.name}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '26px',
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
                titleKey: 'speed.usain',
                factKey: 'realworld.fact.usain',
                color: '#eab308'
              },
              {
                icon: '🐆',
                titleKey: 'speed.cheetah',
                factKey: 'realworld.fact.cheetah',
                color: '#f59e0b'
              },
              {
                icon: '🦅',
                titleKey: 'speed.falcon',
                factKey: 'realworld.fact.falcon',
                color: '#06b6d4'
              },
              {
                icon: '🚄',
                titleKey: 'speed.train',
                factKey: 'realworld.fact.train',
                color: '#3b82f6'
              },
              {
                icon: '🌍',
                titleKey: 'speed.earth',
                factKey: 'realworld.fact.earth',
                color: '#10b981'
              },
              {
                icon: '🌟',
                titleKey: 'speed.sound',
                factKey: 'realworld.fact.sound',
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
                  {t(fact.titleKey)}
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#4B5563',
                  lineHeight: '1.7'
                }}>
                  {t(fact.factKey)}
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          overflow-x: hidden;
          background-color: #FFFFFF !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        button { transition: all 0.3s ease; }
        button:hover:not(:disabled) { transform: translateY(-2px); }
        button:active:not(:disabled) { transform: translateY(0); }
        @media (max-width: 768px) {
          h1 { font-size: 32px !important; }
          h2 { font-size: 22px !important; }
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