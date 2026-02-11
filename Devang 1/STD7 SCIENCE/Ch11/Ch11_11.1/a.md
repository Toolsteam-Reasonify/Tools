# Sources of Light Interactive Tool - Agent README

## Overview

An interactive educational tool for teaching **Sources of Light** concepts from **NCERT Curiosity Grade 7, Chapter 11.1**. This tool features three learning modes, heavy animations, and full responsiveness.

---

## Quick Reference Table

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | number \| string | `"100%"` | Container width |
| `height` | number \| string | `"auto"` | Container height |
| `minWidth` | number | `300` | Minimum width (px) |
| `maxWidth` | number | `1200` | Maximum width (px) |
| `initialMode` | string | `"learn"` | Starting mode: `learn`, `practice`, `real_world` |
| `showModeSelector` | boolean | `true` | Show/hide mode tabs |
| `enabledModes` | array | `["learn", "practice", "real_world"]` | Which modes to enable |
| `showNavigation` | boolean | `true` | Show/hide prev/next buttons |
| `showPlayPause` | boolean | `true` | Show/hide auto-play button |
| `showStepIndicator` | boolean | `true` | Show/hide step counter |
| `initialStep` | number | `0` | Starting step (0-indexed) |
| `filterSteps` | number[] | `undefined` | Only show specific steps |
| `animationSpeed` | number | `1` | Animation speed multiplier |
| `autoPlayDuration` | number | `8000` | Auto-advance delay (ms) |
| `themeColor` | string | `"#3b82f6"` | Primary color (hex) |
| `darkMode` | boolean | `true` | Dark mode theme |
| `responsive` | boolean | `true` | Enable responsive layout |

---

## Additional Props (Tool-Specific)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `additionalProps.learnContent` | array | (defaults) | Custom learning sections |
| `additionalProps.quizQuestions` | array | (defaults) | Custom quiz questions |
| `additionalProps.realWorldExamples` | array | (defaults) | Custom real-world examples |
| `additionalProps.highlightTopic` | string | `undefined` | Topic to emphasize |
| `additionalProps.showAnimations` | boolean | `true` | Show/hide animations |
| `additionalProps.animationIntensity` | number | `1` | Animation intensity (0-2) |

---

## Learning Content Structure

### Learn Mode Steps (Default)
| Index | Title | Animation Type |
|-------|-------|---------------|
| 0 | What is Light? | `lightTravel` |
| 1 | Luminous Objects | `luminous` |
| 2 | Non-Luminous Objects | `nonLuminous` |
| 3 | Natural Light Sources | `natural` |
| 4 | Artificial Light Sources | `artificial` |
| 5 | The Mystery of Moonlight | `moonReflection` |

### Practice Mode (Default Questions)
| Index | Topic |
|-------|-------|
| 0 | Identifying luminous objects |
| 1 | Why Moon appears bright |
| 2 | First artificial light source |
| 3 | Bioluminescent organisms |
| 4 | Benefits of LED lamps |

### Real World Mode (Default Examples)
| Index | Title | Location |
|-------|-------|----------|
| 0 | LED Revolution in India | India |
| 1 | Firefly Festivals | Maharashtra, India |
| 2 | Solar Power Plants | Rajasthan, India |
| 3 | Deep Sea Creatures | Deep Oceans |
| 4 | Northern Lights | Arctic Regions |
| 5 | Diwali Festival | India |

---

## Tool Call Examples

### Example 1: Default Learn Mode
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Sources of Light",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "initialMode": "learn",
      "showModeSelector": true
    }
  },
  "instructions_for_student": "Learn about different sources of light!"
}
```

### Example 2: Practice Quiz Only
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Light Sources Quiz",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "initialMode": "practice",
      "showModeSelector": false,
      "enabledModes": ["practice"]
    }
  },
  "instructions_for_student": "Test your knowledge about light sources!"
}
```

### Example 3: Real World Examples Only
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Light in the Real World",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "initialMode": "real_world",
      "enabledModes": ["real_world"],
      "showModeSelector": false
    }
  },
  "instructions_for_student": "Discover how light sources impact our daily lives!"
}
```

### Example 4: Focus on Luminous Objects
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Luminous Objects",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "initialMode": "learn",
      "initialStep": 1,
      "filterSteps": [1],
      "showNavigation": false
    }
  },
  "instructions_for_student": "Learn about objects that emit their own light!"
}
```

### Example 5: Moon Reflection Explanation
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Why Does the Moon Shine?",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "initialMode": "learn",
      "initialStep": 5,
      "filterSteps": [5],
      "showModeSelector": false,
      "showNavigation": false
    }
  },
  "instructions_for_student": "The Moon doesn't make its own light - it reflects sunlight!"
}
```

### Example 6: Minimal UI (Static Display)
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Light Demo",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "showModeSelector": false,
      "showNavigation": false,
      "showPlayPause": false,
      "showStepIndicator": false,
      "autoPlayDuration": 0
    }
  },
  "instructions_for_student": "Light is a form of energy!"
}
```

### Example 7: Light Mode Theme
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Sources of Light",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "darkMode": false,
      "themeColor": "#16a34a"
    }
  },
  "instructions_for_student": "Explore light sources!"
}
```

### Example 8: Custom Quiz Questions
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Custom Light Quiz",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "initialMode": "practice",
      "additionalProps": {
        "quizQuestions": [
          {
            "id": "q1",
            "question": "What is the main natural source of light?",
            "options": ["Moon", "Stars", "Sun", "Fire"],
            "correctAnswer": 2,
            "explanation": "The Sun is our main natural light source."
          },
          {
            "id": "q2",
            "question": "Which insect produces its own light?",
            "options": ["Butterfly", "Firefly", "Mosquito", "Ant"],
            "correctAnswer": 1,
            "explanation": "Fireflies are bioluminescent."
          }
        ]
      }
    }
  },
  "instructions_for_student": "Answer these custom questions!"
}
```

### Example 9: Slow Animations for Younger Students
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Sources of Light (Easy)",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "animationSpeed": 0.5,
      "autoPlayDuration": 15000
    }
  },
  "instructions_for_student": "Watch the animations carefully!"
}
```

### Example 10: Indian Context Focus
```json
{
  "frontend_action": "show_interactive_tool",
  "title": "Light in India",
  "data": {
    "toolName": "sources_of_light_tool",
    "parameters": {
      "initialMode": "real_world",
      "additionalProps": {
        "realWorldExamples": [
          {
            "id": "ujala",
            "title": "UJALA LED Scheme",
            "icon": "bulb",
            "description": "Government initiative distributing LED bulbs across India.",
            "funFact": "UJALA distributed 360+ million LED bulbs!",
            "location": "India"
          },
          {
            "id": "diwali",
            "title": "Diwali Festival",
            "icon": "lamp",
            "description": "Festival of Lights celebrating victory of light over darkness.",
            "funFact": "Electricity consumption increases 20% during Diwali!",
            "location": "India"
          }
        ]
      }
    }
  },
  "instructions_for_student": "Learn about light in India!"
}
```

---

## Decision Tree for Agents

```
Student asks about light/sources of light
    │
    ├─ "What is light?" or "Explain light"
    │   └─ Use: initialMode: "learn", initialStep: 0
    │
    ├─ "What are luminous objects?"
    │   └─ Use: initialMode: "learn", initialStep: 1, filterSteps: [1]
    │
    ├─ "What are non-luminous objects?"
    │   └─ Use: initialMode: "learn", initialStep: 2, filterSteps: [2]
    │
    ├─ "Why does the Moon shine?" or "Is Moon luminous?"
    │   └─ Use: initialMode: "learn", initialStep: 5, filterSteps: [5]
    │
    ├─ "Natural sources of light"
    │   └─ Use: initialMode: "learn", initialStep: 3, filterSteps: [3]
    │
    ├─ "Artificial sources of light" or "History of lighting"
    │   └─ Use: initialMode: "learn", initialStep: 4, filterSteps: [4]
    │
    ├─ "Test me" or "Quiz about light"
    │   └─ Use: initialMode: "practice", showModeSelector: false
    │
    ├─ "Real world examples" or "Where do we see light?"
    │   └─ Use: initialMode: "real_world"
    │
    ├─ "LED" or "Bulbs" or "Energy efficient"
    │   └─ Use: initialMode: "real_world", initialStep: 0
    │
    ├─ "Fireflies" or "Bioluminescence"
    │   └─ Use: initialMode: "real_world", initialStep: 1
    │
    ├─ "Solar energy" or "Sun power"
    │   └─ Use: initialMode: "real_world", initialStep: 2
    │
    └─ "Diwali" or "Festival of lights"
        └─ Use: initialMode: "real_world", initialStep: 5
```

---

## Tips for Agents

1. **For conceptual explanations**: Use `initialMode: "learn"` with appropriate `initialStep`
2. **For assessments**: Use `initialMode: "practice"`, optionally hide mode selector
3. **For engagement**: Use `initialMode: "real_world"` to show Indian context
4. **For focused learning**: Use `filterSteps` to show only relevant content
5. **For minimal distractions**: Set `showModeSelector: false, showNavigation: false`
6. **For younger students**: Use `animationSpeed: 0.5` for slower animations
7. **For static display**: Set `autoPlayDuration: 0` and hide all navigation
8. **For custom content**: Use `additionalProps` to provide custom questions/content
9. **For accessibility**: Use `darkMode: false` for light theme
10. **For specific topics**: Combine `initialStep` with `filterSteps` for single-topic focus

---

## Error Handling

| Error | Behavior |
|-------|----------|
| Invalid `initialMode` | Defaults to `"learn"` |
| `initialStep` out of range | Clamps to valid range |
| Empty `filterSteps` | Shows all steps |
| Invalid `enabledModes` | Uses default modes |
| Empty `additionalProps` | Uses default content |
| Missing required fields in custom content | Falls back to defaults |

---

## Animation Types

| Type | Description | Used In |
|------|-------------|---------|
| `lightTravel` | Particle moving in straight line | "What is Light?" |
| `luminous` | Sun, Candle, LED bulb with glow | "Luminous Objects" |
| `nonLuminous` | Moon, Mirror, Book (reflecting) | "Non-Luminous Objects" |
| `natural` | Sun, stars, fireflies animation | "Natural Light Sources" |
| `artificial` | Fire, candle, lamp, LED | "Artificial Light Sources" |
| `moonReflection` | Sun-Moon-Earth system with rays | "Mystery of Moonlight" |

---

## Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| `xs` | < 400px | Icons only in buttons, smaller fonts |
| `sm` | < 600px | Compact layout, reduced spacing |
| `md` | < 800px | Tablet layout |
| `lg` | < 1024px | Default desktop layout |
| `xl` | ≥ 1024px | Full desktop layout |

---

## Curriculum Alignment

- **Textbook**: NCERT Curiosity Grade 7
- **Chapter**: 11 - Light: Shadows and Reflections
- **Section**: 11.1 - Sources of Light
- **Framework**: NCF 2023

### Learning Objectives Covered
1. Define luminous and non-luminous objects
2. Identify natural and artificial light sources
3. Explain how the Moon reflects sunlight
4. Trace the evolution of artificial lighting
5. Appreciate energy-efficient lighting (LED)
6. Connect science to real-world applications

---

## File Structure

```
sources-of-light/
├── SourcesOfLight.tsx         # Main React component
├── sources_of_light_schema.json   # JSON schema
└── AGENT_README.md            # This file
```

---

## Version

- **Version**: 2.0.0
- **Last Updated**: 2024
- **Compatibility**: React 18+, TypeScript 4.5+