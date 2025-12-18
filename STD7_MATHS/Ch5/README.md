# Chapter 5 Educational Tools

This repository contains comprehensive educational tools for Chapter 5, covering various mathematical concepts including shapes, angles, nets, and 3D geometry.

## 📚 Overview

Chapter 5 educational tools provide interactive learning experiences with demonstrations, practice exercises, and real-world applications. Each tool focuses on specific topics within Chapter 5.

## 🗂️ Subdirectories

### 1. **ch5_intro** - Chapter 5 Introduction
Interactive educational tool covering foundational concepts in Chapter 5.

**Topics:**
- Understanding Nets
- 2D vs 3D Shapes
- Shape Classification
- Interactive Demonstrations

**Features:**
- Multilingual support (English, Hindi, Gujarati)
- Interactive canvas visualizations
- Practice exercises with hints
- Real-world applications

---

### 2. **ch5_5.3** - Advanced Chapter 5 Concepts
Educational tool focusing on advanced concepts and shapes.

**Topics:**
- Shapes Encyclopedia
- Lines and Angles Tutorial
- Advanced Geometric Concepts

**Features:**
- Interactive demonstrations
- Comprehensive shape library
- Practice mode with feedback
- Multi-language support

---

### 3. **ch5_5.4** - Linear Pair and Vertically Opposite Angles
Specialized tool for learning angle relationships.

**Topics:**
- Linear Pair Angles (sum = 180°)
- Vertically Opposite Angles
- Angle Calculations
- Algebraic Angle Problems

**Features:**
- Interactive SVG diagrams
- Animated angle demonstrations
- 8 practice exercises
- Real-world applications (scissors, clock hands, intersections, etc.)
- Adjustable angle sliders
- Auto-animation mode

## 🎯 Common Features Across All Tools

### Educational Modes
- **📚 Learn Mode**: Interactive demonstrations with step-by-step guides
- **✍️ Practice Mode**: Exercises with immediate feedback and hints
- **🌍 Real World Applications**: Practical use cases and examples

### 🌐 Language Support
All tools support three languages:
- **English** (en)
- **हिंदी** (hi) - Hindi
- **ગુજરાતી** (gu) - Gujarati

### 🎨 Design
- **Color Scheme**: Teal and Purple gradients
- **Typography**: Poppins font family
- **Responsive**: Mobile-first design
- **Animations**: Smooth, educational transitions

### 🛠️ Technical Stack
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Three.js** & **React Three Fiber** for 3D visualizations
- **Lucide React** for icons

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository** (if applicable):
```bash
git clone <repository-url>
cd Ch5
```

2. **Navigate to any subdirectory**:
```bash
cd ch5_intro  # or ch5_5.3 or ch5_5.4
```

3. **Install dependencies**:
```bash
npm install
```

4. **Start development server**:
```bash
npm run dev
```

5. **Open in browser**:
Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Built files will be in the `dist` directory.

## 📁 Project Structure

```
Ch5/
├── ch5_intro/              # Chapter 5 Introduction Tool
│   ├── src/
│   │   ├── Chapter5Tool.tsx
│   │   ├── components/
│   │   │   ├── InteractiveCanvas.tsx
│   │   │   └── ShapesEncyclopedia.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── README.md
│   └── .gitignore
│
├── ch5_5.3/                # Advanced Chapter 5 Concepts
│   ├── src/
│   │   ├── Chapter5Tool.tsx
│   │   ├── components/
│   │   │   ├── InteractiveCanvas.tsx
│   │   │   ├── LinesAndAnglesTutorial.tsx
│   │   │   └── ShapesEncyclopedia.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── README.md
│   └── .gitignore
│
├── ch5_5.4/                # Linear Pair and Angles
│   ├── src/
│   │   ├── Chapter5Tool.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── README.md
│   ├── SETUP_GUIDE.md
│   └── .gitignore
│
├── README.md               # This file
└── .gitignore              # Root gitignore
```

## 🎓 Learning Objectives

By using these tools, students will be able to:

### Geometry Fundamentals
- ✅ Understand the concept of nets and their relationship to 3D shapes
- ✅ Classify shapes as 2D (plane figures) or 3D (solid shapes)
- ✅ Identify and name common geometric shapes
- ✅ Visualize how 2D nets fold into 3D objects

### Angle Relationships
- ✅ Define linear pair and vertically opposite angles
- ✅ Calculate missing angles in linear pairs (sum = 180°)
- ✅ Identify vertically opposite angles (always equal)
- ✅ Solve algebraic problems involving angles
- ✅ Apply angle concepts to real-world scenarios

### Problem Solving
- ✅ Work through progressive difficulty levels
- ✅ Use hints effectively
- ✅ Apply learned concepts to practical situations
- ✅ Develop spatial reasoning skills

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development

### Running All Projects

Each subdirectory is an independent project. To run a specific tool:

```bash
# Tool 1: Introduction
cd ch5_intro && npm run dev

# Tool 2: Advanced Concepts
cd ch5_5.3 && npm run dev

# Tool 3: Angles
cd ch5_5.4 && npm run dev
```

### Adding New Content

1. **For Practice Exercises**: Add to the `practiceExercises` array in the respective `Chapter5Tool.tsx`
2. **For Visualizations**: Update canvas drawing functions in component files
3. **For Translations**: Add language keys to the `translations` object
4. **For Real-World Examples**: Add new application objects to the array

### Code Style Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Implement proper error boundaries
- Use semantic HTML elements
- Maintain accessibility standards

## 📊 Features Comparison

| Feature | ch5_intro | ch5_5.3 | ch5_5.4 |
|---------|-----------|---------|---------|
| Language Support | ✅ | ✅ | ✅ |
| Practice Exercises | ✅ | ✅ | ✅ |
| Interactive Canvas | ✅ | ✅ | ❌ |
| SVG Diagrams | ❌ | ❌ | ✅ |
| 3D Visualizations | ✅ | ✅ | ❌ |
| Real-World Apps | ✅ | ✅ | ✅ |
| Audio Feedback | ✅ | ✅ | ✅ |
| Progress Tracking | ✅ | ✅ | ✅ |

## 🤝 Contributing

When contributing to these educational tools:

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include translations for all languages
4. Test on multiple devices and browsers
5. Ensure accessibility compliance
6. Update relevant README files

## 📝 License

This project is part of the educational tool development framework for Reasonify.

## 📞 Support

For questions or issues:
- Check the individual README files in each subdirectory
- Refer to the Frontend Tool Development Guide
- Contact the development team

## 🎯 Future Enhancements

Planned improvements across all tools:
- [ ] Additional practice problems
- [ ] Enhanced 3D visualizations
- [ ] Printable worksheets
- [ ] Video tutorials integration
- [ ] More language options
- [ ] Accessibility improvements (screen reader support)
- [ ] Game-based learning modes
- [ ] Cross-session progress tracking
- [ ] Teacher dashboard
- [ ] Analytics and reporting

## 📈 Version History

- **Version 1.0.0**: Initial release with core features
- Each tool maintains independent versioning

---

**Part of the Reasonify Educational Platform**  
**Chapter 5: Geometry and Shapes**

For detailed documentation on each tool, see the README files in the respective subdirectories.

