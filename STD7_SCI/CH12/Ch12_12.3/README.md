# Educational Interactive Tools - React + TypeScript Setup

This project is set up following the **FINAL AGENT_PROMPT.md** guide for creating interactive educational React/TypeScript tools with heavy animations.

## Features

- ✅ React 18 with TypeScript
- ✅ Vite for fast development and building
- ✅ Pure CSS-in-JS (no Tailwind, no external CSS)
- ✅ Heavy animations with keyframes
- ✅ Multiple modes (Learn, Practice, Real World, Hands On)
- ✅ Dynamic content via `additionalProps`
- ✅ Poppins font family
- ✅ Light blue/Tea shade UI colors
- ✅ Blue (Primary) and Orange (Secondary) button colors
- ✅ Lucide React icons

## Project Structure

```
.
├── src/
│   ├── components/
│   │   └── ExampleTool.tsx    # Example component following the guide
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
└── README.md                   # This file
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Guide Specifications Followed

### UI Colors
- **Background**: Light blue/Tea shade (`#f0f9ff`, `#e0f2fe`)
- **Primary Button**: Blue (`#3b82f6`)
- **Secondary Button**: Orange (`#f97316`)
- **Text**: Shades of Black/Blue (`#1e293b`, `#475569`)
- **Outlines**: Blue or Black depending on UI

### Fonts
- **Primary**: Poppins
- **Fallback**: Segoe UI, Sans Serif

### Component Requirements
- ✅ Single file components (.tsx)
- ✅ TypeScript with proper interfaces
- ✅ Pure CSS-in-JS (inline styles)
- ✅ Heavy animations with keyframes
- ✅ Support for `additionalProps`
- ✅ Multiple modes support
- ✅ Navigation controls
- ✅ Auto-play functionality

## Creating New Tools

Follow the structure in `ExampleTool.tsx` and the guide in `FINAL AGENT_PROMPT.md`:

1. Create a new `.tsx` file in `src/components/`
2. Define your tool-specific `AdditionalProps` interface
3. Implement the component following the props interface structure
4. Use inline styles and CSS-in-JS only
5. Include animation keyframes via `useEffect`
6. Support all required props (width, height, modes, navigation, etc.)

## Example Component Usage

```tsx
import ExampleTool from './components/ExampleTool';

<ExampleTool
  props={{
    width: 800,
    height: 600,
    initialMode: 'learn',
    themeColor: '#3b82f6',
    additionalProps: {
      value: 42,
      label: 'Example',
      items: ['Item 1', 'Item 2']
    }
  }}
/>
```

## Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **lucide-react**: ^0.294.0 (for icons)
- **vite**: ^5.0.8 (build tool)
- **typescript**: ^5.2.2

## License

MIT
