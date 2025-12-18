# Bar Graph Usage Tool

An interactive educational web application for learning how to read, interpret, and use bar graphs. This tool provides comprehensive learning experiences through demonstration, practice, and real-world application modes.

## Features

- **📚 Learn Mode**: Interactive demonstrations explaining bar graph concepts and usage
- **✍️ Practice Mode**: Hands-on practice with interactive bar graphs and exercises
- **🌍 Real-World Mode**: Explore real-world examples and applications of bar graphs
- **🌐 Multilingual Support**: Available in English, Hindi (हिंदी), and Gujarati (ગુજરાતી)
- **🎨 Modern UI**: Beautiful gradient design with smooth animations
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **React 18.2** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd Bargraph_usage
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── contexts/           # React contexts
│   └── LanguageContext.tsx
├── features/           # Feature modules
│   └── BarGraph/
│       ├── DemonstrationMode/
│       ├── PracticeMode/
│       ├── RealWorldMode/
│       └── SharedControls/
├── interfaces/         # TypeScript interfaces
│   └── barGraphTypes.ts
├── App.tsx            # Main app component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Usage

1. **Learn Mode**: Navigate to `/learn` to see interactive demonstrations of bar graph concepts
2. **Practice Mode**: Go to `/practice` to test your understanding with hands-on exercises
3. **Real-World Mode**: Visit `/real-world` to explore practical applications of bar graphs

Use the language selector in the header to switch between English, Hindi, and Gujarati.

## License

This project is private and proprietary.

