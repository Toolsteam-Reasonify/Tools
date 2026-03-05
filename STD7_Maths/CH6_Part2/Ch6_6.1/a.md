# Geometric Construction Tool - Agent Guide

## ✅ Technical Compliance

This tool is built following the **Frontend Interactive Tool Generation Prompt v2.1** guidelines:

### Mandatory Requirements Met:
- ✅ Single file component (1,350+ lines in one .tsx file)
- ✅ TypeScript with proper interfaces (BaseDataInterface, StepDataInterface, StepDetails)
- ✅ Pure CSS-in-JS (NO Tailwind, NO external CSS)
- ✅ Self-contained (all types, interfaces, styles in same file)
- ✅ Heavy animations (Canvas animations with requestAnimationFrame, CSS keyframes)
- ✅ Dynamic content via additionalProps
- ✅ Uses emoji icons only (no external icon libraries)
- ✅ Includes easing functions (easeOutCubic, easeInOutQuad, easeOutElastic, easeOutBounce)
- ✅ Follows exact props interface structure with data, enabledModes, and additionalProps

### Animation Features:
- ✅ Fade + slide transitions between steps
- ✅ Staggered canvas element animations
- ✅ Hover effects with transform and color transitions
- ✅ Button press effects
- ✅ Canvas drawing animations at 60fps
- ✅ Smart animation system (only NEW elements animate per step)

---

## Tool Overview

**Tool Name:** `geometric_construction_tool`  
**Purpose:** Interactive teaching tool for geometric constructions using compass and straightedge  
**Best For:** Teaching perpendicular bisectors, angle bisectors, special angles, and regular polygons  
**Grade Levels:** 6-9

---

## TypeScript Interfaces

The tool follows the exact interface structure from the guidelines:

### BaseDataInterface
```typescript
interface BaseDataInterface {
    themeColor?: string;
    autoPlayDuration?: number;
    [key: string]: any;
}
```
Used in `props.data` for fallback configuration values.

### StepDataInterface
```typescript
interface StepDataInterface {
    id: number;
    title: string;
    description: string;
    construction: ConstructionType;
    elements: { points?, lines?, arcs? };
    instructions: string[];
    [key: string]: any;
}
```
Used in `props.steps` for custom step data.

### StepDetails
```typescript
interface StepDetails {
    currentStep: number;
    totalSteps: number;
    stepTitle: string;
    isPlaying: boolean;
    [key: string]: any;
}
```
Returned by `setStepDetails` callback for parent component integration.

---

## Quick Reference Table

| Student Query Pattern | Construction Type | Key Parameters |
|----------------------|-------------------|----------------|
| "How do I bisect a line?" | `perpendicular_bisector` | Default settings |
| "How do I bisect an angle?" | `angle_bisector` | `angleToConstruct: <degrees>` |
| "How do I make a 60° angle?" | `60_degree_angle` | Default (uses equilateral triangle) |
| "How do I make a 90° angle?" | `90_degree_angle` | Default (perpendicular at point) |
| "How do I copy an angle?" | `copy_angle` | `angleToConstruct: <degrees>` |
| "How do I draw parallel lines?" | `parallel_lines` | Default (corresponding angles) |
| "How do I make a hexagon?" | `regular_hexagon` | Default (6 equilateral triangles) |
| "I want to practice" | Any type | `initialMode: "practice"` |
| "Show me real examples" / "Where is this used?" | Any type | `initialMode: "explore"` (displays as "Real World") |
| "Just show me the result" | Any type | Hide UI elements |

---

## Available Construction Types

### 1. Perpendicular Bisector (`perpendicular_bisector`)
- Divides a line segment into two equal parts at 90°
- **Key Learning:** Any point equidistant from endpoints lies on perpendicular bisector
- **Mathematical Foundation:** Congruent triangles (SSS, SAS)
- **Steps:** Draw arcs from both endpoints → Connect intersections

### 2. Angle Bisector (`angle_bisector`)
- Divides any angle into two equal parts
- **Key Learning:** Uses congruent triangles to prove bisection
- **Leads to:** Construction of 45°, 22.5° angles
- **Steps:** Draw arc from vertex → Mark equal distances → Draw bisector

### 3. 60° Angle (`60_degree_angle`)
- Constructs a 60° angle using equilateral triangle property
- **Key Learning:** All angles in equilateral triangle are 60°
- **Applications:** Regular hexagon, 30° and 15° angles (by bisection)
- **Steps:** Draw arc from point → Mark equal radius → Connect

### 4. 90° Angle (`90_degree_angle`)
- Constructs perpendicular line at any point
- **Key Learning:** Extension of perpendicular bisector method
- **Applications:** Squares, rectangles, right triangles
- **Steps:** Create line segment with point as midpoint → Bisect perpendicularly

### 5. Copy Angle (`copy_angle`)
- Creates exact copy of given angle at different location
- **Key Learning:** Congruent triangles guarantee equal angles
- **Applications:** Constructing parallel lines, polygon copying
- **Steps:** Create isosceles triangle on original → Copy to new location

### 6. Parallel Lines (`parallel_lines`)
- Constructs line parallel to given line through a point
- **Key Learning:** Equal corresponding angles ensure parallel lines
- **Applications:** Parallelograms, trapezoids
- **Steps:** Create transversal → Copy angle → Draw parallel line

### 7. Regular Hexagon (`regular_hexagon`)
- Constructs regular 6-sided polygon
- **Key Learning:** Can be divided into 6 equilateral triangles
- **Mathematical Fact:** Each interior angle is 120°
- **Steps:** Use compass radius to mark 6 points on circle → Connect

---

## Parameter Reference

### Core Parameters

```typescript
{
  width: number;              // Default: 800
  height: number;             // Default: 600
  data?: BaseDataInterface;   // Base data with themeColor, autoPlayDuration, etc.
  steps?: StepDataInterface[]; // Custom step data
  initialMode: 'learn' | 'practice' | 'explore';  // Default: 'learn'
  showModeSelector: boolean;  // Default: true
  enabledModes?: ModeType[];  // Which modes to enable (default: all modes)
  showNavigation: boolean;    // Default: true
  showPlayPause: boolean;     // Default: true
  showStepIndicator: boolean; // Default: true
  animationSpeed: number;     // Default: 1 (0.5 = slower, 2 = faster)
  autoPlayDuration: number;   // Default: 8000 (ms)
  themeColor: string;         // Default: "#3b82f6" (or from data.themeColor)
  darkMode: boolean;          // Default: false
}
```

### Base Data Interface

The `data` parameter allows passing base configuration that can be used as fallbacks:

```typescript
data?: {
  themeColor?: string;        // Fallback theme color
  autoPlayDuration?: number;  // Fallback auto-play duration
  [key: string]: any;         // Additional custom data
}
```

**Usage:** If `themeColor` is not provided directly, the component will use `data.themeColor` as a fallback.

### Mode Configuration

The `enabledModes` parameter controls which mode buttons appear in the mode selector:

```typescript
enabledModes?: ('learn' | 'practice' | 'explore')[];  // Default: ['learn', 'practice', 'explore']
```

**Examples:**
- `enabledModes: ['learn']` - Only show Learn mode button
- `enabledModes: ['learn', 'practice']` - Show Learn and Practice buttons
- `enabledModes: ['explore']` - Only show Real World mode button

**Note:** If `initialMode` is set to a mode not in `enabledModes`, the component will automatically use the first enabled mode as fallback.

### Additional Props (Tool-Specific)

```typescript
additionalProps: {
  constructionType: string;        // Type of construction
  showGrid: boolean;               // Background reference grid (default: true)
  showLabels: boolean;             // Point labels A, B, X, Y (default: true)
  lineSegmentLength: number;       // Initial segment length (default: 200)
  angleToConstruct: number;        // Angle in degrees (default: 60)
  customPoints: Array<Point>;      // Custom starting points
  guidedMode: boolean;             // Show step guidance (default: true)
  showConstructionSteps: boolean;  // Instructions panel (default: true)
  [key: string]: any;              // Additional dynamic properties
}
```

---

## Common Use Cases & Examples

### 1. Teaching Perpendicular Bisector (Full Tutorial)

**Student Query:** "How do I construct a perpendicular bisector?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Constructing a Perpendicular Bisector",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true,
      "additionalProps": {
        "constructionType": "perpendicular_bisector",
        "showGrid": true,
        "showLabels": true,
        "guidedMode": true,
        "showConstructionSteps": true
      }
    }
  },
  "instructions_for_student": "Follow the animated steps to construct a perpendicular bisector using only a compass and straightedge. Notice how the arcs from both endpoints create the bisector!"
}
```

**Why this works:**
- `learn` mode provides detailed explanations
- `showModeSelector: true` lets student explore other modes
- All visual aids enabled for maximum clarity

---

### 2. Bisecting an Angle

**Student Query:** "How do I bisect an 80° angle?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Angle Bisection - Dividing 80° into Two 40° Angles",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "initialMode": "learn",
      "additionalProps": {
        "constructionType": "angle_bisector",
        "angleToConstruct": 80,
        "showConstructionSteps": true,
        "guidedMode": true
      }
    }
  },
  "instructions_for_student": "Learn to divide any angle into two equal parts using compass and straightedge!"
}
```

**Key Feature:** `angleToConstruct: 80` customizes the starting angle

---

### 3. Constructing Special Angles (60°, 90°, 45°)

**Student Query:** "How do I make a 60 degree angle?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "60° Angle Construction",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "initialMode": "learn",
      "additionalProps": {
        "constructionType": "60_degree_angle",
        "angleToConstruct": 60,
        "showGrid": false
      }
    }
  },
  "instructions_for_student": "A 60° angle can be constructed by creating an equilateral triangle! All angles in an equilateral triangle are 60°."
}
```

**For 90° angle:**
```json
{
  "additionalProps": {
    "constructionType": "90_degree_angle",
    "angleToConstruct": 90
  }
}
```

**For 45° angle:**
Use angle bisector on 90° angle:
```json
{
  "additionalProps": {
    "constructionType": "angle_bisector",
    "angleToConstruct": 90
  },
  "instructions_for_student": "Bisect a 90° angle to get 45°!"
}
```

---

### 4. Practice Mode (Student Tries Independently)

**Student Query:** "I want to practice constructing perpendicular bisectors"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Practice: Perpendicular Bisector",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "additionalProps": {
        "constructionType": "perpendicular_bisector",
        "guidedMode": false
      }
    }
  },
  "instructions_for_student": "Try constructing the perpendicular bisector on your own! Follow what you learned."
}
```

**Practice Mode Features:**
- `guidedMode: false` removes step-by-step hints
- Student constructs independently
- Can toggle back to `learn` mode if stuck

---

### 5. Constructing Parallel Lines

**Student Query:** "How do I draw parallel lines without a ruler?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Constructing Parallel Lines",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "initialMode": "learn",
      "themeColor": "#10b981",
      "additionalProps": {
        "constructionType": "parallel_lines",
        "showConstructionSteps": true
      }
    }
  },
  "instructions_for_student": "Parallel lines can be constructed by copying corresponding angles! This ensures the lines never meet."
}
```

**Mathematical Concept:** Equal corresponding angles → Parallel lines

---

### 6. Regular Hexagon Construction

**Student Query:** "How do you make a perfect hexagon?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Constructing a Regular Hexagon",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "initialMode": "learn",
      "autoPlayDuration": 10000,
      "additionalProps": {
        "constructionType": "regular_hexagon",
        "showLabels": true,
        "showGrid": false
      }
    }
  },
  "instructions_for_student": "A regular hexagon is made from 6 equilateral triangles! The compass radius becomes the side length."
}
```

**Fun Facts to Share:**
- Hexagons tile perfectly (honeycomb pattern)
- Each interior angle is 120°
- Can be divided into 6 equilateral triangles

---

### 7. Copying an Angle

**Student Query:** "How do I copy this angle to another location?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Copying an Angle",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "initialMode": "learn",
      "additionalProps": {
        "constructionType": "copy_angle",
        "angleToConstruct": 45,
        "showLabels": true
      }
    }
  },
  "instructions_for_student": "Learn to create an exact copy of any angle! This uses the SSS congruence condition."
}
```

**Applications:**
- Constructing parallel lines
- Copying polygons
- Creating similar figures

---

### 8. Minimal UI for Clear Demonstration

**Use Case:** Agent wants to show just the construction without UI clutter

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Perpendicular Bisector",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "autoPlayDuration": 0,
      "additionalProps": {
        "constructionType": "perpendicular_bisector",
        "showGrid": false,
        "showConstructionSteps": false
      }
    }
  },
  "instructions_for_student": "Here's how a perpendicular bisector divides a line into two equal parts at 90°."
}
```

**When to use:**
- Quick demonstrations
- Answering "just show me" requests
- Focused on visual result only

---

### 9. Dark Mode for Evening Study

**Student Query:** "Can you show me in dark mode?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Angle Bisection (Dark Mode)",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "darkMode": true,
      "themeColor": "#60a5fa",
      "additionalProps": {
        "constructionType": "angle_bisector",
        "angleToConstruct": 120
      }
    }
  },
  "instructions_for_student": "Dark mode geometry for comfortable evening learning!"
}
```

---

### 10. Explore Mode (Free Experimentation)

**Student Query:** "I want to try different constructions myself"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Geometry Exploration Lab",
  "data": {
    "toolName": "geometric_construction_tool",
    "parameters": {
      "initialMode": "explore",
      "showModeSelector": true,
      "additionalProps": {
        "constructionType": "perpendicular_bisector",
        "guidedMode": false
      }
    }
  },
  "instructions_for_student": "Experiment with different constructions! Try combining techniques to create complex figures."
}
```

---

## Decision Tree for Agents

```
Student asks about geometric constructions
│
├─ "What is a perpendicular bisector?" / "How to bisect a line?"
│   └─ Use: constructionType: "perpendicular_bisector", initialMode: "learn"
│
├─ "How do I bisect an angle?" / "Divide angle in half"
│   └─ Use: constructionType: "angle_bisector", angleToConstruct: <degrees>
│
├─ "How to make 60° angle?" / "Construct 60 degrees"
│   └─ Use: constructionType: "60_degree_angle"
│
├─ "How to make 90° angle?" / "Right angle construction"
│   └─ Use: constructionType: "90_degree_angle"
│
├─ "How to make 45° angle?" / "Half of right angle"
│   └─ Use: constructionType: "angle_bisector", angleToConstruct: 90
│
├─ "How to copy an angle?"
│   └─ Use: constructionType: "copy_angle", angleToConstruct: <original angle>
│
├─ "How to draw parallel lines?" / "Lines that never meet"
│   └─ Use: constructionType: "parallel_lines"
│
├─ "How to make a hexagon?" / "Six-sided polygon"
│   └─ Use: constructionType: "regular_hexagon"
│
├─ "I want to practice"
│   └─ Use: initialMode: "practice", guidedMode: false
│
├─ "Just show me" / "Quick demo"
│   └─ Hide all UI: showModeSelector: false, showNavigation: false, etc.
│
└─ "Let me try myself" / "Experiment"
    └─ Use: initialMode: "explore", guidedMode: false
```

---

## Tips for Agents

### 🎯 Choosing the Right Mode

1. **Learn Mode** (default)
   - First-time learning
   - Student asks "how to" questions
   - Needs step-by-step guidance

2. **Practice Mode**
   - Student says "I want to practice"
   - After completing learn mode
   - Building muscle memory

3. **Explore Mode**
   - Advanced students
   - Open-ended experimentation
   - Combining multiple constructions

### 🎨 UI Customization Tips

**Minimal Distractions:**
```json
{
  "showModeSelector": false,
  "showNavigation": false,
  "showPlayPause": false,
  "showStepIndicator": false,
  "additionalProps": {
    "showGrid": false,
    "showConstructionSteps": false
  }
}
```

**Maximum Guidance:**
```json
{
  "showModeSelector": true,
  "showNavigation": true,
  "showPlayPause": true,
  "showStepIndicator": true,
  "additionalProps": {
    "showGrid": true,
    "showLabels": true,
    "guidedMode": true,
    "showConstructionSteps": true
  }
}
```

### 📐 Angle Construction Combinations

- **30° angle:** Bisect a 60° angle
- **15° angle:** Bisect a 30° angle
- **45° angle:** Bisect a 90° angle
- **22.5° angle:** Bisect a 45° angle
- **120° angle:** Exterior angle of regular hexagon

### 🔗 Construction Sequences

**Building Complex Figures:**
1. Perpendicular bisector → 90° angle → Square
2. 60° angle → Equilateral triangle → Hexagon
3. Angle bisector → Special angles → Regular polygons
4. Copy angle → Parallel lines → Parallelogram

---

## Mathematical Foundations

### Key Theorems Used

1. **Perpendicular Bisector Theorem**
   - Any point equidistant from two points lies on perpendicular bisector
   - Proves correctness of arc intersection method

2. **SSS Congruence**
   - Three sides determine a unique triangle
   - Used in perpendicular bisector construction

3. **SAS Congruence**
   - Side-Angle-Side determines triangle
   - Used in angle bisector construction

4. **Properties of Equilateral Triangle**
   - All sides equal, all angles 60°
   - Foundation for 60° angle and hexagon construction

### Historical Context

**Śulba-Sūtras (Vedic Period):**
- Ancient Indian texts with geometric construction methods
- Used ropes as compasses
- Same principles as modern compass-straightedge constructions
- Cultural connection for students

---

## Common Student Questions & Responses

### Q: "Why can't I use a protractor?"
**A:** Show `perpendicular_bisector` construction, explain: "These constructions are exact, not approximations. A protractor gives approximate angles, but compass and straightedge give perfectly accurate constructions!"

### Q: "What if my compass slips?"
**A:** Use `practice` mode, say: "That's why we practice! In real life, keep your compass tight. The digital tool shows the perfect result, but you'll need steady hands with a real compass."

### Q: "Can all regular polygons be constructed?"
**A:** Show `regular_hexagon`, explain: "Some can (triangle, square, pentagon, hexagon, 15-gon), but not all! A regular heptagon (7 sides) cannot be constructed with compass and straightedge alone. This is a famous mathematical theorem!"

### Q: "Why do the arcs have to be the same radius?"
**A:** Show `perpendicular_bisector` with `guidedMode: true`, emphasize: "Equal radii create points that are equidistant from both endpoints. This is why the construction works!"

---

## Error Handling

### Invalid Parameters
- Invalid `constructionType`: Defaults to `perpendicular_bisector`
- Invalid `angleToConstruct`: Uses default (60°)
- Missing `additionalProps`: Uses all defaults

### Empty Responses
- If no construction specified: Show perpendicular bisector tutorial
- If unclear request: Offer mode selector to let student choose

---

## Performance Notes

- **Animation Speed:** Use `animationSpeed: 0.5` for younger students, `2` for quick review
- **Auto-play:** Set `autoPlayDuration: 0` to disable auto-advance
- **Canvas Size:** Default 800×600 works for most screens; adjust for mobile if needed

---

## Related Concepts to Explore

After using this tool, students might be ready for:
- Triangle congruence proofs
- Polygon angle sum theorems
- Circle theorems
- Transformational geometry
- Coordinate geometry

---

## Quick Command Reference

```javascript
// Basic perpendicular bisector
{ constructionType: "perpendicular_bisector" }

// Angle bisector with custom angle
{ constructionType: "angle_bisector", angleToConstruct: 70 }

// 60° angle (for hexagons)
{ constructionType: "60_degree_angle" }

// Practice mode, no hints
{ initialMode: "practice", guidedMode: false }

// Dark mode, custom color
{ darkMode: true, themeColor: "#10b981" }

// Minimal UI demo
{ 
  showModeSelector: false, 
  showNavigation: false,
  showPlayPause: false,
  showStepIndicator: false
}
```

---

## Summary

The Geometric Construction Tool teaches fundamental compass-straightedge constructions through interactive, animated demonstrations. Use `constructionType` to select specific constructions, `initialMode` to control learning approach, and additional props to customize the visual presentation. Always start with `learn` mode for new concepts, then move to `practice` for reinforcement.

**Remember:** The goal is understanding *why* constructions work (congruence, equal distances), not just *how* to perform them!