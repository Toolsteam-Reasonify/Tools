# Simple Equations - Educational Platform

An interactive educational website for teaching Simple Equations (Class 7 Mathematics) based on the NCERT curriculum. This platform provides engaging, student-friendly content to help teachers explain concepts effectively.

## Features

### 🏠 Homepage
- Clean, modern design with mathematics theme
- Navigation menu with core sections
- Interactive learning features showcase

### 📚 Learning Sections

#### Introduction
- Interactive explanations of equation concepts
- Step-by-step visual guides
- Key terminology and definitions
- NCERT curriculum alignment

#### Learn
- **Module 1**: The Mind Reader Game - Interactive recreation with step-by-step revelation
- **Module 2**: Setting Up Equations - Drag-and-drop equation builder
- **Module 3**: Understanding Variables and Expressions - Interactive variable playground
- **Module 4**: What is an Equation - Visual balance scale metaphor
- **Module 5**: Solving Equations - Step-by-step solver with animations

#### Practice
- Comprehensive exercise sets
- Multiple difficulty levels
- Detailed solutions and explanations
- Performance tracking

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ch4
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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
ch4/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── Navigation.tsx   # Navigation component
│   │   └── Footer.tsx      # Footer component
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── IntroductionPage.tsx
│   │   ├── LearnPage.tsx
│   │   └── PracticePage.tsx
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── data/               # Static data and problems
│   ├── assets/             # Images and static assets
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Public assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## Educational Content

### NCERT Curriculum Alignment
- Follows Class 7 Mathematics curriculum
- Covers all essential simple equation concepts
- Progressive difficulty levels
- Comprehensive practice materials

### Learning Objectives
- Understand equation concepts and terminology
- Solve simple linear equations
- Verify solutions through substitution
- Apply equations to word problems
- Develop problem-solving skills
- Build confidence in mathematics

### Learning Features
- Sequential module-based learning
- Interactive visual demonstrations
- Step-by-step problem solving
- Real-time feedback and validation
- Progress tracking throughout modules

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
