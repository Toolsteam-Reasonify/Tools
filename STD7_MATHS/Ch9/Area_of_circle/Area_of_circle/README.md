# Area of Circle Tool

A Vite + React + TypeScript + Tailwind CSS app for learning Circles: Circumference & Area. It includes Learn, Practice, and Real World sections with full language support (English, Hindi, Gujarati).

## Features
- Learn section with step-by-step visuals and animations
- Practice section with interactive questions, hints, and solutions
- Real World section with expandable cards and tips
- Language switcher via context (en, hi, gu)
- SVG diagrams for geometry visuals

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- react-router-dom

## Getting Started
```bash
# Install
npm install

# Start dev server
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Project Structure
```
src/
  contexts/LanguageContext.tsx   # i18n strings and provider
  features/Circle/               # Learn, Practice, RealWorld modes
  index.css                      # Tailwind and custom animations
  main.tsx, App.tsx
```

## Internationalization
- Set and read language using `useLanguage()` from `contexts/LanguageContext`.
- All user-visible strings must be sourced from `translations` (English/Hindi/ Gujarati).

## Development Notes
- Keep UI text in `LanguageContext.tsx`.
- Prefer SVG for geometry visuals.
- Follow Tailwind utility patterns used across the repo.

## License
For internal educational use.

