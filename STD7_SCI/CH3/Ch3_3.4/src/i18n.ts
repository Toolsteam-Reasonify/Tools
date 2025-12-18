import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';
import learnEn from './locales/learn.en.json';
import learnHi from './locales/learn.hi.json';
import learnGu from './locales/learn.gu.json';

// Extend English resources to ensure required Learn mode keys exist (prevents missing key warnings)
const enExtended = {
  // Merge primary en and Learn-mode additions
  ...en,
  ...(learnEn as any),
  learn: {
    // Preserve any existing learn keys
    ...(en as any).learn,
    ...((learnEn as any).learn || {}),
    // Ensure this key exists to avoid console warnings
    dragMaterialToTest:
      (en as any).learn?.dragMaterialToTest ||
      "👆 Drag a material into the circuit gap to test if it conducts electricity!",
    information: (en as any).learn?.information || 'Information',
    headerTitle: (en as any).learn?.headerTitle || 'Conductors & Insulators',
    headerSubtitle:
      (en as any).learn?.headerSubtitle ||
      'Drag items into the gap to complete the circuit. Does the bulb light up?',
    circuitTestArea: (en as any).learn?.circuitTestArea || 'Circuit Test Area',
    connectionMade: (en as any).learn?.connectionMade || 'Connection Made',
    dragObjectHere: (en as any).learn?.dragObjectHere || '↓ Drag Object Here ↓',
    predYesConduct: (en as any).learn?.predYesConduct || 'Yes, it will conduct!',
    predNoInsulator: (en as any).learn?.predNoInsulator || "No, it's an insulator",
    resultCorrect: (en as any).learn?.resultCorrect || "That's Correct!",
    explainerOnAlt:
      (en as any).learn?.explainerOnAlt ||
      'Because it allows electrons to flow, the loop is closed and the bulb lights up! 💡',
    explainerOffAlt:
      (en as any).learn?.explainerOffAlt ||
      'Because it blocks electron flow, the circuit remains broken and the bulb stays off. 🚫',
  },
};

// Extend Hindi and Gujarati with Learn-mode keys (permanent storage)
const hiExtended = {
  ...hi,
  ...(learnHi as any),
  learn: {
    ...(hi as any).learn,
    ...((learnHi as any).learn || {}),
  },
};

const guExtended = {
  ...gu,
  ...(learnGu as any),
  learn: {
    ...(gu as any).learn,
    ...((learnGu as any).learn || {}),
  },
};

const resources = {
  en: { translation: enExtended },
  hi: { translation: hiExtended },
  gu: { translation: guExtended },
};

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'gu'],
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
    saveMissing: true,
    missingKeyHandler: (lng, _ns, key) => {
      console.warn(`[i18n] Missing translation for key "${key}" in ${lng}`);
    },
  }).then(() => {
    // Ensure Learn-mode keys are present at runtime to avoid missing-key warnings
    const ensure = (
      lng: string,
      entries: Record<string, string>
    ) => {
      Object.entries(entries).forEach(([k, v]) => {
        if (!i18n.exists(k, { lng })) {
          i18n.addResource(lng, 'translation', k, v, { silent: true });
        }
      });
    };

    const learnDefaults: Record<string, string> = {
      'learn.information': 'Information',
      'learn.headerTitle': 'Conductors & Insulators',
      'learn.headerSubtitle': 'Drag items into the gap to complete the circuit. Does the bulb light up?',
      'learn.circuitTestArea': 'Circuit Test Area',
      'learn.hideCurrent': 'Hide Current',
      'learn.showCurrent': 'Show Current',
      'learn.connectionMade': 'Connection Made',
      'learn.dragObjectHere': '↓ Drag Object Here ↓',
      'learn.predYesConduct': 'Yes, it will conduct!',
      "learn.predNoInsulator": "No, it's an insulator",
      "learn.resultCorrect": "That's Correct!",
      'learn.explainerOnAlt': 'Because it allows electrons to flow, the loop is closed and the bulb lights up! 💡',
      'learn.explainerOffAlt': 'Because it blocks electron flow, the circuit remains broken and the bulb stays off. 🚫',
      'learn.dragMaterialToTest': '👆 Drag a material into the circuit gap to test if it conducts electricity!',
      'learn.materialsToTest': 'Materials to Test (Drag into circuit gap)',
      'learn.cell': 'Cell',
      'learn.bulb': 'Bulb',
      'learn.makePrediction': 'Make a Prediction: Will the {{label}} complete the circuit?',
      'learn.isAType': '{{label}} is a'
    };

    ['en', 'hi', 'gu'].forEach((lng) => ensure(lng, learnDefaults));

    // Ensure material names/descriptions exist for Learn mode labels
    const materials: Array<{
      id: string; label: string; description: string;
    }> = [
      { id: 'iron', label: 'Iron rod', description: 'a metal that allows electricity to flow through it' },
      { id: 'copper', label: 'Copper rod', description: 'an excellent conductor of electricity' },
      { id: 'graphite', label: 'Pencil graphite', description: "the 'lead' in pencils, which conducts electricity" },
      { id: 'wood', label: 'Wood', description: 'a natural material that does not conduct electricity' },
      { id: 'plastic', label: 'Plastic', description: 'a synthetic material that blocks electricity' },
      { id: 'pencil', label: 'Pencil', description: 'the wooden body of a pencil, which does not conduct electricity' },
      { id: 'rubber', label: 'Rubber', description: 'used to cover wires because it stops electricity' },
      { id: 'glass', label: 'Glass', description: 'transparent material that does not conduct electricity' },
    ];

    const nameEntries: Record<string, string> = {};
    const descEntries: Record<string, string> = {};
    materials.forEach((m) => {
      nameEntries[`learn.materialNames.${m.id}`] = m.label;
      descEntries[`learn.materialDescriptions.${m.id}`] = m.description;
    });

    ['en'].forEach((lng) => {
      ensure(lng, nameEntries);
      ensure(lng, descEntries);
    });
  });

export default i18n;

