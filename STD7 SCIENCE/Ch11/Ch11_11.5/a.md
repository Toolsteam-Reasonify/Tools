# Reflection of Light Tool - Agent README

## Overview
The **Reflection of Light Interactive Tool** is a comprehensive educational component for teaching students about light reflection, mirrors, and their applications. It features four distinct learning modes with smooth animations and interactive experiments.

---

## Quick Reference

### Tool Identifier
```
toolName: "reflection_of_light_tool"
```

### Available Modes
- **learn** - Animated explanations of reflection concepts (4 steps)
- **practice** - MCQ questions to test understanding (3 questions)
- **real_world** - Practical applications (mirrors, periscopes, kaleidoscopes)
- **hands_on** - Interactive mirror angle experiment

### Step IDs
| ID | Mode | Title | Description |
|----|------|-------|-------------|
| 1 | learn | What is Reflection? | Basic concept introduction |
| 2 | learn | How Does Light Reflect? | Light path demonstration |
| 3 | learn | Laws of Reflection | Angle equality principle |
| 4 | learn | Mirrors and Images | Image formation |
| 5 | practice | Question 1 | What is reflection? |
| 6 | practice | Question 2 | How does light travel? |
| 7 | practice | Question 3 | Angle calculations |
| 8 | real_world | Daily Life Mirrors | Bathroom, car mirrors |
| 9 | real_world | Periscopes | Two-mirror system |
| 10 | real_world | Kaleidoscopes | Multiple reflections |
| 11 | hands_on | Interactive Experiment | Adjustable mirror |

---

## Parameter Reference

### Core Parameters
```typescript
{
  width: number;              // 400-1200, default: 800
  height: number;             // 400-900, default: 600
  initialMode: string;        // "learn" | "practice" | "real_world" | "hands_on"
  showModeSelector: boolean;  // Show mode tabs, default: true
  enabledModes: string[];     // Array of enabled modes
  showNavigation: boolean;    // Show prev/next buttons, default: true
  showPlayPause: boolean;     // Show play/pause, default: true
  showStepIndicator: boolean; // Show step counter, default: true
  initialStep: number;        // Starting step, default: 1
  filterSteps: number[];      // Show only these steps
  animationSpeed: number;     // 0.5-3, default: 1
  autoPlayDuration: number;   // ms before auto-advance, default: 8000
  themeColor: string;         // Hex color, default: "#3b82f6"
  darkMode: boolean;          // Dark theme, default: false
}
```

### Additional Props (Tool-Specific)
```typescript
{
  additionalProps: {
    initialAngle: number;     // 0-90, mirror angle for hands_on
    showGrid: boolean;        // Background reference grid
    lightColor: string;       // Hex color for light rays
    mirrorCount: number;      // 1-3, number of mirrors
    showAngles: boolean;      // Display angle measurements
    autoRotate: boolean;      // Auto-rotate in hands_on
  }
}
```

---

## Common Usage Examples

### 1. Basic Introduction (Default)
**Student Query:** "What is reflection of light?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Reflection of Light",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {}
  },
  "instructions_for_student": "Let's learn about light reflection!"
}
```

### 2. Laws of Reflection Focus
**Student Query:** "Explain the laws of reflection"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Laws of Reflection",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [3],
      "showModeSelector": false
    }
  },
  "instructions_for_student": "The angle at which light hits equals the angle at which it bounces!"
}
```

### 3. Practice Questions
**Student Query:** "Give me some questions on reflection"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Reflection Practice",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "enabledModes": ["practice"]
    }
  },
  "instructions_for_student": "Test your knowledge with these questions!"
}
```

### 4. Interactive Experiment
**Student Query:** "Can I try adjusting a mirror?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Mirror Experiment",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "initialMode": "hands_on",
      "showModeSelector": false,
      "additionalProps": {
        "initialAngle": 45,
        "showAngles": true
      }
    }
  },
  "instructions_for_student": "Move the slider to change the mirror angle and watch the light path!"
}
```

### 5. How Periscopes Work
**Student Query:** "How does a periscope work?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Periscope Demonstration",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "initialMode": "real_world",
      "filterSteps": [9],
      "showModeSelector": false,
      "animationSpeed": 0.8
    }
  },
  "instructions_for_student": "Periscopes use two mirrors to see around corners!"
}
```

### 6. Kaleidoscope Patterns
**Student Query:** "Show me how kaleidoscopes work"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Kaleidoscope Magic",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "initialMode": "real_world",
      "filterSteps": [10],
      "showModeSelector": false
    }
  },
  "instructions_for_student": "Multiple mirrors create beautiful patterns through reflection!"
}
```

### 7. Mirror Image Formation
**Student Query:** "Why do I see myself in a mirror?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Mirror Images",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "initialMode": "learn",
      "filterSteps": [4],
      "showNavigation": false,
      "showStepIndicator": false
    }
  },
  "instructions_for_student": "Your reflection appears at the same distance behind the mirror!"
}
```

### 8. Real World Applications
**Student Query:** "Where do we use mirrors in real life?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Mirrors in Daily Life",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "initialMode": "real_world",
      "enabledModes": ["real_world"]
    }
  },
  "instructions_for_student": "Mirrors are everywhere - bathrooms, cars, and more!"
}
```

### 9. Complete Tutorial (Auto-play)
**Student Query:** "Teach me everything about reflection"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Complete Reflection Tutorial",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "initialMode": "learn",
      "enabledModes": ["learn"],
      "autoPlayDuration": 10000,
      "animationSpeed": 1.2
    }
  },
  "instructions_for_student": "Watch the complete tutorial - it will advance automatically!"
}
```

### 10. Dark Mode with Custom Theme
**Student Query:** "Show reflection with dark background"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Reflection Visualization",
  "data": {
    "toolName": "reflection_of_light_tool",
    "parameters": {
      "darkMode": true,
      "themeColor": "#8b5cf6",
      "additionalProps": {
        "lightColor": "#06b6d4"
      }
    }
  },
  "instructions_for_student": "See light reflection with enhanced visibility!"
}
```

---

## Decision Tree for Agents

```
Student query contains...

"what is reflection" / "define reflection"
  → initialMode: "learn", filterSteps: [1]

"how does light" / "light travel" / "straight line"
  → initialMode: "learn", filterSteps: [2]

"law" / "angle" / "degrees"
  → initialMode: "learn", filterSteps: [3]

"mirror image" / "why do I see" / "distance"
  → initialMode: "learn", filterSteps: [4]

"practice" / "test" / "quiz" / "questions"
  → initialMode: "practice"

"experiment" / "try" / "adjust" / "interactive"
  → initialMode: "hands_on"

"periscope" / "submarine" / "see around"
  → initialMode: "real_world", filterSteps: [9]

"kaleidoscope" / "pattern" / "multiple reflection"
  → initialMode: "real_world", filterSteps: [10]

"real life" / "daily use" / "applications"
  → initialMode: "real_world"

"everything" / "complete" / "all about"
  → initialMode: "learn", enabledModes: ["learn"], autoPlayDuration: 10000

"explain simply" / "basic"
  → filterSteps: [1, 2], showModeSelector: false
```

---

## Animation Features

The tool includes several sophisticated animations:

### Learn Mode
- **Step 1:** Animated light ray traveling to mirror and reflecting back with pulsing light source
- **Step 2:** Multiple parallel light rays showing straight-line travel with arrow heads
- **Step 3:** Angle measurement with color-coded incident and reflected rays
- **Step 4:** Object and image appearing with distance indicators

### Real World Mode
- **Step 8:** Staggered appearance of bathroom mirror, car mirror, and periscope
- **Step 9:** Animated light path through periscope showing two reflections
- **Step 10:** Rotating kaleidoscope pattern with colorful reflections

### Hands On Mode
- Real-time light ray recalculation as mirror angle changes
- Smooth angle indicator updates
- Visual feedback on slider interaction

### Practice Mode
- Button hover effects with scale transform
- Correct/incorrect feedback with color animations
- Auto-advance on correct answers

---

## Best Practices for Agents

### 1. **Mode Selection**
- Use `learn` for concept explanation
- Use `practice` for knowledge assessment
- Use `real_world` for motivation and context
- Use `hands_on` for exploration and experimentation

### 2. **Filtering Content**
- For focused explanations: Use `filterSteps` with 1-2 steps
- For comprehensive learning: Enable all steps in learn mode
- For specific applications: Filter real_world steps

### 3. **UI Customization**
- For minimal distraction: Set `showModeSelector: false`, `showNavigation: false`
- For guided learning: Keep navigation enabled
- For presentations: Enable `autoPlayDuration`

### 4. **Engagement Strategies**
- Start with `hands_on` mode to immediately engage students
- Follow with `learn` mode for concepts
- End with `practice` mode to assess understanding
- Use `real_world` mode to maintain interest

### 5. **Accessibility**
- Enable `darkMode` for low-light environments
- Adjust `animationSpeed` for students who need more/less time
- Use `showAngles` in additionalProps for detailed measurements

---

## Error Handling

### Invalid Step IDs
If `filterSteps` contains invalid IDs, they are silently ignored.

### Invalid Mode
If `initialMode` is invalid, defaults to "learn".

### Empty Enabled Modes
If `enabledModes` is empty, defaults to all modes.

### Invalid Colors
If `themeColor` or `lightColor` is invalid, uses default colors.

---

## Technical Notes

### Canvas Rendering
- All visualizations are drawn on HTML5 Canvas
- Animations use `requestAnimationFrame` for smooth 60fps
- Easing functions provide natural motion

### State Management
- React hooks manage all interactive state
- Parent component can receive step updates via `setStepDetails`
- Auto-play can be controlled with `stopAutoNext` prop

### Performance
- Efficient canvas clearing and redrawing
- Optimized animation loops
- No external dependencies for core functionality

---

## Integration Examples

### With Learning Management System
```typescript
<ReflectionOfLight
  props={{
    initialMode: 'learn',
    themeColor: '#your-brand-color'
  }}
  setStepDetails={(details) => {
    // Track student progress
    analytics.track('step_completed', details);
  }}
/>
```

### With Assessment Platform
```typescript
<ReflectionOfLight
  props={{
    initialMode: 'practice',
    enabledModes: ['practice'],
    showModeSelector: false
  }}
  setStepDetails={(details) => {
    // Submit quiz results
    if (details.currentStep === details.totalSteps) {
      submitQuizScore(practiceScore);
    }
  }}
/>
```

---

## Version Information

**Version:** 1.0.0  
**Last Updated:** 2025-01-22  
**Compatibility:** React 16.8+, TypeScript 4.0+  
**Browser Support:** Modern browsers with Canvas support

---

## Support and Feedback

For issues, feature requests, or questions about this tool, please refer to the main documentation or contact the development team.

---

## Summary

This tool provides a complete learning experience for reflection of light:
- **4 learning modes** covering theory, practice, real-world, and hands-on
- **11 animated steps** with smooth transitions
- **Fully customizable** appearance and behavior
- **Agent-friendly** with clear parameters and examples
- **Interactive experiments** for deeper understanding
- **Assessment built-in** with practice questions

Use the decision tree and examples above to quickly respond to student queries with the most appropriate configuration!