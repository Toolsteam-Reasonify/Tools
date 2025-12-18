export type LanguageCode = 'en' | 'hi' | 'gu';

export const getFontFamilyForLanguage = (language: LanguageCode) => {
  if (language === 'hi') return '"Noto Sans Devanagari", system-ui, sans-serif';
  if (language === 'gu') return '"Noto Sans Gujarati", system-ui, sans-serif';
  return '"Inter", system-ui, sans-serif';
};


