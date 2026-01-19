import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi' | 'gu';
  setLanguage: (lang: 'en' | 'hi' | 'gu') => void;
  t: (key: string) => string;
  isTransitioning: boolean;
  localizeDigitsInText: (text: string) => string;
  formatNumber: (num: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    standardFormTitle: 'Standard Form',
    realWorldNav: 'Real World',
    learn: 'Learn',
    practice: 'Practice',
    langEnglish: 'English',
    langHindi: 'Hindi',
    langGujarati: 'Gujarati',
    sf_title: '11.6 Standard Form',
    sf_intro: 'Standard form is a way to write any number as a decimal between 1.0 and 10.0 multiplied by a power of 10.',
    sf_why_title: 'Why Use Standard Form?',
    sf_why_body: 'Large numbers like the distance of the Sun from the center of the Milky Way Galaxy (300,000,000,000,000,000,000 m) are not convenient to write and read. We use powers to make them manageable.',
    sf_hard_to_read: 'Hard to Read',
    sf_big_example: '300,000,000,000,000,000,000',
    sf_std_form: 'Easy to Read',
    sf_std_form_example: '3.0 × 10²⁰',
    sf_benefits_title: 'Benefits of Standard Form:',
    sf_benefit1: 'Makes large numbers easier to read, understand, and compare',
    sf_benefit2: 'Helps quickly compare magnitudes by looking at the exponent',
    sf_benefit3: 'Compact to write',
    sf_benefit4: 'Used universally in science, engineering, and astronomy',
    sf_convert_title: 'How to Convert a Number to Standard Form',
    sf_convert_body: 'Move the decimal point so you have a number between 1.0 and 10.0. The exponent of 10 is the number of digits left of the decimal minus 1.',
    sf_reset: 'Reset',
    sf_rule_hint: 'Quick Rule:',
    sf_rule_full: 'The exponent of 10 is one less than the number of digits left of the decimal point.',
    sf_step1: 'Start With Large Number',
    sf_example1: '5,985',
    sf_step1exp: 'Identify your number. For example: 5,985.',
    sf_step2: 'Move Decimal',
    sf_example2: '5.985',
    sf_step2exp: 'Move the decimal so a number between 1.0 and 10.0 remains: Here, 5.985.',
    sf_step3: 'Count Decimal Moves',
    sf_example3: '3 moves',
    sf_step3exp: 'Count how many digits you moved the decimal: 3 places in this case.',
    sf_step4: 'Write in Standard Form',
    sf_example4: '5.985 × 10³',
    sf_step4exp: 'Express as: (coefficient) × 10^(number of moves).',
    sf_show_steps: 'Show Steps',
    sf_rules_examples_title: 'Standard Form Rules & More Examples',
    sf_rules_examples_body: 'The coefficient must be between 1.0 and 10.0 (including 1.0)',
    sf_show_more_examples: 'Show More Examples',
    sf_hide_examples: 'Hide Examples',
    sf_examples: 'Examples:',
    sf_example_5985: '5,985 =',
    sf_example_5985_sf: '5.985 × 10³',
    sf_example_59000: '59,000 =',
    sf_example_59000_sf: '5.9 × 10⁴',
    sf_example_galaxy_dist: 'Distance Galaxy =',
    sf_example_galaxy_dist_sf: '3.0 × 10²⁰ m',
    sf_example_earth_mass: 'Earth Mass =',
    sf_example_earth_mass_sf: '5.976 × 10²⁴ kg',
    sf_example_uranus_mass: 'Uranus Mass =',
    sf_example_uranus_mass_sf: '8.68 × 10²⁵ kg',
    sf_example_neptune_mass: 'Neptune Mass =',
    sf_example_neptune_mass_sf: '1.024 × 10²⁶ kg',
    sf_rules_examples_hint: 'Standard form is widely used in science and mathematics!',
    sf_rules_examples_full: '(a × 10ⁿ), 1 ≤ a < 10, n is integer',
    
    // Practice Mode Translations
    practice_title: 'Practice: Standard Form',
    practice_question_x_of_y: 'Question',
    practice_complete: 'Quiz Complete!',
    practice_finished: 'You have finished all questions. Review your answers, or try again!',
    practice_try_again: 'Try Again',
    practice_loading: 'Loading questions...',
    practice_total: 'Total Questions',
    practice_correct: 'Correct!',
    practice_incorrect: 'Incorrect',
    practice_correct_count: 'Correct',
    practice_incorrect_count: 'Incorrect',
    practice_skipped_count: 'Skipped',
    practice_final_grade: 'Final Grade',
    practice_accuracy_rate: 'Accuracy Rate',
    practice_avg_time: 'Avg Time/Question',
    practice_solution: 'Solution:',
    practice_show_solution: 'Show Solution',
    practice_hide_solution: 'Hide Solution',
    practice_previous: 'Previous',
    practice_next: 'Next',
    practice_skip: 'Skip',
    practice_question: 'Question',
    
    // Exercise Questions - Standard Form
    practice_q1_prompt: 'Convert 7,200,000 to standard form.',
    practice_q1_explanation: 'Move the decimal point 6 places to get 7.2. So, 7,200,000 = 7.2 × 10⁶.',
    practice_q2_prompt: 'Convert 0.00045 to standard form.',
    practice_q2_explanation: 'Move the decimal 4 places right to get 4.5, so 0.00045 = 4.5 × 10⁻⁴.',
    practice_q3_prompt: 'Convert 93,000,000,000 to standard form.',
    practice_q3_explanation: 'Move the decimal 10 places left to get 9.3, so 93,000,000,000 = 9.3 × 10¹⁰.',
    practice_q4_prompt: 'Convert 0.00000082 to standard form.',
    practice_q4_explanation: 'Move the decimal 7 places right to get 8.2, so 0.00000082 = 8.2 × 10⁻⁷.',
    practice_q5_prompt: 'Convert 54,600,000,000,000 to standard form.',
    practice_q5_explanation: 'Move the decimal 13 places left to get 5.46, so 54,600,000,000,000 = 5.46 × 10¹³.',
    practice_q6_prompt: 'Convert 0.00000000037 to standard form.',
    practice_q6_explanation: 'Move the decimal 10 places right to get 3.7, so 0.00000000037 = 3.7 × 10⁻¹⁰.',
  },
  hi: {
    standardFormTitle: 'मानक रूप',
    realWorldNav: 'रियल वर्ल्ड',
    learn: 'सीखें',
    practice: 'प्रैक्टिस',
    langEnglish: 'अंग्रेज़ी',
    langHindi: 'हिन्दी',
    langGujarati: 'गुजराती',
    // Standard Form Translations
    sf_title: '11.6 मानक रूप',
    sf_intro: 'मानक रूप किसी भी संख्या को 1.0 और 10.0 के बीच एक दशमलव के रूप में लिखने का एक तरीका है जिसे 10 की घात से गुणा किया जाता है।',
    sf_why_title: 'मानक रूप क्यों उपयोग करें?',
    sf_why_body: 'मिल्की वे आकाशगंगा के केंद्र से सूर्य की दूरी जैसी बड़ी संख्याएं (300,000,000,000,000,000,000 m) लिखना और पढ़ना सुविधाजनक नहीं है। हम उन्हें प्रबंधनीय बनाने के लिए घातों का उपयोग करते हैं।',
    sf_hard_to_read: 'पढ़ने में कठिन',
    sf_big_example: '300,000,000,000,000,000,000',
    sf_std_form: 'पढ़ने में आसान',
    sf_std_form_example: '3.0 × 10²⁰',
    sf_benefits_title: 'मानक रूप के लाभ:',
    sf_benefit1: 'बड़ी संख्याओं को पढ़ना, समझना और तुलना करना आसान बनाता है',
    sf_benefit2: 'घातांक को देखकर परिमाणों की तुलना करने में मदद करता है',
    sf_benefit3: 'लिखने में संक्षिप्त',
    sf_benefit4: 'विज्ञान, इंजीनियरिंग और खगोल विज्ञान में सार्वभौमिक रूप से उपयोग किया जाता है',
    sf_convert_title: 'एक संख्या को मानक रूप में कैसे बदलें',
    sf_convert_body: 'दशमलव बिंदु को इस तरह ले जाएं कि आपको 1.0 और 10.0 के बीच एक संख्या मिले। 10 का घातांक दशमलव के बाईं ओर अंकों की संख्या घटाकर 1 है।',
    sf_reset: 'रीसेट',
    sf_rule_hint: 'त्वरित नियम:',
    sf_rule_full: '10 का घातांक दशमलव बिंदु के बाईं ओर अंकों की संख्या से एक कम है।',
    sf_step1: 'बड़ी संख्या से शुरू करें',
    sf_example1: '5,985',
    sf_step1exp: 'अपनी संख्या की पहचान करें। उदाहरण के लिए: 5,985।',
    sf_step2: 'दशमलव ले जाएं',
    sf_example2: '5.985',
    sf_step2exp: 'दशमलव को इस तरह ले जाएं कि 1.0 और 10.0 के बीच एक संख्या रहे: यहाँ, 5.985।',
    sf_step3: 'दशमलव चालों की गिनती करें',
    sf_example3: '3 चालें',
    sf_step3exp: 'गिनें कि आपने दशमलव को कितने अंकों से ले जाया: इस मामले में 3 स्थान।',
    sf_step4: 'मानक रूप में लिखें',
    sf_example4: '5.985 × 10³',
    sf_step4exp: 'इस रूप में व्यक्त करें: (गुणांक) × 10^(चालों की संख्या)।',
    sf_show_steps: 'चरण दिखाएं',
    sf_rules_examples_title: 'मानक रूप नियम और अधिक उदाहरण',
    sf_rules_examples_body: 'गुणांक 1.0 और 10.0 के बीच होना चाहिए (1.0 सहित)',
    sf_show_more_examples: 'अधिक उदाहरण दिखाएं',
    sf_hide_examples: 'उदाहरण छुपाएं',
    sf_examples: 'उदाहरण:',
    sf_example_5985: '5,985 =',
    sf_example_5985_sf: '5.985 × 10³',
    sf_example_59000: '59,000 =',
    sf_example_59000_sf: '5.9 × 10⁴',
    sf_example_galaxy_dist: 'आकाशगंगा दूरी =',
    sf_example_galaxy_dist_sf: '3.0 × 10²⁰ m',
    sf_example_earth_mass: 'पृथ्वी का द्रव्यमान =',
    sf_example_earth_mass_sf: '5.976 × 10²⁴ kg',
    sf_example_uranus_mass: 'अरुण का द्रव्यमान =',
    sf_example_uranus_mass_sf: '8.68 × 10²⁵ kg',
    sf_example_neptune_mass: 'नेपच्यून का द्रव्यमान =',
    sf_example_neptune_mass_sf: '1.024 × 10²⁶ kg',
    sf_rules_examples_hint: 'मानक रूप का व्यापक रूप से विज्ञान और गणित में उपयोग किया जाता है!',
    sf_rules_examples_full: '(a × 10ⁿ), 1 ≤ a < 10, n एक पूर्णांक है',
    
    // Practice Mode Translations
    practice_title: 'अभ्यास: मानक रूप',
    practice_question_x_of_y: 'प्रश्न',
    practice_complete: 'क्विज़ पूर्ण!',
    practice_finished: 'आपने सभी प्रश्न पूरे कर लिए हैं। अपने उत्तरों की समीक्षा करें, या फिर से कोशिश करें!',
    practice_try_again: 'फिर से कोशिश करें',
    practice_loading: 'प्रश्न लोड हो रहे हैं...',
    practice_total: 'कुल प्रश्न',
    practice_correct: 'सही!',
    practice_incorrect: 'गलत',
    practice_correct_count: 'सही',
    practice_incorrect_count: 'गलत',
    practice_skipped_count: 'छोड़े गए',
    practice_final_grade: 'अंतिम ग्रेड',
    practice_accuracy_rate: 'सटीकता दर',
    practice_avg_time: 'प्रति प्रश्न औसत समय',
    practice_solution: 'समाधान:',
    practice_show_solution: 'समाधान दिखाएं',
    practice_hide_solution: 'समाधान छुपाएं',
    practice_previous: 'पिछला',
    practice_next: 'अगला',
    practice_skip: 'छोड़ें',
    practice_question: 'प्रश्न',
    
    // Exercise Questions - Standard Form
    practice_q1_prompt: '7,200,000 को मानक रूप में बदलें।',
    practice_q1_explanation: 'दशमलव बिंदु को 6 स्थानों पर ले जाकर 7.2 प्राप्त करें। इसलिए, 7,200,000 = 7.2 × 10⁶।',
    practice_q2_prompt: '0.00045 को मानक रूप में बदलें।',
    practice_q2_explanation: 'दशमलव को 4 स्थान दाईं ओर ले जाकर 4.5 प्राप्त करें, इसलिए 0.00045 = 4.5 × 10⁻⁴।',
    practice_q3_prompt: '93,000,000,000 को मानक रूप में बदलें।',
    practice_q3_explanation: 'दशमलव को 10 स्थान बाईं ओर ले जाकर 9.3 प्राप्त करें, इसलिए 93,000,000,000 = 9.3 × 10¹⁰।',
    practice_q4_prompt: '0.00000082 को मानक रूप में बदलें।',
    practice_q4_explanation: 'दशमलव को 7 स्थान दाईं ओर ले जाकर 8.2 प्राप्त करें, इसलिए 0.00000082 = 8.2 × 10⁻⁷।',
    practice_q5_prompt: '54,600,000,000,000 को मानक रूप में बदलें।',
    practice_q5_explanation: 'दशमलव को 13 स्थान बाईं ओर ले जाकर 5.46 प्राप्त करें, इसलिए 54,600,000,000,000 = 5.46 × 10¹³।',
    practice_q6_prompt: '0.00000000037 को मानक रूप में बदलें।',
    practice_q6_explanation: 'दशमलव को 10 स्थान दाईं ओर ले जाकर 3.7 प्राप्त करें, इसलिए 0.00000000037 = 3.7 × 10⁻¹⁰।',
  },
  gu: {
    standardFormTitle: 'ધોરીત રૂપ',
    realWorldNav: 'રિયલ વર્લ્ડ',
    learn: 'શીખો',
    practice: 'અભ્યાસ',
    langEnglish: 'અંગ્રેજી',
    langHindi: 'હિંડી',
    langGujarati: 'ગુજરાતી',
    // Standard Form Translations
    sf_title: '11.6 ધોરીત રૂપ',
    sf_intro: 'ધોરીત રૂપ કોઈપણ સંખ્યાને 1.0 અને 10.0 વચ્ચે દશાંશ તરીકે લખવાની એક રીત છે જેને 10 ની ઘાતથી ગુણાકાર કરવામાં આવે છે.',
    sf_why_title: 'ધોરીત રૂપ શા માટે ઉપયોગ કરો?',
    sf_why_body: 'મિલ્કી વે આકાશગંગાના કેન્દ્રથી સૂર્યની દૂરી જેવી મોટી સંખ્યાઓ (300,000,000,000,000,000,000 m) લખવા અને વાંચવા માટે સુવિધાજનક નથી. અમે તેમને વ્યવસ્થિત બનાવવા માટે ઘાતોનો ઉપયોગ કરીએ છીએ.',
    sf_hard_to_read: 'વાંચવા મુશ્કેલ',
    sf_big_example: '300,000,000,000,000,000,000',
    sf_std_form: 'વાંચવા સરળ',
    sf_std_form_example: '3.0 × 10²⁰',
    sf_benefits_title: 'ધોરીત રૂપના ફાયદા:',
    sf_benefit1: 'મોટી સંખ્યાઓ વાંચવા, સમજવા અને તુલના કરવા સરળ બનાવે છે',
    sf_benefit2: 'ઘાતાંક જોઈને પરિમાણોની ઝડપથી તુલના કરવામાં મદદ કરે છે',
    sf_benefit3: 'લખવા માટે સંક્ષિપ્ત',
    sf_benefit4: 'વિજ્ઞાન, ઇજનેરી અને ખગોળવિજ્ઞાનમાં સાર્વત્રિક રીતે ઉપયોગ થાય છે',
    sf_convert_title: 'સંખ્યાને ધોરીત રૂપમાં કેવી રીતે રૂપાંતરિત કરવી',
    sf_convert_body: 'દશાંશ બિંદુને આ રીતે લઈ જઈને કે તમારી પાસે 1.0 અને 10.0 વચ્ચેની સંખ્યા મળે. 10 નો ઘાતાંક દશાંશની ડાબી બાજુના અંકોની સંખ્યા ઓછા 1 છે.',
    sf_reset: 'રીસેટ',
    sf_rule_hint: 'ઝડપી નિયમ:',
    sf_rule_full: '10 નો ઘાતાંક દશાંશ બિંદુની ડાબી બાજુના અંકોની સંખ્યાથી એક ઓછો છે.',
    sf_step1: 'મોટી સંખ્યાથી શરૂ કરો',
    sf_example1: '5,985',
    sf_step1exp: 'તમારી સંખ્યાની ઓળખ કરો. ઉદાહરણ તરીકે: 5,985.',
    sf_step2: 'દશાંશ લઈ જાઓ',
    sf_example2: '5.985',
    sf_step2exp: 'દશાંશને આ રીતે લઈ જાઓ કે 1.0 અને 10.0 વચ્ચેની સંખ્યા રહે: અહીં, 5.985.',
    sf_step3: 'દશાંશ ચાલોની ગણતરી કરો',
    sf_example3: '3 ચાલો',
    sf_step3exp: 'ગણો કે તમે દશાંશને કેટલા અંકો લઈ ગયા: આ કિસ્સામાં 3 સ્થાનો.',
    sf_step4: 'ધોરીત રૂપમાં લખો',
    sf_example4: '5.985 × 10³',
    sf_step4exp: 'આ રીતે વ્યક્ત કરો: (ગુણાંક) × 10^(ચાલોની સંખ્યા).',
    sf_show_steps: 'પગલાં બતાવો',
    sf_rules_examples_title: 'ધોરીત રૂપ નિયમો અને વધુ ઉદાહરણો',
    sf_rules_examples_body: 'ગુણાંક 1.0 અને 10.0 વચ્ચે હોવો જોઈએ (1.0 સહિત)',
    sf_show_more_examples: 'વધુ ઉદાહરણો બતાવો',
    sf_hide_examples: 'ઉદાહરણો છુપાવો',
    sf_examples: 'ઉદાહરણો:',
    sf_example_5985: '5,985 =',
    sf_example_5985_sf: '5.985 × 10³',
    sf_example_59000: '59,000 =',
    sf_example_59000_sf: '5.9 × 10⁴',
    sf_example_galaxy_dist: 'આકાશગંગા દૂરી =',
    sf_example_galaxy_dist_sf: '3.0 × 10²⁰ m',
    sf_example_earth_mass: 'પૃથ્વીનું દળ =',
    sf_example_earth_mass_sf: '5.976 × 10²⁴ kg',
    sf_example_uranus_mass: 'યુરેનસનું દળ =',
    sf_example_uranus_mass_sf: '8.68 × 10²⁵ kg',
    sf_example_neptune_mass: 'નેપ્ચ્યુનનું દળ =',
    sf_example_neptune_mass_sf: '1.024 × 10²⁶ kg',
    sf_rules_examples_hint: 'ધોરીત રૂપનો વ્યાપક રીતે વિજ્ઞાન અને ગણિતમાં ઉપયોગ થાય છે!',
    sf_rules_examples_full: '(a × 10ⁿ), 1 ≤ a < 10, n પૂર્ણાંક છે',
    
    // Practice Mode Translations
    practice_title: 'અભ્યાસ: ધોરીત રૂપ',
    practice_question_x_of_y: 'પ્રશ્ન',
    practice_complete: 'ક્વિઝ પૂર્ણ!',
    practice_finished: 'તમે બધા પ્રશ્નો પૂરા કર્યા છે. તમારા જવાબોની સમીક્ષા કરો, અથવા ફરીથી પ્રયાસ કરો!',
    practice_try_again: 'ફરીથી પ્રયાસ કરો',
    practice_loading: 'પ્રશ્નો લોડ થઈ રહ્યા છે...',
    practice_total: 'કુલ પ્રશ્નો',
    practice_correct: 'સાચું!',
    practice_incorrect: 'ખોટું',
    practice_correct_count: 'સાચું',
    practice_incorrect_count: 'ખોટું',
    practice_skipped_count: 'છોડાયેલું',
    practice_final_grade: 'અંતિમ ગ્રેડ',
    practice_accuracy_rate: 'ચોકસાઈ દર',
    practice_avg_time: 'પ્રતિ પ્રશ્ન સરેરાશ સમય',
    practice_solution: 'ઉકેલ:',
    practice_show_solution: 'ઉકેલ બતાવો',
    practice_hide_solution: 'ઉકેલ છુપાવો',
    practice_previous: 'પાછલું',
    practice_next: 'આગળનું',
    practice_skip: 'છોડો',
    practice_question: 'પ્રશ્ન',
    
    // Exercise Questions - Standard Form
    practice_q1_prompt: '7,200,000 ને ધોરીત રૂપમાં રૂપાંતરિત કરો.',
    practice_q1_explanation: 'દશાંશ બિંદુને 6 સ્થાનો પર લઈ જઈને 7.2 મેળવો. તેથી, 7,200,000 = 7.2 × 10⁶.',
    practice_q2_prompt: '0.00045 ને ધોરીત રૂપમાં રૂપાંતરિત કરો.',
    practice_q2_explanation: 'દશાંશને 4 સ્થાન જમણી બાજુ લઈ જઈને 4.5 મેળવો, તેથી 0.00045 = 4.5 × 10⁻⁴.',
    practice_q3_prompt: '93,000,000,000 ને ધોરીત રૂપમાં રૂપાંતરિત કરો.',
    practice_q3_explanation: 'દશાંશને 10 સ્થાન ડાબી બાજુ લઈ જઈને 9.3 મેળવો, તેથી 93,000,000,000 = 9.3 × 10¹⁰.',
    practice_q4_prompt: '0.00000082 ને ધોરીત રૂપમાં રૂપાંતરિત કરો.',
    practice_q4_explanation: 'દશાંશને 7 સ્થાન જમણી બાજુ લઈ જઈને 8.2 મેળવો, તેથી 0.00000082 = 8.2 × 10⁻⁷.',
    practice_q5_prompt: '54,600,000,000,000 ને ધોરીત રૂપમાં રૂપાંતરિત કરો.',
    practice_q5_explanation: 'દશાંશને 13 સ્થાન ડાબી બાજુ લઈ જઈને 5.46 મેળવો, તેથી 54,600,000,000,000 = 5.46 × 10¹³.',
    practice_q6_prompt: '0.00000000037 ને ધોરીત રૂપમાં રૂપાંતરિત કરો.',
    practice_q6_explanation: 'દશાંશને 10 સ્થાન જમણી બાજુ લઈ જઈને 3.7 મેળવો, તેથી 0.00000000037 = 3.7 × 10⁻¹⁰.',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    // Load language from localStorage on initialization
    const savedLanguage = localStorage.getItem('selectedLanguage') as 'en' | 'hi' | 'gu' | null;
    return savedLanguage || 'en';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const localizeDigitsInText = (text: string): string => {
    // For now, just return the text as-is
    // In a real implementation, this would convert digits to the appropriate script
    return text;
  };

  const formatNumber = (num: number): string => {
    return num.toString();
  };

  const handleSetLanguage = (lang: 'en' | 'hi' | 'gu') => {
    setIsTransitioning(true);
    // Save language to localStorage
    localStorage.setItem('selectedLanguage', lang);
    setTimeout(() => {
      setLanguage(lang);
      setIsTransitioning(false);
    }, 100); // Further reduced for smoother switching
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isTransitioning,
    localizeDigitsInText,
    formatNumber
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
