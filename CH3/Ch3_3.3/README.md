# Electrical Circuits Educational Tool

An interactive React + TypeScript educational tool for learning about electrical circuits, designed for students studying Chapter 3 of Standard 7 Science.

## Features

- **Demonstration Mode**: Step-by-step guided learning about electrical circuits
- **Practice Mode**: Interactive exercises to build and understand circuits
- **Circuit Visualization**: Interactive SVG-based circuit components (cells, batteries, lamps, LEDs, switches, wires)
- **Multilingual Support**: English, Hindi (हिंदी), and Gujarati (ગુજરાતી) with easy language switching
- **Real World Applications**: Graphical representation of electricity usage in daily life
- **Modern UI**: Teal and Purple color scheme with Poppins font
- **Subtle Animations**: Smooth transitions and visual feedback

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure (key files)

- `src/i18n.ts` — i18next + ICU + language detector bootstrap
- `src/locales/*.json` — translation resources (en, hi, gu)
- `src/contexts/LanguageContext.tsx` — language state + helpers
- `src/components/LanguageSelector.tsx` — global language switcher
- `src/components/Navbar.tsx` — top navigation, uses translations
- `src/components/CircuitVisualization.tsx` — learn/practice mode switcher
- `src/components/TorchlightLearning.tsx` — learn flow UI
- `src/components/TorchlightPractice.tsx` — practice quiz
- `src/components/RealWorldApplications.tsx` — real-world usage page
- `src/utils/formatters.ts` — locale-aware date/number/currency helpers
- `scripts/check-missing-keys.mjs` — find untranslated keys

## Key Concepts Covered

1. **Electric Cells and Batteries**: Understanding positive and negative terminals
2. **Circuit Components**: Lamps (incandescent and LED), switches, wires
3. **Complete Circuits**: How current flows in closed circuits
4. **Circuit Diagrams**: Standard symbols for electrical components
5. **Conductors and Insulators**: Materials that allow or prevent current flow
6. **Safety**: Important safety guidelines for working with electricity

## Internationalization Guide

- Resources live in `src/locales/{lang}.json` (semantic keys like `nav.learn`, `torch.observe.title`).
- i18next uses language detector (URL `?lang=hi`, localStorage, browser settings) with instant runtime switching; the selected language persists across page loads.
- ICU formatting is enabled; pass variables to `t` (e.g. `t('practice.summary.scoreLine', { correct, total, percentage })`).
- Formatting helpers: `formatDate`, `formatNumber`, `formatCurrency` in `src/utils/formatters.ts`.
- Fonts include Noto Sans Gujarati and Noto Sans Devanagari for correct script rendering.
- Missing key checker: `npm run i18n:missing` (compares `hi`/`gu` against `en` and logs gaps); missing keys also log to the browser console at runtime and fall back to English.

### Adding a new string
1. Add a semantic key/value to `src/locales/en.json`.
2. Add the same key to `src/locales/hi.json` and `src/locales/gu.json` (use placeholder text if needed).
3. Use it in code: `const { t } = useLanguage();` then `t('section.key')`.
4. Run `npm run i18n:missing` to ensure non-English files are in sync.

### Adding a new language
1. Create `src/locales/{code}.json` with translations.
2. Add `{code}` to `supportedLngs` in `src/i18n.ts`.
3. Add the language to `LanguageSelector` options.
4. Provide a font that supports the script if needed.

### Migration plan (removing hardcoded text)
- Step through components and replace strings with `t('...')` keys.
- Keep all aria-labels, placeholders, tooltips, and button text translated.
- Centralize shared messages in `common.*`.
- After refactors, run `npm run i18n:missing` and verify UI by switching languages in-app (no reload required).

### QA checklist for language switch
- Toggle English ↔ Gujarati ↔ Hindi using the selector; verify instant UI updates.
- Load pages with `?lang=hi` / `?lang=gu` and ensure persistence after navigation/reload.
- Check navbar, buttons, modals, tooltips, form placeholders, and toasts for translated text.
- Verify aria-labels and alt text where present.
- Confirm date/number/currency values reflect locale (Real World stats card).
- Ensure missing keys fall back to English and log to console.

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint configured for React and TypeScript
- Prettier recommended for code formatting

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.

## Contributing

This is an educational tool. Feel free to extend it with additional features, exercises, or improvements!

