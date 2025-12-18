# Class 7 Mathematics - Chapter 7 Educational Platform

A comprehensive interactive educational platform for teaching Class 7 Mathematics Chapter 7 topics based on the NCERT curriculum. This project consists of multiple sub-projects, each focusing on different mathematical concepts and tools.

## Project Structure

This repository contains four main educational applications:

### ch7_7.1 - Percentage Conversions & Fractions
Interactive platform for teaching percentage conversions, fractions, and related concepts.
- **Components**: Fraction to percentage converters, graphical representations, simple interest explainer
- **Features**: Interactive visualizations, step-by-step demonstrations, practice exercises
- **Utilities**: Percentage conversion tools

### ch7_7.2 - Percentage Tools
Comprehensive percentage calculation and conversion tools.
- **Components**: Comprehensive percentage tool, simple equations tool
- **Features**: Interactive percentage calculations, educational demonstrations
- **Utilities**: `percentTool.ts` for percentage calculations
- **Data**: Includes examples and practice problems

### ch7_7.3 - Profit and Loss
Educational platform for teaching profit and loss concepts.
- **Components**: Comprehensive profit and loss tool, percentage tools, fraction converters
- **Features**: Interactive profit/loss calculations, visual demonstrations
- **Utilities**: `profitLossTool.ts` for profit/loss calculations
- **Data**: Practice problems and exercises

### ch7_7.4 - Advanced Percentage Applications
Advanced percentage calculation tools and applications.
- **Components**: Comprehensive percentage tool, simple equations tool
- **Features**: Advanced percentage calculations, real-world applications
- **Utilities**: `percentTool.ts` for percentage calculations
- **Data**: Includes examples and practice problems

## Technology Stack

All projects use the following technologies:

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Type Checking**: TypeScript
- **Linting**: ESLint

## Shared Architecture

All sub-projects share a common architecture:

### Context Providers
- `InterruptContext.tsx` - Handles interruption and pause functionality
- `LanguageContext.tsx` - Manages language settings and translations
- `SessionContext.tsx` - Manages user sessions and progress
- `UserProfileContext.tsx` - Handles user profile data
- `VisualizationStateContext.tsx` - Manages visualization state

### Features
- `YourToolVisualization/` - Shared visualization components
  - `DemonstrationMode/` - Interactive demonstration components
  - `PracticeMode/` - Practice exercise components
  - `SharedControls/` - Reusable control components

### Pages
- `LearnPage.tsx` - Learning content and modules
- `PracticePage.tsx` - Practice exercises and problems
- `RealWorldApplications.tsx` - Real-world application examples

### Common Components
- `Layout.tsx` - Main layout wrapper
- `Navigation.tsx` - Navigation component
- `ErrorBoundary.tsx` - Error handling component
- `SimpleEquationsTool.tsx` - Simple equations solver

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the desired sub-project:
```bash
cd ch7_7.1  # or ch7_7.2, ch7_7.3, ch7_7.4
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

Each sub-project includes the following scripts:

- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Project Structure (Individual Project)

Each sub-project follows this structure:

```
ch7_7.X/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── Navigation.tsx   # Navigation component
│   │   ├── ErrorBoundary.tsx # Error handling
│   │   └── modules/        # Module-specific components
│   ├── pages/              # Page components
│   │   ├── LearnPage.tsx   # Learning content
│   │   ├── PracticePage.tsx # Practice exercises
│   │   └── RealWorldApplications.tsx # Real-world examples
│   ├── contexts/           # React context providers
│   │   ├── InterruptContext.tsx
│   │   ├── LanguageContext.tsx
│   │   ├── SessionContext.tsx
│   │   ├── UserProfileContext.tsx
│   │   └── VisualizationStateContext.tsx
│   ├── features/           # Feature-specific components
│   │   └── YourToolVisualization/
│   │       ├── DemonstrationMode/
│   │       ├── PracticeMode/
│   │       └── SharedControls/
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── interfaces/         # TypeScript interfaces
│   ├── data/               # Static data and problems
│   ├── assets/             # Images and static assets
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── dist/                   # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Node
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project-specific documentation
```

## Educational Content

### NCERT Curriculum Alignment
- Follows Class 7 Mathematics curriculum
- Covers all essential Chapter 7 topics
- Progressive difficulty levels
- Comprehensive practice materials

### Learning Objectives
- Understand percentage concepts and conversions
- Solve percentage-related problems
- Apply mathematical concepts to real-world scenarios
- Develop problem-solving skills
- Build confidence in mathematics

### Learning Features
- Sequential module-based learning
- Interactive visual demonstrations
- Step-by-step problem solving
- Real-time feedback and validation
- Progress tracking throughout modules
- Practice exercises with detailed solutions
- Real-world application examples

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint for code quality
- Maintain consistent component structure
- Document complex functions and components

### Component Organization
- Keep components focused and reusable
- Use TypeScript interfaces for type safety
- Leverage React contexts for shared state
- Implement error boundaries for robustness

### Testing
- Write unit tests for utility functions
- Test component interactions
- Validate educational content accuracy

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Acknowledgments

- NCERT for curriculum guidelines
- Educational research on mathematics learning
- Open source community for tools and libraries

