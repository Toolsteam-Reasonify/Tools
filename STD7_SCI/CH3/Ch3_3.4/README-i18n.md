# Internationalization (i18n) Guide

This project uses i18next with react-i18next and i18next-browser-languagedetector to provide runtime language switching for English (en), Hindi (hi), and Gujarati (gu).

## Key features
- Runtime switching without page reload
- Language persisted in localStorage and via `?lang=` URL param
- Missing-key logging and English fallback
- ICU message format enabled (plurals, variables)
- Intl helpers for dates, numbers, currency: `src/utils/intlFormat.ts`

## Files
- i18n setup: `src/i18n.ts`
- Language context hook: `src/contexts/LanguageContext.tsx` (provides `t`, `language`, `setLanguage`)
- Language selector UI: `src/components/LanguageSelector.tsx`
- Locales: `src/locales/en.json`, `src/locales/hi.json`, `src/locales/gu.json`
- Missing keys checker: `scripts/missing-keys.mjs` (Node script)

## Adding/Editing translations
1. Open `src/locales/en.json` and add a semantic key (e.g., `nav.settings`, `buttons.submit`).
2. Mirror the same keys in `src/locales/hi.json` and `src/locales/gu.json`.
3. Use the key in code:
   ```tsx
   const { t } = useLanguage();
   <button aria-label={t('buttons.submit')}>{t('buttons.submit')}</button>
   ```
4. Run the missing key checker:
   ```bash
   node scripts/missing-keys.mjs
   ```
   It prints keys that are present in `en.json` but missing in Hindi/Gujarati.

## ICU examples
```json
{
  "greeting": "Hello {name}",
  "scoreLine": "{correct, number} / {total, number} correct ({percentage, number}%)",
  "exerciseCount": "{count, plural, one {{count} exercise completed} other {{count} exercises completed}}"
}
```
Usage:
```tsx
<tspan>{t('greeting', { name: userName })}</tspan>
```

## Formatting utilities (Intl)
Use `src/utils/intlFormat.ts`:
```ts
formatDate(new Date());
formatNumber(12345.6);
formatCurrency(199.9, 'INR');
```
These follow the currently selected `i18n.language`.

## Accessibility
- Localize aria attributes: `aria-label={t('...')}`
- Prefer `title={t('...')}` for tooltips

## Adding a new language
1. Create `src/locales/<lang>.json`.
2. Import and register in `src/i18n.ts` under `resources` and `supportedLngs`.
3. Add the language entry in `language` section for the selector.
4. Add font coverage if needed (see `index.html` for Noto Sans Devanagari/Gujarati).

## Migration plan (remove hardcoded text)
- Step 1: Wrap all UI strings with `t('...')` using sensible keys. (Navbar, Learn, RealWorld are done.)
- Step 2: Move large content blocks (e.g., Practice question bank) into locale JSON under `practice.qBank.*` and replace inline strings with `t(...)`.
- Step 3: Run `node scripts/missing-keys.mjs` and fill any missing keys.
- Step 4: QA using the checklist below.

## QA checklist
- Switch between English, Hindi, Gujarati using the selector — UI updates instantly.
- Load `/` and `/applications` with `?lang=hi` and `?lang=gu` — language initializes correctly.
- All labels, buttons, menus, tooltips, placeholders change language.
- All aria-labels localize.
- Numbers/dates/currency reflect locale via Intl helpers.
- No console warnings for missing keys; fallback to English where translations are intentionally pending.
- Practice mode: all prompts, buttons, and question content localize (after migration).

## Notes
- If you see a missing key warning, add the key to `en.json`, then propagate to `hi.json` and `gu.json`. The app falls back to English by design.
