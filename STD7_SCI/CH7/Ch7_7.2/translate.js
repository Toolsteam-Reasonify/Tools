const fs = require('fs');

// Read the translation file
const data = JSON.parse(fs.readFileSync('src/locales/translation.json', 'utf8'));

// Helper function to translate text (placeholder - in real scenario, use translation API)
// For now, we'll use the English content as base and add translations manually

// Hindi translations for key sections
const hindiTranslations = {
  'convection.practice.header.title': 'अभ्यास मोड',
  'convection.practice.header.subtitle': 'पाठ 7.2: संवहन',
  'convection.practice.ui.questionLabel': 'प्रश्न {current} / {total}',
  'convection.practice.ui.difficulty.easy': 'आसान',
  'convection.practice.ui.difficulty.medium': 'मध्यम',
  'convection.practice.ui.difficulty.hard': 'कठिन',
  'convection.practice.ui.pointsLabel': '{points} अंक',
  'convection.practice.ui.progress': 'प्रगति',
  'convection.practice.ui.progressQuestions': '{answered} / {total} प्रश्न',
  'convection.practice.ui.outOf': '{total} में से',
  'convection.practice.ui.previousButton': '← पिछला',
  'convection.practice.ui.previousButtonShort': '← पिछला',
  'convection.practice.ui.submitButton': 'उत्तर जाँचें',
  'convection.practice.ui.submitButtonShort': 'जाँचें',
  'convection.practice.ui.nextButton': 'अगला प्रश्न',
  'convection.practice.ui.nextButtonShort': 'अगला',
  'convection.practice.ui.tryAgainButton': 'फिर से कोशिश करें',
  'convection.practice.ui.tryAgainButtonShort': 'फिर से',
  'convection.practice.ui.startOverButton': 'शुरू से करें',
  'convection.practice.ui.completeTitle': 'अभ्यास पूर्ण! 🎉',
  'convection.practice.ui.scoreSummary': 'आपने {total} में से {score} अंक प्राप्त किए',
  'convection.practice.ui.questionsAnswered': 'दिए गए प्रश्न',
  'convection.practice.ui.scorePercentage': 'प्रतिशत अंक',
  'convection.practice.ui.gradeLabel': 'ग्रेड',
  'convection.practice.ui.correctTitle': '🎉 सही उत्तर!',
  'convection.practice.ui.incorrectTitle': '❌ गलत उत्तर',
  'convection.practice.ui.matchHint': 'हर वस्तु को उसके सही वर्ग से मिलाएँ:',
  'convection.practice.ui.processes': 'प्रक्रियाएं:',
  'convection.practice.ui.characteristics': 'विशेषताएं:',
  'convection.practice.ui.select': 'चुनें...',
  'convection.practice.ui.sequenceHint': 'क्रम ठीक करने के लिए तीर बटन का उपयोग करें:',
  'convection.practice.ui.studyTips': '💡 अध्ययन सुझाव:',
  'convection.practice.ui.tip1': '• याद रखें: संवहन में कणों की गति आवश्यक है (चालन के विपरीत)',
  'convection.practice.ui.tip2': '• गर्म हवा/पानी ऊपर उठता है क्योंकि यह फैलता है और हल्का हो जाता है',
  'convection.practice.ui.tip3': '• समुद्री हवा = दिन (समुद्र से जमीन), भूमि हवा = रात (जमीन से समुद्र)',
  'convection.practice.ui.tip4': '• संवहन केवल तरल पदार्थों (द्रव और गैसों) में काम करता है, ठोस में नहीं'
};

// Apply Hindi translations
if (data.hi && data.hi.convection && data.hi.convection.practice) {
  data.hi.convection.practice.header.title = hindiTranslations['convection.practice.header.title'];
  data.hi.convection.practice.header.subtitle = hindiTranslations['convection.practice.header.subtitle'];
  
  if (data.hi.convection.practice.ui) {
    data.hi.convection.practice.ui.questionLabel = hindiTranslations['convection.practice.ui.questionLabel'];
    data.hi.convection.practice.ui.difficulty = {
      easy: hindiTranslations['convection.practice.ui.difficulty.easy'],
      medium: hindiTranslations['convection.practice.ui.difficulty.medium'],
      hard: hindiTranslations['convection.practice.ui.difficulty.hard']
    };
    data.hi.convection.practice.ui.pointsLabel = hindiTranslations['convection.practice.ui.pointsLabel'];
    data.hi.convection.practice.ui.progress = hindiTranslations['convection.practice.ui.progress'];
    data.hi.convection.practice.ui.progressQuestions = hindiTranslations['convection.practice.ui.progressQuestions'];
    data.hi.convection.practice.ui.outOf = hindiTranslations['convection.practice.ui.outOf'];
    data.hi.convection.practice.ui.previousButton = hindiTranslations['convection.practice.ui.previousButton'];
    data.hi.convection.practice.ui.previousButtonShort = hindiTranslations['convection.practice.ui.previousButtonShort'];
    data.hi.convection.practice.ui.submitButton = hindiTranslations['convection.practice.ui.submitButton'];
    data.hi.convection.practice.ui.submitButtonShort = hindiTranslations['convection.practice.ui.submitButtonShort'];
    data.hi.convection.practice.ui.nextButton = hindiTranslations['convection.practice.ui.nextButton'];
    data.hi.convection.practice.ui.nextButtonShort = hindiTranslations['convection.practice.ui.nextButtonShort'];
    data.hi.convection.practice.ui.tryAgainButton = hindiTranslations['convection.practice.ui.tryAgainButton'];
    data.hi.convection.practice.ui.tryAgainButtonShort = hindiTranslations['convection.practice.ui.tryAgainButtonShort'];
    data.hi.convection.practice.ui.startOverButton = hindiTranslations['convection.practice.ui.startOverButton'];
    data.hi.convection.practice.ui.completeTitle = hindiTranslations['convection.practice.ui.completeTitle'];
    data.hi.convection.practice.ui.scoreSummary = hindiTranslations['convection.practice.ui.scoreSummary'];
    data.hi.convection.practice.ui.questionsAnswered = hindiTranslations['convection.practice.ui.questionsAnswered'];
    data.hi.convection.practice.ui.scorePercentage = hindiTranslations['convection.practice.ui.scorePercentage'];
    data.hi.convection.practice.ui.gradeLabel = hindiTranslations['convection.practice.ui.gradeLabel'];
    data.hi.convection.practice.ui.correctTitle = hindiTranslations['convection.practice.ui.correctTitle'];
    data.hi.convection.practice.ui.incorrectTitle = hindiTranslations['convection.practice.ui.incorrectTitle'];
    data.hi.convection.practice.ui.matchHint = hindiTranslations['convection.practice.ui.matchHint'];
    data.hi.convection.practice.ui.processes = hindiTranslations['convection.practice.ui.processes'];
    data.hi.convection.practice.ui.characteristics = hindiTranslations['convection.practice.ui.characteristics'];
    data.hi.convection.practice.ui.select = hindiTranslations['convection.practice.ui.select'];
    data.hi.convection.practice.ui.sequenceHint = hindiTranslations['convection.practice.ui.sequenceHint'];
    data.hi.convection.practice.ui.studyTips = hindiTranslations['convection.practice.ui.studyTips'];
    data.hi.convection.practice.ui.tip1 = hindiTranslations['convection.practice.ui.tip1'];
    data.hi.convection.practice.ui.tip2 = hindiTranslations['convection.practice.ui.tip2'];
    data.hi.convection.practice.ui.tip3 = hindiTranslations['convection.practice.ui.tip3'];
    data.hi.convection.practice.ui.tip4 = hindiTranslations['convection.practice.ui.tip4'];
  }
}

// Write back to file
fs.writeFileSync('src/locales/translation.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Hindi practice UI translations applied!');

