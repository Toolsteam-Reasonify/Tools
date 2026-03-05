# Tiling Explorer Tool - Agent Documentation

## Tool Overview

The **Tiling Explorer** is an interactive educational tool for teaching geometric tiling and tessellation concepts. It provides three distinct modes for comprehensive learning: hands-on exploration, practice questions, and real-world applications.

---

## Quick Reference

| Feature | Purpose | Default |
|---------|---------|---------|
| `initialMode` | Starting mode | `"learn"` |
| `showModeSelector` | Show mode navigation tabs | `true` |
| `enabledModes` | Which modes are available | `["learn", "practice", "realworld"]` |
| `showNavigation` | Show prev/next buttons | `true` |
| `showStepIndicator` | Show progress indicators | `true` |
| `animationSpeed` | Animation speed multiplier | `1` |
| `additionalProps.gridRows` | Grid height | `5` |
| `additionalProps.gridCols` | Grid width | `6` |
| `additionalProps.showCheckerboard` | Enable checkerboard view | `false` |
| `additionalProps.customQuestions` | Custom MCQ questions | Default 5 questions |
| `additionalProps.customExamples` | Custom real-world examples | Default 5 examples |

---

## Modes

### 1. Learn Mode (`"learn"`)
Interactive canvas for exploring tiling concepts with:
- Adjustable grid dimensions (2-15 rows/cols)
- Click-to-place tiles
- Color selection
- Tileability checker (for 2×1 dominoes)
- Auto-solve functionality
- Checkerboard visualization

**Best for**: 
- Introduction to tiling
- Hands-on experimentation
- Understanding grid properties

### 2. Practice Mode (`"practice"`)
Multiple-choice questions testing tiling knowledge:
- 5 default questions covering key concepts
- Immediate feedback with explanations
- Progress tracking
- Custom questions support

**Best for**:
- Assessment
- Reinforcement
- Self-paced practice

### 3. Real World Mode (`"realworld"`)
Examples of tiling in nature, art, and technology:
- 5 default examples (honeycombs, Islamic art, video games, maps, turtle shells)
- Detailed descriptions with mathematical connections
- Fun facts
- Custom examples support

**Best for**:
- Motivation
- Contextual learning
- Cross-disciplinary connections

---

## additionalProps Interface

```typescript
interface TilingAdditionalProps {
  // Grid configuration
  gridRows?: number;                    // Grid height (2-15)
  gridCols?: number;                    // Grid width (2-15)
  gridType?: 'rectangular' | 'hexagonal' | 'triangular';
  tileType?: '2x1' | 'square' | 'equilateral' | 'hexagon';
  
  // Colors
  tileColors?: string[];                // Available tile colors
  selectedColor?: string;               // Default selected color
  
  // Features
  showCheckerboard?: boolean;           // Enable checkerboard view
  autoSolve?: boolean;                  // Auto-solve on load
  
  // Custom content
  customQuestions?: MCQQuestion[];      // Custom practice questions
  customExamples?: RealWorldExample[];  // Custom real-world examples
}
```

### MCQQuestion Interface

```typescript
interface MCQQuestion {
  id: number;
  question: string;
  options: string[];                    // 4 options
  correctAnswer: number;                // Index (0-3)
  explanation: string;
}
```

### RealWorldExample Interface

```typescript
interface RealWorldExample {
  id: number;
  title: string;
  description: string;
  image: string;                        // Emoji or text
  connection: string;                   // Mathematical connection
  funFact: string;
}
```

---

## Tool Call Examples

### Example 1: Basic Learning Mode
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Explore Tiling Basics",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {}
  },
  "instructions_for_student": "Click on the grid to place tiles and explore tiling patterns!"
}
```

### Example 2: Custom Grid Size
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Large Grid Tiling",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "additionalProps": {
        "gridRows": 8,
        "gridCols": 10
      }
    }
  },
  "instructions_for_student": "Try tiling this larger grid!"
}
```

### Example 3: Start with Checkerboard
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Checkerboard Proof",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "additionalProps": {
        "gridRows": 6,
        "gridCols": 6,
        "showCheckerboard": true
      }
    }
  },
  "instructions_for_student": "Notice how each tile covers one black and one white square!"
}
```

### Example 4: Practice Mode Only
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Tiling Quiz",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "enabledModes": ["practice"]
    }
  },
  "instructions_for_student": "Test your understanding of tiling concepts!"
}
```

### Example 5: Real World Examples Only
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Tiling in Nature and Technology",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "initialMode": "realworld",
      "showModeSelector": false,
      "enabledModes": ["realworld"]
    }
  },
  "instructions_for_student": "Discover how tiling appears in the world around us!"
}
```

### Example 6: Custom Practice Questions
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Custom Tiling Assessment",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "initialMode": "practice",
      "additionalProps": {
        "customQuestions": [
          {
            "id": 1,
            "question": "Can a 3×3 grid be tiled with 2×1 tiles?",
            "options": [
              "Yes",
              "No, odd total cells",
              "Yes, with rotation",
              "Depends on arrangement"
            ],
            "correctAnswer": 1,
            "explanation": "A 3×3 grid has 9 cells (odd number). Since each 2×1 tile covers 2 cells, we cannot tile 9 cells perfectly."
          }
        ]
      }
    }
  },
  "instructions_for_student": "Answer this tiling question!"
}
```

### Example 7: Minimal UI for Focused Learning
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Grid Tiling Demo",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showStepIndicator": false,
      "additionalProps": {
        "gridRows": 4,
        "gridCols": 6
      }
    }
  },
  "instructions_for_student": "This grid can be tiled! Try it yourself."
}
```

### Example 8: Auto-Solve Demonstration
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Watch Auto-Solve",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "additionalProps": {
        "gridRows": 5,
        "gridCols": 6,
        "autoSolve": true
      }
    }
  },
  "instructions_for_student": "Watch how the grid is automatically tiled!"
}
```

### Example 9: Odd Grid Challenge
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Can You Tile This?",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "additionalProps": {
        "gridRows": 5,
        "gridCols": 7
      }
    }
  },
  "instructions_for_student": "Try to tile this grid with 2×1 tiles. What happens?"
}
```

### Example 10: Custom Colors
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Colorful Tiling",
  "data": {
    "toolName": "tiling_explorer",
    "parameters": {
      "additionalProps": {
        "tileColors": ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"],
        "selectedColor": "#FF0000"
      }
    }
  },
  "instructions_for_student": "Create a colorful tiling pattern!"
}
```

---

## Decision Tree for Agents

```
Student asks about tiling/tessellation
    │
    ├─ "What is tiling?" / "Explain tiling"
    │   └─ Use: initialMode: "learn", showModeSelector: true
    │
    ├─ "Can I tile a [R]×[C] grid?"
    │   └─ Use: additionalProps: { gridRows: R, gridCols: C }
    │
    ├─ "Show me the checkerboard technique"
    │   └─ Use: additionalProps: { showCheckerboard: true }
    │
    ├─ "Give me tiling problems" / "Test my knowledge"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Where is tiling used?" / "Real world tiling"
    │   └─ Use: initialMode: "realworld"
    │
    ├─ "Show me only [hexagons/triangles/squares]"
    │   └─ Use: additionalProps: { tileType: "hexagon" }
    │
    ├─ "Make a big grid" / "Large tiling"
    │   └─ Use: additionalProps: { gridRows: 10, gridCols: 12 }
    │
    └─ "Solve it for me" / "Show solution"
        └─ Use: additionalProps: { autoSolve: true }
```

---

## Tips for Agents

1. **For exploration**: Leave defaults, enable all modes
2. **For assessment**: Use `initialMode: "practice"`, hide other modes
3. **For motivation**: Use `initialMode: "realworld"`
4. **For odd grids**: Students can discover impossibility themselves
5. **For minimal UI**: Hide mode selector and navigation
6. **For demonstrations**: Use `autoSolve: true`
7. **For specific topics**: Provide custom questions/examples
8. **For younger students**: Use smaller grids (4×4, 5×5)
9. **For advanced students**: Use larger grids (10×10+)

---

## Common Student Queries and Responses

| Student Query | Configuration | Explanation |
|---------------|---------------|-------------|
| "What is tiling?" | Default settings | Full exploration mode |
| "Can a 5×5 grid be tiled?" | `gridRows: 5, gridCols: 5` | 25 cells = odd, impossible |
| "Why can't I tile this?" | `showCheckerboard: true` | Visualize parity argument |
| "Give me a quiz" | `initialMode: "practice"` | MCQ assessment |
| "Where is this used?" | `initialMode: "realworld"` | Real applications |
| "Make it bigger" | `gridRows: 10, gridCols: 12` | Larger challenge |
| "Just show me how" | `autoSolve: true` | Automatic solution |

---

## Educational Objectives

### Primary Concepts
1. **Tiling definition**: Covering without gaps or overlaps
2. **Parity arguments**: Odd cell counts impossible with 2×1 tiles
3. **Checkerboard technique**: Coloring proof method
4. **Regular polygons**: Only 3 tile the plane (triangles, squares, hexagons)
5. **Real-world applications**: Nature, art, technology

### Skills Developed
- Spatial reasoning
- Pattern recognition
- Mathematical proof techniques
- Problem-solving strategies
- Visual-mathematical connections

---

## Curriculum Alignment

Based on **NCERT Ganita Prakash Grade 7**, Chapter 6.2 "Tiling" (pages 155-162)

### Key Topics Covered
- Definition of tiling/tessellation
- Grid tileability with dominoes
- Checkerboard proof technique
- Regular polygon plane tiling
- Tangram concepts
- Real-world tessellation examples