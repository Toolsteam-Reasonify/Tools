# Multiplication Tool

An interactive React + TypeScript app for exploring multiplication concepts with multiple learning modes. Built with Vite and styled with Tailwind CSS.

## Features
- **Demonstration Mode**: Visual explanations of multiplication and fractions.
- **Practice Mode**: Interactive exercises for hands-on learning.
- **Real-World Mode**: Contextual problems connecting concepts to real scenarios.

## Tech Stack
- **React 18**, **TypeScript**, **Vite 5**
- **React Router 6**
- **Tailwind CSS 3**, **PostCSS**, **Autoprefixer**

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the preview URL shown in the terminal (typically `http://localhost:5173`).

## Available Scripts
- `npm run dev`: Start Vite dev server
- `npm run build`: Production build
- `npm run preview`: Preview the production build

## Project Structure
```text
src/
  App.tsx
  main.tsx
  index.css
  contexts/
    LanguageContext.tsx
  features/
    Multiplication/
      DemonstrationMode/
        DemonstrationMode.tsx
      PracticeMode/
        PracticeMode.tsx
      RealWorldMode/
        RealWorldMode.tsx
      Shared/
        CircleMultiplyVisual.tsx
        FractionAddition.tsx
        FractionVisuals.tsx
        GridFractionAddition.tsx
        Interactive.tsx
```

## Configuration
- Tailwind configuration: `tailwind.config.js`
- Vite configuration: `vite.config.ts`
- TypeScript configuration: `tsconfig.json`, `tsconfig.node.json`

## Notes
- Page title is set to "Multiplication Tool" in `index.html`.
- This project is marked `private` in `package.json` and not intended for npm publishing.

## License
Add your license here (e.g., MIT).


