# Shadow Formation Tool - Agent README

## Quick Reference

| Use Case | Parameters to Use |
|----------|------------------|
| "Explain how shadows form" | `initialMode: "learn"` |
| "Let me practice shadow problems" | `initialMode: "practice"` |
| "Show me real-world shadow examples" | `initialMode: "real_world"` |
| "Show light rays" | `additionalProps: { showRays: true }` |
| "Start with cat object" | `additionalProps: { initialObject: "cat" }` |
| "Use large light source" | `additionalProps: { lightSize: "large" }` |
| "Only practice mode" | `initialMode: "practice", showModeSelector: false, enabledModes: ["practice"]` |
| "Astronomy examples only" | `initialMode: "real_world", additionalProps: { filterApplications: ["Astronomy"] }` |

---

## Tool Overview

**Tool Name:** `shadow_formation_tool`

**Description:** A comprehensive interactive educational tool for teaching light, shadows, and optical properties. Features:
- **Learn Mode**: Interactive simulator showing how light travels and creates shadows
- **Practice Mode**: Quiz scenarios testing shadow knowledge
- **Real World Mode**: Real-world applications of shadows (sundials, eclipses, photography, etc.)
- **English Language**: All content in English
- **Heavy Animations**: Smooth transitions, draggable elements, visual feedback

---

## Core Parameters

### Dimensions
```typescript
width?: number;        // Default: 800 (min: 400, max: 1920)
height?: number;       // Default: 600 (min: 300, max: 1080)
```

### Mode Configuration
```typescript
initialMode?: "learn" | "practice" | "real_world";  // Default: "learn"
showModeSelector?: boolean;                          // Default: true
enabledModes?: ("learn" | "practice" | "real_world")[]; // Default: all modes
```

### UI Controls
```typescript
showNavigation?: boolean;      // Default: true (prev/next buttons)
showPlayPause?: boolean;       // Default: true (play/pause controls)
showStepIndicator?: boolean;   // Default: true (step counter)
```

### Animation & Timing
```typescript
animationSpeed?: number;       // Default: 1 (0.5 - 3.0)
autoPlayDuration?: number;     // Default: 8000ms (0 = disabled)
```

### Theme
```typescript
themeColor?: string;           // Default: "#3b82f6" (hex color)
darkMode?: boolean;            // Default: false
```

---

## Additional Props (Shadow-Specific)

### Simulator Customization
```typescript
additionalProps: {
  initialObject?: "cat" | "superhero" | "bottle" | "glass" | "paper" | "football" | "tree";
  lightSize?: "small" | "large";  // small = sharp shadows, large = soft shadows
  showRays?: boolean;              // Show light rays by default
}
```

**Object Properties:**
- `cat`, `superhero`, `tree`, `football` = **Opaque** (dark shadows)
- `bottle`, `glass` = **Translucent** (faint shadows)
- `paper` = **Semi-transparent**

### Practice Mode Customization
```typescript
additionalProps: {
  practiceScenarios?: number[];  // Filter specific scenarios (e.g., [0, 2, 4])
  randomizeScenarios?: boolean;  // Randomize order
}
```

### Real World Mode Customization
```typescript
additionalProps: {
  filterApplications?: string[];  // Filter by category
  highlightMaterialType?: "transparent" | "translucent" | "opaque" | "mixed";
}
```

**Available Categories:**
- "Time Telling"
- "Astronomy"
- "Entertainment"
- "Art"
- "Design"

### Theme Customization
```typescript
additionalProps: {
  customTheme?: {
    primaryColor?: string;    // Hex color
    secondaryColor?: string;  // Hex color
  }
}
```

---

## Usage Examples

### Example 1: Basic Learn Mode
**Student Query:** "How do shadows form?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "How Shadows Form",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "learn"
    }
  },
  "instructions_for_student": "Explore the interactive simulator to see how light and shadows work!"
}
```

---

### Example 2: Practice Mode
**Student Query:** "I want to practice shadow questions"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Shadow Practice",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "practice"
    }
  },
  "instructions_for_student": "Test your shadow knowledge with these real-world scenarios!"
}
```

---

### Example 3: Simulator with Cat and Light Rays
**Student Query:** "Show me how a cat creates a shadow with light rays visible"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Cat Shadow Experiment",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "learn",
      "additionalProps": {
        "initialObject": "cat",
        "showRays": true,
        "lightSize": "small"
      }
    }
  },
  "instructions_for_student": "Drag the cat, light, and screen to see how the shadow changes! Notice the light rays."
}
```

---

### Example 4: Large vs Small Light Source Comparison
**Student Query:** "What's the difference between small and large light sources?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Sharp vs Soft Shadows",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "learn",
      "additionalProps": {
        "initialObject": "superhero",
        "lightSize": "large",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Try switching between small and large light to see the difference! Large lights create soft, blurry shadows."
}
```

---

### Example 5: Real-World Applications (Astronomy Only)
**Student Query:** "How are shadows used in astronomy?"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Shadows in Astronomy",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "real_world",
      "additionalProps": {
        "filterApplications": ["Astronomy"]
      }
    }
  },
  "instructions_for_student": "Discover how shadows play a crucial role in astronomical phenomena!"
}
```

---

### Example 6: Translucent Object Demo
**Student Query:** "Show me how translucent objects create different shadows"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Translucent Shadows",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "learn",
      "additionalProps": {
        "initialObject": "bottle",
        "lightSize": "large",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Notice how the water bottle (translucent) creates a fainter shadow than opaque objects!"
}
```

---

### Example 7: Practice Mode - Specific Scenarios
**Student Query:** "Give me 3 practice problems about shadow size"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Shadow Size Practice",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "additionalProps": {
        "practiceScenarios": [0, 1, 2]
      }
    }
  },
  "instructions_for_student": "Test your understanding of how shadow size changes!"
}
```

---

### Example 8: Minimal UI (Demo Mode)
**Student Query:** "Just show me a quick shadow demonstration"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Shadow Demo",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "initialMode": "learn",
      "additionalProps": {
        "initialObject": "tree",
        "showRays": true
      }
    }
  },
  "instructions_for_student": "Play with the simulation! Drag the elements around."
}
```

---

### Example 9: Custom Theme
**Student Query:** "Show me shadows with a purple theme"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Shadow Formation",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "learn",
      "themeColor": "#8b5cf6",
      "additionalProps": {
        "customTheme": {
          "primaryColor": "#8b5cf6",
          "secondaryColor": "#ec4899"
        }
      }
    }
  },
  "instructions_for_student": "Explore how shadows work!"
}
```

---

### Example 10: Custom Theme with Art Applications
**Student Query:** "Show me how shadows are used in art"

```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Shadows in Art",
  "data": {
    "toolName": "shadow_formation_tool",
    "parameters": {
      "initialMode": "real_world",
      "themeColor": "#8b5cf6",
      "additionalProps": {
        "filterApplications": ["Art"],
        "customTheme": {
          "primaryColor": "#8b5cf6",
          "secondaryColor": "#ec4899"
        }
      }
    }
  },
  "instructions_for_student": "Explore how artists and photographers use shadows creatively!"
}
```

---

## Decision Tree for Agents

```
Student asks about shadows/light
    │
    ├─ "How do shadows form?" or "Explain shadows"
    │   └─ Use: initialMode: "learn"
    │
    ├─ "Practice" or "Quiz" or "Test"
    │   └─ Use: initialMode: "practice"
    │
    ├─ "Real world" or "Where are shadows used?"
    │   └─ Use: initialMode: "real_world"
    │
    ├─ Mentions specific object (cat, tree, bottle)
    │   └─ Use: additionalProps.initialObject: "[object]"
    │
    ├─ "Show light rays" or "visualize light"
    │   └─ Use: additionalProps.showRays: true
    │
    ├─ "Sharp shadows" vs "soft shadows"
    │   └─ Use: additionalProps.lightSize: "small" or "large"
    │
    ├─ "Translucent" or "transparent" or "opaque"
    │   ├─ If asking to demonstrate:
    │   │   └─ Use: additionalProps.initialObject: "bottle" (translucent) or "glass"
    │   └─ If asking for examples:
    │       └─ Use: initialMode: "real_world", additionalProps.highlightMaterialType
    │
    ├─ Specific application (sundial, eclipse, photography)
    │   └─ Use: initialMode: "real_world", additionalProps.filterApplications
    │
    └─ "Simple" or "no distractions"
        └─ Use: showModeSelector: false, showNavigation: false
```

---

## Tips for Agents

### Object Selection Guide
- **Opaque (dark shadows)**: cat, superhero, tree, football
- **Translucent (faint shadows)**: bottle, glass
- **Semi-transparent**: paper

Use translucent objects when teaching about material properties.

### Light Size Guide
- **Small light** = sharp, well-defined shadow edges (point source)
- **Large light** = soft, blurry shadow edges (extended source)

Use large light when teaching about penumbra and umbra.

### Mode Selection
- **Learn**: For "how", "why", "explain", "show me"
- **Practice**: For "quiz", "test", "practice", "questions"
- **Real World**: For "examples", "applications", "used in"

### UI Customization
- Hide mode selector for focused single-mode experiences
- Hide navigation for passive demonstrations
- Use custom theme colors to match learning context

### Performance
- Default dimensions (800x600) work well for most cases
- Increase dimensions for detailed viewing: `width: 1200, height: 800`
- Animation speed 1.0 is optimal; adjust only if requested

---

## Common Student Queries & Responses

| Student Query | Recommended Configuration |
|---------------|--------------------------|
| "What is a shadow?" | `initialMode: "learn"` |
| "How does light travel?" | `initialMode: "learn", additionalProps: { showRays: true }` |
| "Why are some shadows darker?" | `initialMode: "learn", additionalProps: { initialObject: "bottle", showRays: true }` |
| "Test my knowledge" | `initialMode: "practice"` |
| "Where are shadows used?" | `initialMode: "real_world"` |
| "Show me solar eclipse" | `initialMode: "real_world", additionalProps: { filterApplications: ["Astronomy"] }` |
| "Cat shadow demo" | `initialMode: "learn", additionalProps: { initialObject: "cat", showRays: true }` |

---

## Error Handling

### Invalid Object
- If `initialObject` not in valid list → Defaults to no pre-selection
- Valid: cat, superhero, bottle, glass, paper, football, tree

### Invalid Mode
- If `initialMode` not valid → Defaults to "learn"
- Valid: learn, practice, real_world

### Empty Filter Arrays
- Empty `filterApplications` → Shows all applications
- Empty `practiceScenarios` → Shows all scenarios

---

## Best Practices

1. **Always provide context in instructions_for_student**
   - Good: "Drag the objects to see how shadows change!"
   - Bad: "Here's the tool."

2. **Use appropriate initial settings**
   - Don't pre-select object unless specifically requested
   - Only enable `showRays` when teaching about light travel

3. **Combine features logically**
   - Translucent demo: `initialObject: "bottle"` + `showRays: true`
   - Sharp shadow demo: `lightSize: "small"` + `showRays: true`

4. **Respect user's learning style**
   - Visual learners: Use `initialMode: "learn"` with `showRays: true`
   - Practice-oriented: Use `initialMode: "practice"`
   - Contextual learners: Use `initialMode: "real_world"`

---

## Technical Notes

- **Animations**: All transitions are CSS-based with 300-600ms durations
- **Drag & Drop**: Uses mouse/touch events with smooth tracking
- **Responsive**: Adapts to provided width/height
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **No External Dependencies**: Pure React with inline styles (no Tailwind, no external CSS)
- **Language**: English only

---

## Version Info

- **Tool Version**: 2.0 (English Only)
- **Last Updated**: 2026-01-22
- **Supported Language**: English
- **Supported Modes**: Learn, Practice, Real World